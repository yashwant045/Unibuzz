import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { getAllEvents } from "@/services/eventService";
import EventCard from "@/components/layout/EventCard";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    console.log("Dashboard loaded");
    loadData(); // ✅ THIS IS MISSING
  }, []);

  const loadData = async () => {
    try {
      // Load all events and recommended first
      const res = await getAllEvents();
      setEvents(res.data);

      const interests = JSON.parse(localStorage.getItem("studentInterests")) || [];
      const filtered = res.data.filter(e => 
        interests.some(interest => e.category?.toLowerCase().includes(interest.toLowerCase()))
      );
      setRecommended(filtered);

      // Load joined/upcoming
      const reg = await API.get("/api/registrations/my");
      const all = await getAllEvents();

      console.log("Registrations:", reg.data);
      console.log("Events:", all.data);
      const myEvents = all.data.filter(event =>
        reg.data.some(r => r.eventId === event.id)
      );

      const today = new Date();
      const upcomingEvents = myEvents.filter(e =>
        new Date(e.eventDate) >= today
      );

      setJoinedEvents(myEvents);
      setUpcoming(upcomingEvents);
    } catch (err) {
      console.log("ERROR:", err);
  };

  return (
    <div className="space-y-10 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <button 
          onClick={loadData}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
        >
          Refresh
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 p-6">
        <div className="text-center bg-white/70 backdrop-blur rounded-xl shadow-lg p-8 border">
          <h2 className="text-4xl font-bold text-indigo-600 mb-2">{joinedEvents.length}</h2>
          <p className="text-gray-600 font-medium">Events Joined</p>
        </div>
        <div className="text-center bg-white/70 backdrop-blur rounded-xl shadow-lg p-8 border">
          <h2 className="text-4xl font-bold text-purple-600 mb-2">{upcoming.length}</h2>
          <p className="text-gray-600 font-medium">Upcoming Events</p>
        </div>
        <div className="text-center bg-white/70 backdrop-blur rounded-xl shadow-lg p-8 border">
          <h2 className="text-4xl font-bold text-green-600 mb-2">0</h2>
          <p className="text-gray-600 font-medium">Certificates</p>
        </div>
      </div>

      {/* RECOMMENDED EVENTS */}
      {recommended.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            🎯 Recommended Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map(e => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </div>
      )}

      {/* ALL EVENTS */}
      <div>
        <h2 className="text-xl font-bold mb-6">All Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(e => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </div>
    </div>
  );
}
