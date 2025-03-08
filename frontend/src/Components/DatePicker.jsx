import React from "react";
import { format, subYears } from "date-fns";
import { CalendarIcon } from "lucide-react";

export function DatePicker({
    value,
    onChange,
    label = "Date of Birth",
    required = false
}) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-[#563393]">{label}</label>
            <input
                type="date"
                value={value ? format(value, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    if (!isNaN(selectedDate.getTime())) {
                        onChange(selectedDate);
                    }
                }}
                className="w-full p-2 border border-[#7A51B3] rounded-md text-[#563393] focus:border-[#563393] focus:outline-none"
                min={format(subYears(new Date(), 120), "yyyy-MM-dd")}
                max={format(new Date(), "yyyy-MM-dd")}
                required={required}
            />
        </div>
    );
}