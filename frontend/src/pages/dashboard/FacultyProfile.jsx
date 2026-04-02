import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { User, CalendarPlus, ClipboardList } from "lucide-react";
import { getMyEvents } from "@/services/eventService";
import API from "@/services/api";

export default function FacultyDashboard() {
  const [user, setUser] = useState({});
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // 🔹 Get user from token
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));

    setUser({
      email: payload.sub,
      role: payload.role,
    });

    loadEvents();
  }, []);

  const loadEvents = async () => {
    const res = await getMyEvents();
    setEvents(res.data);
  };

  // 🔥 VIEW REGISTRATIONS
  const viewRegistrations = async (event) => {
    const res = await API.get(`/api/registrations/event/${event.id}`);
    setRegistrations(res.data);
    setSelectedEvent(event);
    setShowModal(true);
  };

  // 🔥 SPLIT EVENTS
  const today = new Date();

  const upcoming = events.filter(
    (e) => new Date(e.eventDate) >= today
  );

  const past = events.filter(
    (e) => new Date(e.eventDate) < today
  );

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-orange-500 text-white p-6 rounded-xl flex items-center gap-4">
        <User size={40} />
        <div>
          <h2 className="text-2xl font-bold">
            Welcome, {user.email}
          </h2>
          <p>Role: FACULTY</p>
        </div>
      </div>

      {/* ACTION CARDS */}
      <div className="grid grid-cols-2 gap-6">
        <div 
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/dashboard/create-event")}
        >
          <CalendarPlus size={28} className="text-orange-600 mb-2"/>
          <h3 className="font-bold">Create Event</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <ClipboardList size={28} className="text-blue-600 mb-2"/>
          <h3 className="font-bold">Total Events: {events.length}</h3>
        </div>
      </div>

      {/* ANALYTICS CHART */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Events Analytics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: "Upcoming", value: upcoming.length },
                { name: "Past", value: past.length }
              ]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
            >
              <Cell key="upcoming" fill="#10b981" />
              <Cell key="past" fill="#ef4444" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* UPCOMING EVENTS */}
      <div>
        <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>

        <div className="grid grid-cols-3 gap-6">
          {upcoming.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onView={viewRegistrations}
            />
          ))}
        </div>
      </div>

      {/* PAST EVENTS */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Events</h2>

        <div className="grid grid-cols-3 gap-6">
          {past.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onView={viewRegistrations}
            />
          ))}
        </div>
      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <RegistrationModal
          event={selectedEvent}
          registrations={registrations}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// 🚀 2. EVENT CARD (FACULTY VERSION)
function EventCard({ event, onView }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold">{event.title}</h3>
      <p className="text-gray-500">{event.eventDate}</p>
      <p className="text-gray-500 mb-3">{event.location}</p>

      <button
        onClick={() => onView(event)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        View Registrations
      </button>
    </div>
  );
}

// 🔥 3. PROFESSIONAL REGISTRATION MODAL
function RegistrationModal({ event, registrations, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white w-[400px] p-6 rounded-xl shadow-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {event?.title}
          </h2>

          <button
            onClick={onClose}
            className="text-red-500 font-bold"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="max-h-[300px] overflow-y-auto space-y-2">

          {registrations.length === 0 ? (
            <p className="text-gray-500">
              No registrations yet
            </p>
          ) : (
            registrations.map((r) => (
              <div
                key={r.id}
                className="p-3 bg-gray-100 rounded"
              >
                {r.studentEmail}
              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}

