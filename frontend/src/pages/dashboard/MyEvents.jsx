import { useEffect, useState } from "react";
import { getMyEvents, getMyRegistrations, getAllEvents } from "@/services/eventService";

export default function MyEvents() {

  const [events, setEvents] = useState({ upcoming: [], past: [] });
  const [role, setRole] = useState("FACULTY");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    let userRole = "FACULTY";
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userRole = payload.role;
      } catch (e) {}
    }
    setRole(userRole);
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        if (role === "STUDENT") {
          const regRes = await getMyRegistrations();
          const allRes = await getAllEvents();
          const myEvents = allRes.data.filter(e => regRes.data.some(r => r.eventId === e.id));
          setEvents({ upcoming: myEvents.filter(e => new Date(e.eventDate) >= new Date()), past: myEvents.filter(e => new Date(e.eventDate) < new Date()) });
        } else {
          const data = await getMyEvents();
          const today = new Date();
          const upcoming = data.data || data.filter(e => new Date(e.eventDate) >= today);
          const past = data.data || data.filter(e => new Date(e.eventDate) < today);
          setEvents({ upcoming, past });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (role !== "GUEST") loadEvents();
  }, [role]);

  return (

    <div>

      {isLoading ? (
        <p>Loading your events...</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-8">
            {role === "STUDENT" ? "My Registered Events" : "My Events"}
          </h1>

          {events.upcoming.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.upcoming.map((event) => (
                  <div key={event.id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg">
                    <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                    <p className="text-gray-500 mb-1">{event.eventDate || event.date}</p>
                    <p className="text-sm text-gray-400">{event.location || event.venue}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {events.past.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {role === "STUDENT" ? "Past Events" : "Recent Events"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.past.map((event) => (
                  <div key={event.id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg opacity-80">
                    <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                    <p className="text-gray-500 mb-1">{event.eventDate || event.date}</p>
                    <p className="text-sm text-gray-400">{event.location || event.venue}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {events.upcoming.length === 0 && events.past.length === 0 && (
            <p className="text-gray-500 text-center py-12">No events found.</p>
          )}
        </>
      )}

    </div>

  );
}