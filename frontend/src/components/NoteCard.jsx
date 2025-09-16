import React, { useEffect, useState } from "react";
import { getComments as apiGetComments, addComment as apiAddComment, deleteNote as apiDeleteNote, reportNote as apiReportNote } from "../services/api.js";

// Displays a single note card with like/dislike buttons, save, comments, and delete (for owners)
const NoteCard = ({ note, onLike, onDislike, onToggleSave, onDelete, isSaved = false }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);

  // counts derived from arrays (fallbacks for older data)
  const likeCount = Array.isArray(note.likedBy) ? note.likedBy.length : (note.likes || 0);
  const dislikeCount = Array.isArray(note.dislikedBy) ? note.dislikedBy.length : 0;

  // Check if current user is the owner of this note
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isOwner = currentUser?.id && note.uploadedBy && 
    (currentUser.id === note.uploadedBy._id || currentUser.id === note.uploadedBy);
  
  // Check if current user has already reported this note
  const hasReported = note.reports && note.reports.some(report => 
    report.user && (report.user._id === currentUser?.id || report.user === currentUser?.id)
  );

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoadingComments(true);
        const data = await apiGetComments(note._id);
        setComments(data);
      } catch (e) {
        // Log only; UI remains usable without comments
        console.error(e);
      } finally {
        setLoadingComments(false);
      }
    };
    fetch();
  }, [note._id]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      setSubmitting(true);
      const list = await apiAddComment(note._id, commentText.trim());
      setComments(list);
      setCommentText("");
    } catch (e) {
      if (e?.response?.status === 401) alert("Please login to comment");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete note with confirmation
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    
    try {
      setDeleting(true);
      // Let the parent component handle the API call and state updates
      await onDelete(note._id);
      setShowDeleteConfirm(false);
    } catch (err) {
      // Error handling is done in the parent component
      console.error("Delete error in NoteCard:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // Handle report note functionality
  const handleReportClick = () => {
    setShowReportModal(true);
  };

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) return;
    
    try {
      setReporting(true);
      await apiReportNote(note._id, reportReason.trim());
      setShowReportModal(false);
      setReportReason("");
      console.log("Note reported successfully");
    } catch (err) {
      if (err?.response?.status === 401) {
        alert("Please login to report notes");
      } else if (err?.response?.status === 400) {
        alert(err.response.data.message || "Failed to report note");
      } else {
        alert("Failed to report note. Please try again.");
      }
      console.error("Report error:", err);
    } finally {
      setReporting(false);
    }
  };

  const handleReportCancel = () => {
    setShowReportModal(false);
    setReportReason("");
  };

  return (
    <div className="card">
      <h3>{note.title}</h3>
      <p className="muted">{note.description || "No description"}</p>
        <div className="stack">
          {/* Primary Action Buttons */}
          <div className="button-row-primary">
            <a className="button" href={note.fileUrl} target="_blank" rel="noreferrer">
              Open Resource
            </a>
            <a className="button secondary" href={note.fileUrl} download>
              ⬇️ Download
            </a>
          </div>

          {/* Secondary Action Buttons */}
          <div className="button-row-secondary">
            <button className="button secondary" onClick={() => onLike(note._id)}>
              👍 Like ({likeCount})
            </button>
            <button className="button secondary" onClick={() => onDislike(note._id)}>
              👎 Dislike ({dislikeCount})
            </button>
            <button className="button" onClick={() => onToggleSave && onToggleSave(note._id)} disabled={!onToggleSave}>
              {isSaved ? "★ Saved" : "☆ Save"}
            </button>
            {/* Show delete button only for note owners */}
            {isOwner && (
              <button 
                className="button button-delete" 
                onClick={handleDeleteClick}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "🗑️ Delete"}
              </button>
            )}
            {/* Show report button for non-owners who haven't reported yet */}
            {!isOwner && !hasReported && (
              <button 
                className="button secondary" 
                onClick={handleReportClick}
                disabled={reporting}
              >
                {reporting ? "Reporting..." : "⚠️ Report"}
              </button>
            )}
            {/* Show reported status if user has already reported */}
            {!isOwner && hasReported && (
              <span className="reported-status">
                ✅ Reported
              </span>
            )}
          </div>

          {/* Author Info */}
          <div className="author-info">
            <span className="muted">
              by {note.uploadedBy?.name || "Unknown"} on {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </div>

        <div className="stack">
          <strong>Comments ({comments.length})</strong>
          {loadingComments ? (
            <div className="muted">Loading comments...</div>
          ) : (
            <div className="stack">
              {comments.map((c) => (
                <div key={c._id || c.createdAt} className="row" style={{ alignItems: "flex-start" }}>
                  <div className="card" style={{ width: "100%" }}>
                    <div className="muted" style={{ marginBottom: 6 }}>
                      {c.user?.name || "User"} • {new Date(c.createdAt).toLocaleString()}
                    </div>
                    <div>{c.text}</div>
                  </div>
                </div>
              ))}
              {!comments.length && <div className="muted">No comments yet.</div>}
            </div>
          )}

          <form className="row" onSubmit={submitComment}>
            <input
              className="input"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button className="button" disabled={submitting}>
              {submitting ? "Posting..." : "Post"}
            </button>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginTop: 0, color: "#dc3545" }}>Confirm Delete</h3>
            <p>Are you sure you want to delete this note? This action cannot be undone.</p>
            <p><strong>Note:</strong> {note.title}</p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button 
                className="button" 
                style={{ backgroundColor: "#dc3545", color: "white" }}
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button 
                className="button secondary" 
                onClick={handleDeleteCancel}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginTop: 0, color: "#f59e0b" }}>Report Note</h3>
            <p>Please provide a reason for reporting this note:</p>
            <p><strong>Note:</strong> {note.title}</p>
            <textarea
              className="textarea"
              placeholder="Enter your reason for reporting this note..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              style={{ marginBottom: "1rem" }}
            />
            <div style={{ display: "flex", gap: "1rem" }}>
              <button 
                className="button" 
                style={{ backgroundColor: "#f59e0b", color: "white" }}
                onClick={handleReportSubmit}
                disabled={reporting || !reportReason.trim()}
              >
                {reporting ? "Reporting..." : "Submit Report"}
              </button>
              <button 
                className="button secondary" 
                onClick={handleReportCancel}
                disabled={reporting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteCard;