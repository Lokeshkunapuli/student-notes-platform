import React, { useState } from "react";
import { uploadNote as apiUploadNote } from "../services/api.js";

// API base and axios instance are managed in services/api.js

export default function UploadNotes() {
  const [form, setForm] = useState({ title: "", description: "", fileUrl: "", tags: [] });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const data = await apiUploadNote(form);
      setMsg(`Uploaded: ${data.title}`);
      setForm({ title: "", description: "", fileUrl: "", tags: [] });
    } catch (err) {
      setMsg(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Upload Note</h2>
      <form className="stack" onSubmit={onSubmit}>
        <input className="input" placeholder="Title" name="title" value={form.title} onChange={onChange} required />
        <textarea className="textarea" placeholder="Description" name="description" value={form.description} onChange={onChange} />
        <input className="input" placeholder="File URL (e.g., Google Drive / Cloudinary link)" name="fileUrl" value={form.fileUrl} onChange={onChange} required />
        {/* Simple tags multi-select via comma-separated input (beginner-friendly) */}
        <input
          className="input"
          placeholder="Tags (comma-separated, e.g., Math, Physics, CSE)"
          name="tags"
          value={form.tags.join(", ")}
          onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
        />
        <button className="button" disabled={loading}>{loading ? "Uploading..." : "Upload"}</button>
        {msg && <span className="muted">{msg}</span>}
      </form>
    </section>
  );
}