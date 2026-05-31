import React, { useState, useEffect } from 'react';
import { registerEvent, getEventRegistrations, getMyRegistrations, markAttended } from "@/services/eventService";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Users, Mail, GraduationCap, CheckCircle2, Circle, Loader2 } from "lucide-react";

function EventCard({ event, isPast = false }) {
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
      window.location.reload();
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

  // ── Mark attendance handler ───────────────────────────────────────────
  const [marking, setMarking] = useState(null); // studentEmail being toggled

  const handleToggleAttendance = async (studentEmail) => {
    setMarking(studentEmail);
    try {
      const res = await markAttended(event.id, studentEmail);
      const newAttended = res.data.attended; // use server's truth
      setRegistrations((prev) =>
        prev.map((r) =>
          r.studentEmail === studentEmail ? { ...r, attended: newAttended } : r
        )
      );
    } catch (err) {
      console.error("Failed to toggle attendance", err);
      alert("Could not update attendance. Please try again.");
    } finally {
      setMarking(null);
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

  const attendedCount = registrations.filter((r) => r.attended).length;

  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200 flex flex-col h-full bg-white group rounded-2xl">
        {/* Banner area */}
        <div className={`h-24 relative overflow-hidden flex items-start justify-end p-3 ${isPast ? 'bg-gradient-to-br from-gray-400 to-gray-500' : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600'}`}>
          <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-transparent"></div>
          {event.category && (
            <Badge className="relative z-10 bg-white/90 text-indigo-700 hover:bg-white border-none shadow-sm backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
              {event.category}
            </Badge>
          )}
        </div>

        <CardContent className="flex-grow flex flex-col p-5 pt-4">
          <h2 className="text-xl font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors">
            {event.title}
          </h2>

          {event.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
              {event.description}
            </p>
          )}

          <div className="mt-auto space-y-2">
            <div className="flex items-center text-sm text-gray-600 gap-2">
              <CalendarDays className="h-4 w-4 text-indigo-500 shrink-0" />
              <span className="font-medium truncate">{formattedDate}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600 gap-2">
              <MapPin className="h-4 w-4 text-purple-500 shrink-0" />
              <span className="font-medium truncate">{event.location || "TBA"}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600 gap-2">
              <GraduationCap className="h-4 w-4 text-pink-500 shrink-0" />
              <span className="font-medium truncate">{event.facultyEmail || "Faculty"}</span>
            </div>
            
            <div className="pt-3 mt-1 border-t border-gray-100">
              <div className="flex justify-between items-end mb-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  <Users className="h-3.5 w-3.5 text-gray-400" />
                  <span>{event.registeredCount || 0} / {event.seats || '∞'} Seats</span>
                </div>
                <span className="text-xs font-bold text-indigo-600">{percentageFilled}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                  style={{ width: `${percentageFilled}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 bg-gray-50 border-t border-gray-100">
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

      {/* ── Registration + Attendance Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header ── */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-5 text-white flex-shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">
                    Registrations & Attendance
                  </p>
                  <h2 className="text-xl font-bold text-white truncate">
                    {event.title}
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-shrink-0 text-slate-400 hover:text-white transition-colors bg-white/10 hover:bg-white/20 h-9 w-9 rounded-full flex items-center justify-center text-lg leading-none"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
                  <Users className="h-3.5 w-3.5 text-indigo-300" />
                  <span className="text-sm font-semibold text-white">
                    {registrations.length}
                    <span className="text-slate-400 font-normal"> registered</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-500/20 rounded-lg px-3 py-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-300">
                    {attendedCount}
                    <span className="text-emerald-400/70 font-normal"> present</span>
                  </span>
                </div>
              </div>

              {/* Faculty hint */}
              {isFaculty && registrations.length > 0 && (
                <p className="text-slate-400 text-xs mt-3 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-slate-500" />
                  Click <strong className="text-slate-300">Mark Present</strong> to enable certificate download for a student.
                </p>
              )}
            </div>

            {/* ── Student List ── */}
            <div className="flex-1 overflow-y-auto bg-gray-50 px-5 py-4">
              {registrations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-7 w-7 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-semibold">No registrations yet</p>
                  <p className="text-gray-400 text-sm mt-1">Students who register will appear here.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {registrations.map((reg, index) => {
                    const isAttended   = reg.attended;
                    const isBeingMarked = marking === reg.studentEmail;

                    return (
                      <div
                        key={reg.id ?? index}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all duration-200 ${
                          isAttended
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-white border-gray-100 hover:border-indigo-200 hover:shadow-sm"
                        }`}
                      >
                        {/* Index */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                          isAttended
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-indigo-50 text-indigo-600 border-indigo-100"
                        }`}>
                          {index + 1}
                        </div>

                        {/* Student info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {reg.studentName || reg.studentEmail || reg.studentId || "—"}
                          </p>
                          {reg.studentEmail && reg.studentName && (
                            <p className="text-xs text-gray-400 truncate flex items-center gap-1 mt-0.5">
                              <Mail className="h-3 w-3" />
                              {reg.studentEmail}
                            </p>
                          )}
                        </div>

                        {/* Attendance control (faculty only) */}
                        {isFaculty ? (
                          <button
                            id={`toggle-present-${reg.id}`}
                            onClick={() => handleToggleAttendance(reg.studentEmail)}
                            disabled={isBeingMarked}
                            title={isAttended ? "Click to undo attendance" : "Mark as present"}
                            className={`flex-shrink-0 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
                              isAttended
                                ? "text-emerald-700 bg-emerald-100 border-emerald-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                : "text-slate-600 bg-slate-100 border-slate-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600"
                            }`}
                          >
                            {isBeingMarked ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : isAttended ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <Circle className="h-3 w-3" />
                            )}
                            {isBeingMarked ? "Saving…" : isAttended ? "Present" : "Mark Present"}
                          </button>
                        ) : (
                          <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${
                            isAttended
                              ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                              : "text-gray-500 bg-gray-50 border-gray-200"
                          }`}>
                            {isAttended ? "Present" : "Registered"}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="flex-shrink-0 px-5 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                <span className="font-bold text-gray-800">{attendedCount}</span> / {registrations.length} marked present
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EventCard;
