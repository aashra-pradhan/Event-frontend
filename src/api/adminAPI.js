import axios from "axios";

const baseUrl = "http://localhost:8000/api";
const token = JSON.parse(localStorage.getItem("access_token"));

const config = {
  headers: { Authorization: `Bearer ${token}` },
};

export const fetchAllEvents = () =>
  axios.get(`${baseUrl}/admin/events`, config);
export const updateEventStatus = (eventId, status) =>
  axios.put(`${baseUrl}/admin/events/${eventId}/status`, { status }, config);

export const fetchAllUsers = () => axios.get(`${baseUrl}/admin/users`, config);

export const deleteUser = (userId) =>
  axios.delete(`${baseUrl}/admin/users/${userId}`, config);
