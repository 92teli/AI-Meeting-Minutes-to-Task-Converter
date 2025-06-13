
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
}

const DateTimePicker = ({ date, setDate, placeholder = "Pick a date and time" }: DateTimePickerProps) => {
  const [time, setTime] = React.useState<string>("12:00");

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const [hours, minutes] = time.split(':');
      selectedDate.setHours(parseInt(hours), parseInt(minutes));
      setDate(selectedDate);
    } else {
      setDate(undefined);
    }
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    if (date) {
      const [hours, minutes] = newTime.split(':');
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours), parseInt(minutes));
      setDate(newDate);
    }
  };

  return (
    <div className="space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal border-2 border-gray-200 focus:border-purple-400 rounded-xl py-3 h-auto",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP 'at' p") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4 space-y-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
              className="pointer-events-auto"
            />
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <Label htmlFor="time" className="text-sm font-medium">
                Time:
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-auto"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateTimePicker;
