import API from "./api";

export const getAllEvents = () => {
  return API.get("/api/events");
};

export const createEvent = (data) => {
  return API.post("/api/events", data);
};

export const getMyEvents = () => {
  return API.get("/api/events/my");
};

export const deleteEvent = (id) => {
  return API.delete(`/api/events/${id}`);
};

export const registerEvent = (eventId) => {
  return API.post(`/api/registrations/${eventId}`);
};

export const getMyRegistrations = () => {
  return API.get("/api/registrations/my");
};

export const getEventRegistrations = (eventId) => {
  return API.get(`/api/registrations/event/${eventId}`);
};
