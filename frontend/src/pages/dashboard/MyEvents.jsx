import { useEffect, useState } from "react";
import { getMyEvents, getMyRegistrations, getAllEvents } from "@/services/eventService";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EventCard from "@/components/layout/EventCard";

export default function MyEvents() {

  const [events, setEvents] = useState({ upcoming: [], past: [] });
  const [role, setRole] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role || "FACULTY";
      } catch (e) {}
    }
    return "FACULTY";
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
          const parseDate = (d) => {
            if (!d) return new Date(0);
            if (Array.isArray(d)) return new Date(d[0], d[1] - 1, d[2]);
            return new Date(d);
          };

          const today = new Date();
          today.setHours(0, 0, 0, 0); // compare just the date parts

          if (role === "STUDENT") {
            const regRes = await getMyRegistrations();
            const allRes = await getAllEvents();
            const myEvents = allRes.data.filter(e => 
              regRes.data.some(r => String(r.eventId) === String(e.id))
            );
            
            setEvents({ 
              upcoming: myEvents.filter(e => parseDate(e.eventDate) >= today), 
              past: myEvents.filter(e => parseDate(e.eventDate) < today) 
            });
          } else {
            const data = await getMyEvents();
            const eventsList = data.data || data;
            
            setEvents({ 
              upcoming: eventsList.filter(e => parseDate(e.eventDate) >= today), 
              past: eventsList.filter(e => parseDate(e.eventDate) < today) 
            });
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

          <Tabs defaultValue="upcoming" className="w-full mt-6">
            <TabsList className="mb-6 bg-white shadow-sm border border-gray-100 p-1">
              <TabsTrigger value="upcoming" className="px-8 py-2">Upcoming</TabsTrigger>
              <TabsTrigger value="past" className="px-8 py-2">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {events.upcoming.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.upcoming.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-12">No upcoming events found.</p>
              )}
            </TabsContent>

            <TabsContent value="past">
              {events.past.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.past.map((event) => (
                    <div key={event.id} className="opacity-80">
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-12">No past events found.</p>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}

    </div>

  );
}