import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export function useNotes() {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiRequest("/api/notes", { token });
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  async function createNote(text) {
    const created = await apiRequest("/api/notes", {
      method: "POST",
      body: JSON.stringify({ text }),
      token,
    });

    setNotes((prev) => [created, ...prev]);
    return created;
  }

  async function deleteNote(id) {
    await apiRequest(`/api/notes/${id}`, {
      method: "DELETE",
      token,
    });

    setNotes((prev) => prev.filter((n) => n._id !== id));
  }

  return { notes, isLoading, error, createNote, deleteNote };
}
