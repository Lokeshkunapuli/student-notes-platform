import React, { useEffect, useState } from "react";
import { getNotes, likeNote, dislikeNote, toggleSave } from "../services/api.js";
import NoteCard from "../components/NoteCard.jsx";

// API base and axios instance are managed in services/api.js

export default function NotesList() {
  const [notes, setNotes] = useState([]);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNotes = async (query = "", selectedTag = "", selectedSort = "") => {
    setLoading(true);
    try {
      const data = await getNotes(query, selectedTag, selectedSort);
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(q, tag, sort);
  }, []);

  const onLike = async (id) => {
    try {
      const updated = await likeNote(id);
      setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
    } catch (err) {
      if (err?.response?.status === 401) alert("Please login to like notes");
      console.error(err);
    }
  };

  const onDislike = async (id) => {
    try {
      const updated = await dislikeNote(id);
      setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
    } catch (err) {
      if (err?.response?.status === 401) alert("Please login to dislike notes");
      console.error(err);
    }
  };

  const onToggleSave = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?.id) {
        alert("Please login to save notes");
        return;
      }
      const data = await toggleSave(user.id, id);
      const savedSet = new Set((data.savedNoteIds || []).map((x) => x.toString()));
      // Refresh local note flags by syncing saved IDs to each note if present in response (optional)
      setNotes((prev) => prev.map((n) => ({ ...n, __isSaved: savedSet.has(n._id) })));
    } catch (err) {
      if (err?.response?.status === 401) alert("Please login to save notes");
      console.error(err);
    }
  };

  // Handle note deletion - remove from local state
  const onDelete = (deletedNoteId) => {
    setNotes((prev) => prev.filter((note) => note._id !== deletedNoteId));
  };

  return (
    <div className="stack">
      <section className="card">
        <div className="stack">
          {/* Search bar */}
          <div className="row">
            <input
              className="input"
              placeholder="Search notes by title, description, or comments..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchNotes(q, tag, sort)}
            />
            <button className="button" onClick={() => fetchNotes(q, tag, sort)}>Search</button>
          </div>
          
          {/* Filters row */}
          <div className="row">
            <select className="input" value={tag} onChange={(e) => setTag(e.target.value)}>
              <option value="">All Tags</option>
              <option value="Math">Math</option>
              <option value="Physics">Physics</option>
              <option value="CSE">CSE</option>
            </select>
            
            <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Sort by...</option>
              <option value="recent">Most Recent</option>
              <option value="likes">Most Liked</option>
              <option value="comments">Most Commented</option>
            </select>
            
            <button className="button" onClick={() => fetchNotes(q, tag, sort)}>Apply Filters</button>
            <button className="button secondary" onClick={() => { setQ(""); setTag(""); setSort(""); fetchNotes("", "", ""); }}>
              Clear All
            </button>
          </div>
        </div>
      </section>

      {loading ? (
        <section className="card">Loading...</section>
      ) : (
        <section className="grid">
          {notes.map((note) => (
            <NoteCard 
              key={note._id} 
              note={note} 
              onLike={onLike} 
              onDislike={onDislike} 
              onToggleSave={onToggleSave} 
              onDelete={onDelete}
              isSaved={note.__isSaved || false} 
            />
          ))}
          {!notes.length && <div className="card">No notes found.</div>}
        </section>
      )}
    </div>
  );
}