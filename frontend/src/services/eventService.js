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

/**
 * Downloads a PDF certificate for a given registrationId.
 * responseType: 'blob' is required to receive binary data correctly.
 */
export const downloadCertificate = (registrationId) => {
  return API.get(`/api/certificates/download/${registrationId}`, {
    responseType: "blob",
  });
};

/**
 * Faculty marks a student as attended for a specific event.
 * PUT /api/registrations/{eventId}/attend?studentEmail=...
 */
export const markAttended = (eventId, studentEmail) => {
  return API.put(`/api/registrations/${eventId}/attend`, null, {
    params: { studentEmail },
  });
};
