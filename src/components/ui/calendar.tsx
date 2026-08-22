"use client";

import * as React from "react";
import DayPicker, { DayPickerProps } from "react-day-picker";
import "react-day-picker/lib/css/react-day-picker.css";
import { useState } from "react";

/**
 * Calendar component
 * Rota: /calendar
 */
export default function Calendar() {
  const [selected, setSelected] = useState<DayPickerProps["selected"]>();

  return (
    <div className="space-y-2">
      <DayPicker
        selected={selected}
        onSelect={setSelected}
        mode="single"
        className="w-full"
      />
    </div>
  );
}