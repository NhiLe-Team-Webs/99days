import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { addMonths } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  // support controlled month prop but maintain internal state for our custom nav
  const controlledMonth = (props as any).month as Date | undefined;
  const [month, setMonth] = React.useState<Date>(controlledMonth ?? new Date());

  React.useEffect(() => {
    if (controlledMonth) setMonth(controlledMonth);
  }, [controlledMonth]);

  return (
    <>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          month_caption: "flex justify-center pt-1 relative items-center",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          /* hide the built-in nav so we can render it below */
          nav: "hidden",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse",
          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          cell:
            "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          // keep the day as a plain cell so it stays in the 7-column grid
          day: "h-9 w-9 text-center text-sm p-0 relative aria-selected:opacity-100",
          // button gets the interactive styles
          day_button: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal"),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        }}
        month={month}
        onMonthChange={(m) => {
          setMonth(m);
          if (typeof props.onMonthChange === "function") props.onMonthChange(m);
        }}
        {...props}
      />

      {/* custom nav rendered below the calendar */}
      <div className="flex items-center justify-center space-x-2 mt-2">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setMonth((d) => addMonths(d, -1))}
          className={cn(buttonVariants({ variant: "outline" }), "h-8 w-8 p-0")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setMonth((d) => addMonths(d, 1))}
          className={cn(buttonVariants({ variant: "outline" }), "h-8 w-8 p-0")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
