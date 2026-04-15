import { useState } from "react";

export default function DeleteConfirm({ habitName, onConfirm, onCancel }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await onConfirm();
    } catch {
      setIsDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div className="w-full max-w-sm mx-4 bg-white rounded-xl border border-gray-200/80 shadow-xl shadow-gray-200/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-gray-800">Delete Habit</h2>
            <p className="text-[12px] text-gray-400">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-[13px] text-gray-500 mb-6 pl-[52px]">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-700">{habitName}</span>?
        </p>

        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="cursor-pointer text-[13px] px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="cursor-pointer text-[13px] font-medium px-4 py-2 rounded-lg bg-gradient-to-b from-red-500 to-red-600 text-white shadow-sm shadow-red-200 hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
