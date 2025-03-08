import requests
import math
import warnings
from bs4 import BeautifulSoup
import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import LabelEncoder
from PIL import Image

warnings.filterwarnings("ignore")
# st.set_option("deprecation.showPyplotGlobalUse", False)

def get_data_from_excel():
    dtypes = {
        "Unnamed: 0": "int32",
        "drugName": "category",
        "condition": "category",
        "review": "category",
        "rating": "float32",
        "date": "string",
        "usefulCount": "int16",
    }
    chunk_size = 10000
    train_chunks = []
    for chunk in pd.read_csv(
        r"drugsComTrain_raw.tsv",
        sep="\t",
        quoting=2,
        dtype=dtypes,
        chunksize=chunk_size,
    ):
        train_chunks.append(chunk)
    train_df = pd.concat(train_chunks)

    test_chunks = []
    for chunk in pd.read_csv(
        r"drugsComTest_raw.tsv",
        sep="\t",
        quoting=2,
        dtype=dtypes,
        chunksize=chunk_size,
    ):
        test_chunks.append(chunk)
    test_df = pd.concat(test_chunks)

    # Convert date to datetime format
    train_df["date"] = pd.to_datetime(train_df["date"], format="%B %d, %Y", errors="coerce")
    test_df["date"] = pd.to_datetime(test_df["date"], format="%B %d, %Y", errors="coerce")

    # Extract day, month, and year
    for df in [train_df, test_df]:
        df["day"] = df["date"].dt.day.astype("int8")
        df["month"] = df["date"].dt.month.astype("int8")
        df["year"] = df["date"].dt.year.astype("int16")

    # Combine dataframes
    df = pd.concat([train_df, test_df], ignore_index=True)
    return train_df, test_df, df

def web_scraping(qs):
    try:
        URL = f"https://www.drugs.com/{qs}.html"
        page = requests.get(URL)
        page.raise_for_status()
        soup = BeautifulSoup(page.content, "html.parser")

        title = soup.find("h2", id="uses")
        title = title.text if title else "Not Available"

        description = soup.find("h2", id="uses").find_next("p")
        description = description.text if description else "Not Available"

        warnings = soup.find("h2", id="warnings").find_next("strong")
        warnings = warnings.text if warnings else "Not Available"

        before_taking_title = soup.find("h2", id="before-taking")
        before_taking_title = before_taking_title.text if before_taking_title else "Not Available"

        before_taking_items = soup.find("h2", id="before-taking").find_next("ul")
        before_taking_list = [li.text.strip() for li in before_taking_items.find_all("li")] if before_taking_items else []

        return {
            "title": title,
            "description": description,
            "warnings": warnings,
            "before_taking_title": before_taking_title,
            "before_taking_list": before_taking_list,
        }
    except Exception as e:
        return {"error": str(e)}

def home(df):
    st.title("💊 MediTrust: Honest Reviews for Better Health 💙")

    header_image = Image.open("drug.png")
    st.image(header_image, use_column_width=True)

    # Sidebar input for the medicine name
    st.sidebar.header("🔍 Please Filter Here:")
    drug = st.sidebar.text_input("🔎 Enter the Medicine Name")

    # Proceed only if a drug name is provided
    if drug:
        drug = drug.title()
        df_selection = df.query("drugName == @drug")

        # Show basic statistics
        total_count = int(df_selection["usefulCount"].sum())
        average_rating = round(df_selection["rating"].mean(), 1)

        left_column, middle_column, right_column = st.columns(3)
        with left_column:
            st.subheader("👍 Useful Count:")
            st.subheader(f"{total_count:,}")
        with middle_column:
            st.subheader("⭐ Average Rating:")
            st.subheader(f"{average_rating}")
        with right_column:
            st.subheader("📊 Approx Ratings:")
            st.subheader(f"{'⭐' * int(round(average_rating, 0)) if not math.isnan(average_rating) else 'No Ratings'}")

        # Fetch description and warnings from drugs.com
        scraped_data = web_scraping(drug.lower())
        if "error" not in scraped_data:
            st.subheader("📖 Drug Details")
            st.write("**🏷 Title:**", scraped_data.get("title", "Not Available"))
            st.write("**📄 Description:**", scraped_data.get("description", "Not Available"))
            st.write("**⚠️ Warnings:**", scraped_data.get("warnings", "Not Available"))
            st.subheader(f"📝 {scraped_data.get('before_taking_title', 'Before Taking Information')}")
            for item in scraped_data.get("before_taking_list", []):
                st.write(f"- {item}")
        else:
            st.error("🚫 No description found for the entered medicine.")

        # Allow the user to input their review and rating
        st.subheader("✍️ Provide Your Review and Rating")
        review = st.text_area("💬 Enter your Review:")
        rating = st.slider("🌟 Rate the Drug", min_value=0, max_value=5, step=1)
        submitted = st.button("📩 Submit")

        # Save review and rating if the submit button is clicked
        if submitted:
            if review and rating > 0:
                new_entry = pd.DataFrame([{
                    "drugName": drug,
                    "review": review,
                    "rating": rating,
                    "usefulCount": 0,
                    "date": pd.Timestamp.now()
                }])
                df = pd.concat([df, new_entry], ignore_index=True)
                st.success("✅ Thank you for your review and rating!")
            else:
                st.warning("⚠️ Please provide both a review and a rating before submitting.")
    else:
        st.info("ℹ️ Please enter a medicine name in the sidebar to see details.")

def admin(train_df, test_df, df):
    st.subheader("🔐 Admin Dashboard")

    st.write("📊 **Descriptive Statistics**")
    st.write(df.select_dtypes(include=["number", "datetime"]).describe())

    st.write("📌 **Scatter Plot: Drug Name vs Ratings (Testing Data)**")
    plt.figure(figsize=(8, 6))
    sns.scatterplot(x=test_df["drugName"].astype(str), y=test_df["rating"])
    plt.xticks(rotation=90)
    st.pyplot()

    st.write("📊 **Drug Name Frequency Histogram**")
    plt.figure(figsize=(8, 6))
    train_df["drugName"].value_counts().plot(kind="bar")
    plt.xlabel("📌 Drug Name")
    plt.ylabel("📊 Frequency")
    st.pyplot()

    st.write("📦 **Box Plot of Ratings**")
    plt.figure(figsize=(8, 6))
    sns.boxplot(x="rating", data=train_df)
    st.pyplot()

def main():
    st.set_page_config(page_title="MediTrust", layout="wide")
    train_df, test_df, df = get_data_from_excel()

    tab = st.radio("📌 Select Tab", options=["🏠 Home", "🔐 Admin"], index=0)
    if tab == "🏠 Home":
        home(df)
    elif tab == "🔐 Admin":
        admin(train_df, test_df, df)

if __name__ == "__main__":
    main()
