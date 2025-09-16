import React, { useEffect, useState } from "react";
import NoteCard from "../components/NoteCard.jsx";
import { dislikeNote, likeNote, getUserProfile, toggleSave, deleteNote } from "../services/api.js";

export default function ProfilePage() {
  const [uploadedNotes, setUploadedNotes] = useState([]);
  const [likedNotes, setLikedNotes] = useState([]);
  const [dislikedNotes, setDislikedNotes] = useState([]);
  const [savedNotes, setSavedNotes] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!user?.id) return;
        const data = await getUserProfile(user.id);
        setUploadedNotes(data.uploadedNotes || []);
        setLikedNotes(data.likedNotes || []);
        setDislikedNotes(data.dislikedNotes || []);
        setSavedNotes(data.savedNotes || []);
        setSavedIds((data.savedNotes || []).map((n) => n._id));
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [user?.id]);

  const onLike = async (id) => {
    try {
      const updated = await likeNote(id);
      setUploadedNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
      setLikedNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
      setDislikedNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
      setSavedNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
    } catch (err) {
      if (err?.response?.status === 401) alert("Please login to like notes");
      console.error(err);
    }
  };

  const onDislike = async (id) => {
    try {
      const updated = await dislikeNote(id);
      setUploadedNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
      setLikedNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
      setDislikedNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
      setSavedNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
    } catch (err) {
      if (err?.response?.status === 401) alert("Please login to dislike notes");
      console.error(err);
    }
  };

  const onToggleSave = async (noteId) => {
    try {
      const data = await toggleSave(user.id, noteId);
      setSavedNotes(data.savedNotes || []);
      setSavedIds((data.savedNoteIds || []).map((id) => id.toString()));
    } catch (err) {
      if (err?.response?.status === 401) alert("Please login to save notes");
      console.error(err);
    }
  };

  // Handle note deletion - remove from all relevant state arrays
  const onDelete = async (deletedNoteId) => {
    try {
      // Call the API to delete the note from the database
      await deleteNote(deletedNoteId);
      
      // Remove the deleted note from all state arrays immediately
      setUploadedNotes((prev) => prev.filter((note) => note._id !== deletedNoteId));
      setLikedNotes((prev) => prev.filter((note) => note._id !== deletedNoteId));
      setDislikedNotes((prev) => prev.filter((note) => note._id !== deletedNoteId));
      setSavedNotes((prev) => prev.filter((note) => note._id !== deletedNoteId));
      
      // Also remove from savedIds array
      setSavedIds((prev) => prev.filter((id) => id !== deletedNoteId));
      
      console.log("Note deleted successfully");
    } catch (err) {
      // Handle errors silently for better UX - no blocking alerts
      if (err?.response?.status === 401) {
        console.warn("Please login to delete notes");
        // Optionally show a non-blocking toast notification here
      } else if (err?.response?.status === 403) {
        console.warn("You can only delete your own notes");
        // Optionally show a non-blocking toast notification here
      } else if (err?.response?.status === 404) {
        // Note not found - remove from UI anyway (might already be deleted)
        console.warn("Note not found - removing from UI");
        setUploadedNotes((prev) => prev.filter((note) => note._id !== deletedNoteId));
        setLikedNotes((prev) => prev.filter((note) => note._id !== deletedNoteId));
        setDislikedNotes((prev) => prev.filter((note) => note._id !== deletedNoteId));
        setSavedNotes((prev) => prev.filter((note) => note._id !== deletedNoteId));
        setSavedIds((prev) => prev.filter((id) => id !== deletedNoteId));
      } else {
        console.error("Failed to delete note:", err);
        // Optionally show a non-blocking toast notification here
      }
    }
  };

  return (
    <div className="stack">
      <section className="card">
        <h2>Profile</h2>
        <p className="muted">{user?.name} — {user?.email}</p>
      </section>

      <section>
        <h3>My Uploads</h3>
        <div className="grid">
          {uploadedNotes.map((note) => (
            <NoteCard 
              key={note._id} 
              note={note} 
              onLike={onLike} 
              onDislike={onDislike} 
              onToggleSave={onToggleSave} 
              onDelete={onDelete}
              isSaved={savedIds.includes(note._id)} 
            />
          ))}
          {!uploadedNotes.length && <div className="card">You have not uploaded any notes yet.</div>}
        </div>
      </section>

      <section>
        <h3>Liked Notes</h3>
        <div className="grid">
          {likedNotes.map((note) => (
            <NoteCard 
              key={note._id} 
              note={note} 
              onLike={onLike} 
              onDislike={onDislike} 
              onToggleSave={onToggleSave} 
              onDelete={onDelete}
              isSaved={savedIds.includes(note._id)} 
            />
          ))}
          {!likedNotes.length && <div className="card">No liked notes yet.</div>}
        </div>
      </section>

      <section>
        <h3>Disliked Notes</h3>
        <div className="grid">
          {dislikedNotes.map((note) => (
            <NoteCard 
              key={note._id} 
              note={note} 
              onLike={onLike} 
              onDislike={onDislike} 
              onToggleSave={onToggleSave} 
              onDelete={onDelete}
              isSaved={savedIds.includes(note._id)} 
            />
          ))}
          {!dislikedNotes.length && <div className="card">No disliked notes yet.</div>}
        </div>
      </section>

      <section>
        <h3>Saved Notes</h3>
        <div className="grid">
          {savedNotes.map((note) => (
            <NoteCard 
              key={note._id} 
              note={note} 
              onLike={onLike} 
              onDislike={onDislike} 
              onToggleSave={onToggleSave} 
              onDelete={onDelete}
              isSaved={true} 
            />
          ))}
          {!savedNotes.length && <div className="card">No saved notes yet.</div>}
        </div>
      </section>
    </div>
  );
}