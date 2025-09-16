import React, { useEffect, useState } from "react";
import { adminListUsers, adminListNotes, adminToggleBlockUser, adminDeleteNote, adminGetReportedNotes } from "../services/api.js";

// Simple Admin Panel for managing users and notes
// Requires the logged-in user to have isAdmin=true (route should be protected higher up)
export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [reportedNotes, setReportedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const [u, n, r] = await Promise.all([
          adminListUsers(), 
          adminListNotes(), 
          adminGetReportedNotes()
        ]);
        setUsers(u);
        setNotes(n);
        setReportedNotes(r);
      } catch (err) {
        console.error(err);
        alert("Failed to load admin data. Are you an admin?");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const confirmAndToggleBlock = async (userId, isBlocked) => {
    if (!window.confirm(`Are you sure you want to ${isBlocked ? "unblock" : "block"} this user?`)) return;
    try {
      const { id, isBlocked: newState } = await adminToggleBlockUser(userId);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isBlocked: newState } : u)));
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  const confirmAndDeleteNote = async (noteId) => {
    if (!window.confirm("Delete this note? This cannot be undone.")) return;
    try {
      await adminDeleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (!currentUser?.isAdmin) {
    return <section className="card">Admin access required.</section>;
  }

  return (
    <div className="stack">
      <section className="card">
        <h2>Admin Panel</h2>
        <p className="muted">Manage users, notes, and reports</p>
        
        {/* Tab Navigation */}
        <div className="row" style={{ marginTop: "1rem" }}>
          <button 
            className={`button ${activeTab === "users" ? "" : "secondary"}`}
            onClick={() => setActiveTab("users")}
          >
            Users ({users.length})
          </button>
          <button 
            className={`button ${activeTab === "notes" ? "" : "secondary"}`}
            onClick={() => setActiveTab("notes")}
          >
            Notes ({notes.length})
          </button>
          <button 
            className={`button ${activeTab === "reports" ? "" : "secondary"}`}
            onClick={() => setActiveTab("reports")}
          >
            Reports ({reportedNotes.length})
          </button>
        </div>
      </section>

      {loading ? (
        <section className="card">Loading...</section>
      ) : (
        <>
          {/* Users Tab */}
          {activeTab === "users" && (
            <section className="card">
              <h3>Users</h3>
              <div className="stack">
                {users.map((u) => (
                  <div key={u._id} className="row" style={{ justifyContent: "space-between" }}>
                    <div>
                      <strong>{u.name}</strong> <span className="muted">({u.email})</span>
                      {u.isAdmin && <span className="muted"> • Admin</span>}
                      {u.isBlocked && <span className="muted" style={{ color: "#ef4444" }}> • Blocked</span>}
                    </div>
                    <button className="button" onClick={() => confirmAndToggleBlock(u._id, u.isBlocked)}>
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                ))}
                {!users.length && <div className="muted">No users found.</div>}
              </div>
            </section>
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <section className="card">
              <h3>Notes</h3>
              <div className="stack">
                {notes.map((n) => (
                  <div key={n._id} className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong>{n.title}</strong>
                      <div className="muted">by {n.uploadedBy?.name} • {new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="row" style={{ gap: 8 }}>
                      <a className="button secondary" href={n.fileUrl} target="_blank" rel="noreferrer">Open</a>
                      <button className="button" onClick={() => confirmAndDeleteNote(n._id)}>Delete</button>
                    </div>
                  </div>
                ))}
                {!notes.length && <div className="muted">No notes found.</div>}
              </div>
            </section>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <section className="card">
              <h3>Reported Notes</h3>
              <div className="stack">
                {reportedNotes.map((note) => (
                  <div key={note._id} className="card" style={{ border: "1px solid #f59e0b" }}>
                    <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <h4>{note.title}</h4>
                        <p className="muted">{note.description}</p>
                        <div className="muted">
                          by {note.uploadedBy?.name} • {new Date(note.createdAt).toLocaleString()}
                        </div>
                        <div style={{ marginTop: "0.5rem" }}>
                          <strong style={{ color: "#f59e0b" }}>Reports ({note.reportCount}):</strong>
                          <div className="stack" style={{ marginTop: "0.5rem" }}>
                            {note.reports.map((report, index) => (
                              <div key={index} className="card" style={{ backgroundColor: "var(--bg)", padding: "0.75rem" }}>
                                <div className="muted" style={{ fontSize: "12px" }}>
                                  {report.user?.name} • {new Date(report.createdAt).toLocaleString()}
                                </div>
                                <div style={{ marginTop: "0.25rem" }}>{report.reason}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="row" style={{ gap: 8, flexDirection: "column" }}>
                        <a className="button secondary" href={note.fileUrl} target="_blank" rel="noreferrer">Open</a>
                        <button className="button" onClick={() => confirmAndDeleteNote(note._id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
                {!reportedNotes.length && <div className="muted">No reported notes found.</div>}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}


