"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/lib/css/react-day-picker.css";
import { useState } from "react";

/**
 * DatePicker component
 * Rota: /date-picker
 */
export default function DatePicker() {
  const [date, setDate] = useState<Date | null>(null);

  const handleChange = (selectedDates: Date[]) => {
    if (selectedDates[0]) {
      setDate(selectedDates[0]);
    }
  };

  return (
    <div className="space-y-2">
      <DayPicker
        onSelect={handleChange}
        mode="single"
        className="w-full"
      />
      {date && (
        <p className="text-sm text-muted-foreground">
          Selected: {date.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}