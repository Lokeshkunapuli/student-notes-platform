// Centralized Axios API service for the frontend
// - Sets base URL to the backend
// - Attaches Authorization header from localStorage token
// - Enables credentials for CORS (cookies/headers)

import axios from "axios";

// Use environment variable for API base URL, fallback to localhost for development
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Create a pre-configured Axios instance
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // allow sending credentials (cookies/headers) across origins
});

// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper: login
export async function login(email, password) {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data;
}

// Helper: signup
export async function signup(name, email, password) {
  const { data } = await api.post("/api/auth/signup", { name, email, password });
  return data;
}

// Helper: upload note (protected)
export async function uploadNote({ title, description, fileUrl, tags }) {
  const { data } = await api.post("/api/notes", { title, description, fileUrl, tags });
  return data;
}

// Helper: get notes (public, optional search, tag, and sort)
export async function getNotes(search = "", tag = "", sort = "") {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (tag) params.set("tag", tag);
  if (sort) params.set("sort", sort);
  const qs = params.toString();
  const url = qs ? `/api/notes?${qs}` : "/api/notes";
  const { data } = await api.get(url);
  return data;
}

// Helper: like note (protected)
export async function likeNote(id) {
  const { data } = await api.post(`/api/notes/${id}/like`);
  return data;
}

// Helper: dislike note (protected)
export async function dislikeNote(id) {
  const { data } = await api.post(`/api/notes/${id}/dislike`);
  return data;
}

// Helper: get comments for a note (public)
export async function getComments(noteId) {
  const { data } = await api.get(`/api/notes/${noteId}/comments`);
  return data;
}

// Helper: add a comment (protected)
export async function addComment(noteId, text) {
  const { data } = await api.post(`/api/notes/${noteId}/comments`, { text });
  return data; // returns comments array
}

// Helper: delete a note (protected, only by owner)
export async function deleteNote(noteId) {
  const { data } = await api.delete(`/api/notes/${noteId}/delete`);
  return data; // returns { message, deletedNoteId }
}

// Helper: report a note (protected)
export async function reportNote(noteId, reason) {
  const { data } = await api.post(`/api/notes/${noteId}/report`, { reason });
  return data; // returns { message, reportCount }
}

// --- Users API ---

// Fetch full user profile: user info + uploaded/liked/disliked/saved notes
export async function getUserProfile(userId) {
  const { data } = await api.get(`/api/users/${userId}`);
  return data;
}

// Toggle save/unsave a note for the current user
export async function toggleSave(userId, noteId) {
  const { data } = await api.post(`/api/users/${userId}/save`, { noteId });
  return data; // { savedNotes, savedNoteIds }
}

// --- Admin API ---
// List users (admin only)
export async function adminListUsers() {
  const { data } = await api.get(`/api/admin/users`);
  return data;
}

// List notes (admin only)
export async function adminListNotes() {
  const { data } = await api.get(`/api/admin/notes`);
  return data;
}

// Toggle block/unblock user (admin only)
export async function adminToggleBlockUser(userId) {
  const { data } = await api.patch(`/api/admin/users/${userId}/block`);
  return data; // { id, isBlocked }
}

// Delete note (admin only)
export async function adminDeleteNote(noteId) {
  const { data } = await api.delete(`/api/admin/notes/${noteId}`);
  return data; // { deleted, id }
}

// Get reported notes (admin only)
export async function adminGetReportedNotes() {
  const { data } = await api.get(`/api/admin/reports`);
  return data; // returns array of reported notes with report details
}

export default api;


