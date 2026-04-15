import { useState } from "react";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HabitCard({ habit, onToggleDay, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr className="group border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors">
        <td className="py-2.5 px-5 text-[13px] text-gray-700">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="cursor-pointer flex items-center gap-2 text-left w-full"
          >
            <svg
              className={`w-3 h-3 text-gray-300 shrink-0 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="truncate font-medium">{habit.name}</span>
          </button>
        </td>

        {WEEKDAYS.map((day) => {
          const isScheduled = habit.schedule.includes(day);
          return (
            <td key={day} className="py-2.5 px-1 text-center">
              <button
                type="button"
                onClick={() => onToggleDay(habit, day)}
                className="cursor-pointer mx-auto block"
                aria-label={`${day} ${isScheduled ? "scheduled" : "not scheduled"}`}
              >
                {isScheduled ? (
                  <span className="flex items-center justify-center w-[18px] h-[18px] rounded bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-sm shadow-indigo-200 transition-all">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                ) : (
                  <span className="block w-[18px] h-[18px] rounded border-[1.5px] border-gray-200 hover:border-gray-300 transition-colors" />
                )}
              </button>
            </td>
          );
        })}

        <td className="py-2.5 px-2 text-right">
          <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-150">
            <button
              onClick={() => onEdit(habit)}
              className="cursor-pointer p-1.5 rounded-md hover:bg-gray-100 text-gray-300 hover:text-gray-600 transition-colors"
              aria-label="Edit habit"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(habit)}
              className="cursor-pointer p-1.5 rounded-md hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
              aria-label="Delete habit"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        </td>
      </tr>

      {expanded && <HabitDetails habit={habit} />}
    </>
  );
}

function HabitDetails({ habit }) {
  const scheduledDays = habit.schedule.length > 0
    ? habit.schedule.join(", ")
    : "No days scheduled";

  return (
    <tr className="border-b border-gray-50">
      <td colSpan={9} className="px-5 py-3 bg-gradient-to-r from-gray-50/80 to-transparent">
        <div className="pl-5 flex gap-6 text-[12px]">
          <div>
            <span className="text-gray-400 block mb-0.5">Schedule</span>
            <span className="text-gray-600 font-medium">{scheduledDays}</span>
          </div>
          {habit.goal && (
            <div>
              <span className="text-gray-400 block mb-0.5">Goal</span>
              <span className="text-gray-600 font-medium">{habit.goal}</span>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
