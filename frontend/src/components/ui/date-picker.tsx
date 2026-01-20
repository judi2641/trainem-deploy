"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"

export function DatePicker({
  date,
  setDate,
  placeholder = "Select date",
  className,
}: {
  date?: Date
  setDate?: (d: Date | undefined) => void
  placeholder?: string
  className?: string
}) {

  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd.MM.yyyy") : placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[350px]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(value) => setDate?.(value)}
          captionLayout="dropdown"
        />

      </PopoverContent>
    </Popover>
  )
}
