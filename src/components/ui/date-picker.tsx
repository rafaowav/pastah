'use client'

import * as React from 'react'
import { Calendar } from './calendar'
import { useState } from 'react'

export default function DatePicker() {
  const [date, setDate] = useState<Date | undefined>(undefined)

  return (
    <div className="space-y-2">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(selectedDate: Date | undefined) => setDate(selectedDate ?? undefined)}
      />
      {date && (
        <p className="text-sm text-muted-foreground">
          Selected: {date.toLocaleDateString()}
        </p>
      )}
    </div>
  )
}
