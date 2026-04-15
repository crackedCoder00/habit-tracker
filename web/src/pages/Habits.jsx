import { useState } from "react";
import { useHabits } from "../hooks/useHabits";
import { useNotes } from "../hooks/useNotes";
import { useAuth } from "../context/AuthContext";
import HabitCard from "../components/HabitCard";
import HabitModal from "../components/HabitModal";
import DeleteConfirm from "../components/DeleteConfirm";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Habits() {
  const { habits, isLoading, error, createHabit, updateHabit, deleteHabit } =
    useHabits();
  const {
    notes,
    isLoading: notesLoading,
    createNote,
    deleteNote,
  } = useNotes();

  const [modalHabit, setModalHabit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function openCreate() {
    setModalHabit(null);
    setShowModal(true);
  }

  function openEdit(habit) {
    setModalHabit(habit);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setModalHabit(null);
  }

  async function handleSave(data) {
    if (modalHabit) {
      await updateHabit(modalHabit._id, data);
    } else {
      await createHabit(data);
    }
  }

  async function handleToggleDay(habit, day) {
    const newSchedule = habit.schedule.includes(day)
      ? habit.schedule.filter((d) => d !== day)
      : [...habit.schedule, day];
    await updateHabit(habit._id, { schedule: newSchedule });
  }

  async function handleDelete() {
    await deleteHabit(deleteTarget._id);
    setDeleteTarget(null);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200 border-t-indigo-500" />
          <span className="text-[13px] text-gray-400 animate-pulse">Loading your habits...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <TopBar />

      <div className="max-w-[1120px] mx-auto px-6 py-6">
        <div className="flex gap-5">
          <div className="flex-[7] min-w-0">
            <TrackerCard
              habits={habits}
              error={error}
              onToggleDay={handleToggleDay}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
              onAdd={openCreate}
            />
          </div>
          <div className="flex-[3] min-w-0">
            <NotesPanel
              notes={notes}
              isLoading={notesLoading}
              onCreate={createNote}
              onDelete={deleteNote}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <HabitModal habit={modalHabit} onSave={handleSave} onClose={closeModal} />
      )}
      {deleteTarget && (
        <DeleteConfirm
          habitName={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function TopBar() {
  const { user, signout } = useAuth();

  return (
    <div className="border-b border-gray-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-10">
      <div className="max-w-[1120px] mx-auto px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-sm shadow-indigo-200">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
            </svg>
          </div>
          <h1 className="text-[17px] font-semibold text-gray-800 tracking-tight">Habit Tracker</h1>
        </div>

        <div className="flex items-center gap-3">
          {user?.email && (
            <span className="text-[12px] text-gray-400">{user.email}</span>
          )}
          <button
            onClick={signout}
            className="cursor-pointer text-[12px] text-gray-400 hover:text-gray-600 transition-colors px-2.5 py-1.5 rounded-md hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

function TrackerCard({ habits, error, onToggleDay, onEdit, onDelete, onAdd }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm shadow-gray-100">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-indigo-50">
            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <span className="text-[14px] font-semibold text-gray-800">My Habits</span>
          <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
            {habits.length}
          </span>
        </div>
        <button
          onClick={onAdd}
          className="cursor-pointer text-[12px] font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-indigo-50"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add habit
        </button>
      </div>

      {error && (
        <div className="mx-5 mt-4 text-[13px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
          {error}
        </div>
      )}

      <table className="w-full text-left table-fixed">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="w-[30%] py-2.5 px-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Habit
            </th>
            {WEEKDAYS.map((day) => (
              <th key={day} className="py-2.5 px-1 text-center">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  {day}
                </span>
              </th>
            ))}
            <th className="w-[56px]" />
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => (
            <HabitCard
              key={habit._id}
              habit={habit}
              onToggleDay={onToggleDay}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>

      {habits.length === 0 && (
        <div className="px-5 py-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
            <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <p className="text-[13px] text-gray-400">No habits yet</p>
          <button
            onClick={onAdd}
            className="cursor-pointer mt-3 text-[13px] font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Create your first habit
          </button>
        </div>
      )}
    </div>
  );
}

function NotesPanel({ notes, isLoading, onCreate, onDelete }) {
  const [input, setInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    if (!input.trim()) return;

    setIsSaving(true);
    try {
      await onCreate(input.trim());
      setInput("");
    } catch {
      // error handled by hook
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm shadow-gray-100">
      <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-2.5">
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-amber-50">
          <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
        </div>
        <span className="text-[14px] font-semibold text-gray-800">Quick Notes</span>
      </div>

      <div className="p-4">
        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Jot something down..."
            className="flex-1 text-[13px] border border-gray-200 rounded-lg px-3 py-2 text-gray-700 placeholder-gray-350 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all"
          />
          <button
            type="submit"
            disabled={isSaving || !input.trim()}
            className="cursor-pointer text-[13px] px-3 py-2 rounded-lg bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-200 hover:from-indigo-600 hover:to-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </form>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-500" />
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-6">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
              <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <p className="text-[12px] text-gray-400">No notes yet</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {notes.map((note) => (
              <NoteItem key={note._id} note={note} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NoteItem({ note, onDelete }) {
  return (
    <div className="group flex items-start gap-2.5 py-2 px-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors">
      <span className="mt-[7px] block h-1.5 w-1.5 rounded-full bg-indigo-300 shrink-0" />
      <span className="flex-1 text-[13px] text-gray-600 leading-relaxed break-words">{note.text}</span>
      <button
        onClick={() => onDelete(note._id)}
        className="cursor-pointer mt-0.5 p-1 rounded-md text-gray-300 hover:text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all shrink-0"
        aria-label="Delete note"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
