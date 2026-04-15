import { useState, useEffect } from "react";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HabitModal({ habit, onSave, onClose }) {
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = Boolean(habit);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setSchedule(habit.schedule || []);
      setGoal(habit.goal || "");
    }
  }, [habit]);

  function toggleDay(day) {
    setSchedule((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setIsSaving(true);
    try {
      await onSave({ name: name.trim(), schedule, goal: goal.trim() });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div className="w-full max-w-md mx-4 bg-white rounded-xl border border-gray-200/80 shadow-xl shadow-gray-200/50 animate-[fadeIn_0.15s_ease-out]">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50">
              <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {isEditing ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                )}
              </svg>
            </div>
            <h2 className="text-[16px] font-semibold text-gray-800">
              {isEditing ? "Edit Habit" : "New Habit"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {error && (
            <p className="text-[13px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              {error}
            </p>
          )}

          <div>
            <label htmlFor="habit-name" className="block text-[13px] font-medium text-gray-600 mb-1.5">
              Habit name
            </label>
            <input
              id="habit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning run"
              className="w-full text-[13px] border border-gray-200 rounded-lg px-3.5 py-2.5 text-gray-800 placeholder-gray-350 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all"
              autoFocus
            />
          </div>

          <SchedulePicker schedule={schedule} onToggle={toggleDay} />

          <div>
            <label htmlFor="habit-goal" className="block text-[13px] font-medium text-gray-600 mb-1.5">
              Goal <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="habit-goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Run 5km every session"
              rows={2}
              className="w-full text-[13px] border border-gray-200 rounded-lg px-3.5 py-2.5 text-gray-800 placeholder-gray-350 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-[13px] px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="cursor-pointer text-[13px] font-medium px-5 py-2 rounded-lg bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-200 hover:from-indigo-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isSaving ? "Saving…" : isEditing ? "Save Changes" : "Create Habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SchedulePicker({ schedule, onToggle }) {
  return (
    <div>
      <span className="block text-[13px] font-medium text-gray-600 mb-2">Schedule</span>
      <div className="flex gap-1.5">
        {WEEKDAYS.map((day) => {
          const active = schedule.includes(day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => onToggle(day)}
              className={`cursor-pointer flex-1 text-[12px] py-1.5 rounded-lg transition-all ${
                active
                  ? "bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "border border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
