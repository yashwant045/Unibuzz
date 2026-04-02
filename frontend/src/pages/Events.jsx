import { useEffect, useState } from "react";
import { getAllEvents } from "@/services/eventService";
import EventCard from "@/components/layout/EventCard";

export default function Events() {

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await getAllEvents();
      setEvents(res.data);
      
      const interests = JSON.parse(localStorage.getItem("studentInterests")) || [];
      let filtered = res.data.filter(event => interests.includes(event.category));
      if (filtered.length === 0) {
        filtered = res.data;
      }
      setFilteredEvents(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <nav className="bg-slate-700 text-white px-10 py-5 flex justify-between items-center rounded-b-xl shadow-lg">

        <h1 className="text-2xl font-bold">
          UniBuzz
        </h1>

        <div className="flex items-center gap-8">

          <a href="/" className="hover:text-yellow-400">
            Home
          </a>

          <a href="/events" className="hover:text-yellow-400">
            Events
          </a>

          <div className="bg-yellow-400 w-10 h-10 rounded-full flex items-center justify-center text-black font-bold">
            👤
          </div>

        </div>
      </nav>


      {/* TITLE */}
      <div className="text-center mt-10 mb-10">

        <h1 className="text-3xl font-bold">
          Explore Events
        </h1>

      </div>


      {/* EVENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-16 pb-20">

        {filteredEvents.map((event) => (
          <EventCard 
            key={event.id}
            event={{
              id: event.id,
              title: event.title,
              date: event.eventDate,
              venue: event.location
            }}
          />
        ))}

      </div>

    </div>
  );
}