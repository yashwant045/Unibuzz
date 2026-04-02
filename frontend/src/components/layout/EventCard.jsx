import React, { useState, useEffect } from 'react';
import { registerEvent, getEventRegistrations, getMyRegistrations } from "@/services/eventService";

function EventCard({ event }) {
  const [showModal, setShowModal] = useState(false);
  const [registrations, setRegistrations] = useState([]);

  // Role check first
  const token = localStorage.getItem("token");
  let role = "";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
    } catch (e) {
      console.error("Token decode error", e);
    }
  }
  const isStudent = role === "STUDENT";
  const isFaculty = role === "FACULTY";

  // Registration state and logic
  const [myRegistrations, setMyRegistrations] = useState([]);

  useEffect(() => {
    if (isStudent) {
      const fetchMyRegistrations = async () => {
        try {
          const res = await getMyRegistrations();
          setMyRegistrations(res.data);
        } catch (err) {
          console.error("Failed to fetch my registrations", err);
        }
      };
      fetchMyRegistrations();
    }
  }, [isStudent]);

  const alreadyRegistered = myRegistrations.some(r => r.eventId === event.id);

  const handleRegister = async () => {
    if (!event.id || alreadyRegistered) return;
    try {
      await registerEvent(event.id);
      alert("Registered successfully!");
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      if (message.toLowerCase().includes("already registered")) {
        alert("Already registered for this event!");
      } else {
        alert("Registration failed: " + message);
      }
    }
  };

  const handleViewRegistrations = async () => {
    if (!event.id) return;
    try {
      const res = await getEventRegistrations(event.id);
      setRegistrations(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    }
  };

  return (
    <>
      <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4">
          {event.title}
        </h2>
        <p className="mb-2">
          <span className="font-semibold">Date:</span> {event.eventDate}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Location:</span> {event.location}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Faculty: {event.facultyEmail}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Seats: {event.registeredCount || 0}/{event.seats || 'N/A'}
        </p>
        <div className="space-y-2">
          {isStudent && (
            <button
              disabled={alreadyRegistered}
              onClick={handleRegister}
              className="bg-indigo-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 disabled:cursor-not-allowed w-full transition-colors"
            >
              {alreadyRegistered ? "Registered" : "Register"}
            </button>
          )}
          {isFaculty && (
            <button
              onClick={handleViewRegistrations}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 w-full transition-colors"
            >
              View Registrations
            </button>
          )}
          {!isStudent && !isFaculty && (
            <p className="text-gray-500 text-sm">Login to register/view</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Registrations for {event.title}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div>
              {registrations.length === 0 ? (
                <p className="text-gray-500 italic">No registrations yet.</p>
              ) : (
                registrations.map((reg) => (
                  <div key={reg.id} className="p-3 border-b last:border-b-0 bg-gray-50 rounded mb-1">
                    <p className="font-medium">{reg.studentEmail || reg.studentId || 'N/A'}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EventCard;

