import React, { useState, useEffect } from 'react';
import { registerEvent, getEventRegistrations, getMyRegistrations } from "@/services/eventService";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Users, Mail, GraduationCap } from "lucide-react";

function EventCard({ event }) {
  const [showModal, setShowModal] = useState(false);
  const [registrations, setRegistrations] = useState([]);

  const { isStudent, isFaculty } = React.useMemo(() => {
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
    return {
      isStudent: role === "STUDENT",
      isFaculty: role === "FACULTY"
    };
  }, []);

  const [myRegistrations, setMyRegistrations] = useState([]);

  useEffect(() => {
    if (isStudent) {
      const fetchMyRegistrations = async () => {
        try {
          const res = await getMyRegistrations();
          setMyRegistrations(res.data);
        } catch (err) {}
      };
      fetchMyRegistrations();
    }
  }, [isStudent]);

  const alreadyRegistered = myRegistrations.some(r => String(r.eventId) === String(event.id));

  const handleRegister = async () => {
    if (!event.id || alreadyRegistered) return;
    try {
      await registerEvent(event.id);
      alert("Registered successfully!");
      window.location.reload(); // Quick refresh to update state
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

  // Robust date formatting
  const formattedDate = React.useMemo(() => {
    const d = event.eventDate;
    if (!d) return "TBD";
    if (Array.isArray(d)) return `${d[0]}-${String(d[1]).padStart(2, '0')}-${String(d[2]).padStart(2, '0')}`;
    return d;
  }, [event.eventDate]);

  const percentageFilled = event.seats ? Math.min(100, Math.round(((event.registeredCount || 0) / event.seats) * 100)) : 0;
  const isFull = percentageFilled >= 100;

  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-100 flex flex-col h-full bg-white group">
        {/* Banner area */}
        <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-transparent"></div>
          {event.category && (
            <Badge className="absolute top-4 right-4 bg-white/90 text-indigo-700 hover:bg-white border-none shadow-sm backdrop-blur-sm">
              {event.category}
            </Badge>
          )}
        </div>

        <CardHeader className="-mt-8 pb-2">
          <div className="bg-white p-4 rounded-xl shadow-md inline-block w-fit mb-2 border border-gray-50">
            <CalendarDays className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 line-clamp-1 mt-2">
            {event.title}
          </h2>
        </CardHeader>

        <CardContent className="flex-grow space-y-4 pt-2">
          {event.description && (
            <p className="text-sm text-gray-500 line-clamp-2">
              {event.description}
            </p>
          )}

          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600 gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <CalendarDays className="h-4 w-4" />
              </div>
              <span className="font-medium">{formattedDate}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600 gap-3">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="font-medium">{event.location || "TBA"}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600 gap-3">
              <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="font-medium line-clamp-1">{event.facultyEmail || "Faculty"}</span>
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between items-end mb-1">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>{event.registeredCount || 0} / {event.seats || '∞'} Seats</span>
                </div>
                <span className="text-xs font-bold text-indigo-600">{percentageFilled}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                  style={{ width: `${percentageFilled}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-4 pb-6 bg-gray-50/50 border-t border-gray-100">
          {isStudent && (
            <Button
              disabled={alreadyRegistered || (isFull && !alreadyRegistered)}
              onClick={handleRegister}
              className={`w-full font-semibold tracking-wide ${
                alreadyRegistered 
                  ? "bg-green-100 text-green-700 hover:bg-green-200 border-none" 
                  : isFull 
                    ? "bg-gray-200 text-gray-500" 
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
              }`}
              variant={alreadyRegistered ? "outline" : "default"}
            >
              {alreadyRegistered ? "✓ Registered" : isFull ? "Event Full" : "Register Now"}
            </Button>
          )}
          
          {isFaculty && (
            <Button
              onClick={handleViewRegistrations}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold tracking-wide shadow-md"
            >
              View Registrations
            </Button>
          )}
          
          {!isStudent && !isFaculty && (
            <Button disabled variant="outline" className="w-full">
              Login to Register
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-0 max-w-md w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Registrations</h2>
                <p className="text-slate-300 text-sm mt-1">{event.title}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow bg-gray-50">
              {registrations.length === 0 ? (
                <div className="text-center py-10">
                  <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No registrations yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {registrations.map((reg, index) => (
                    <div key={reg.id} className="p-4 border border-gray-100 bg-white shadow-sm rounded-xl flex items-center gap-4 hover:border-indigo-200 transition-colors">
                      <div className="bg-indigo-100 text-indigo-700 w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-inner">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {reg.studentEmail || reg.studentId || 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-white border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500 font-medium">
                Total Registrations: <span className="text-indigo-600 font-bold">{registrations.length}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EventCard;
