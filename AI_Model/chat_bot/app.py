from dotenv import load_dotenv 
import streamlit as st 
import os 
import google.generativeai as genai

# Load environment variables 
load_dotenv()

#configure API key 
genai.configure(api_key = os.getenv("GEMINI_API_KEY"))

# Initialize the model 
model = genai.GenerativeModel("gemini-1.5-flash") #Fatch model

def get_response(question):
    """Fetch respnse from Gemini AI for any question."""
    try:
        response = model.generate_content(question)
        return response.text if response else "NO response received."
    except Exception as e:
        return f"Error: {str(e)}"
    
# Initialixe the Streamlit app
st.set_page_config(page_title ="AI Chatbot🤖", page_icon="🧠")

#set a header 
st.header("🤖 Ask me Anything!")

# Display some introductory text
st.write("**Ask me anything! No restrictions.**")

# Initialize chat history in session state
if "history" not in st.session_state:
    st.session_state.history = []

# Input box for user question
user_input = st.text_input("Ask your question:", key="input")

# Submit button
submit = st.button("Type your question here✨")

# Toggle chat history
show_history = st.checkbox("Show Chat History 🗨️")

# When submit is clicked
if submit and user_input:
    # Get response
    response = get_response(user_input)
    
    # Store conversation in history
    st.session_state.history.append(f"You: {user_input}")
    st.session_state.history.append(f"Bot: {response}")
    
    # Display response
    st.write(response)

# Show chat history if enabled
if show_history:
    st.write("### Chat History")
    for message in st.session_state.history:
        st.write(message)
