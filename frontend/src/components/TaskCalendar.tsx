import {
  format,
  startOfToday,
  isSameDay,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";
import { de } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface TaskCalendarProps {
  weekStart: Date;
  tasks: any[]; // besser ein genauerer Typ, z.B. ITask[] oder dein kombinierter Typ
}

export function TaskCalendar({ weekStart, tasks }: TaskCalendarProps) {

  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  return (
    <div className="space-y-4">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {format(weekStart, "EEE, dd.MM", { locale: de })} –{" "}
        {format(weekEnd, "EEE, dd.MM", { locale: de })}
      </div>

      <div className="space-y-6">
        {days.map((day) => {
          
          const dayTasks = tasks.filter((task) => {
            
            const dayShort = format(day, "eee", { locale: de });

            
            return (
              task.day === dayShort
            );
          });
          const isToday = isSameDay(day, startOfToday());

          return (
            <div
              
              className={cn(
                "border-l-4 pl-4",
                isToday ? "border-l-primary" : "border-l-border"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3
                    className={cn(
                      "text-sm font-semibold",
                      isToday ? "text-primary" : "text-foreground"
                    )}
                  >
                    {format(day, "EEEE", { locale: de })}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {format(day, "dd MMM", { locale: de })}
                  </span>
                  {isToday && (
                    <Badge className="bg-primary text-primary-foreground">
                      Today
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-primary hover:bg-primary/10"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              {dayTasks.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-2">
                  No tasks
                </p>
              ) : (
                <ul className="space-y-2">
                  {dayTasks.map((task) => (
                    <li
                      key={task._id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border transition-all",
                        task.completed
                          ? "bg-green-300/30 border-border shadow-sm"
                          : "bg-primary/30 border-border shadow-sm"
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Checkbox checked={!!task.completed} />
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full shrink-0 mt-1.5",
                            "bg-primary"
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={cn(
                                "text-sm font-medium",
                                task.completed &&
                                  "line-through text-muted-foreground"
                              )}
                            >
                              {task.title}
                            </span>
                          </div>
                          {task.discription && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {task.discription}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
