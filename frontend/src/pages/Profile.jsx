import Navbar from "@/components/layout/Navbar";
import API from "@/services/api.js";
import { useEffect, useState } from "react";
import { Calendar, Trophy, User, LogOut, Edit3, Mail } from "lucide-react";
export default function Profile() {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    role: "",
  });
  const [joinedEvents, setJoinedEvents] = useState([]);
const [upcoming, setUpcoming] = useState([]);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/api/user/profile");
        setUser({
          fullName: res.data.fullName,
          email: res.data.email,
          role: res.data.roles?.[0]?.name || "",
        });
      } catch (error) {
        console.error("Profile fetch failed", error);
      }
    };
    fetchProfile();
    loadData();
  }, []);
  const loadData = async () => {
  try {
    const reg = await API.get("/api/registrations/my");
    const all = await API.get("/api/events");

    const myEvents = all.data.filter(event =>
      reg.data.some(r => r.eventId === event.id)
    );

    const today = new Date();

    setJoinedEvents(myEvents);

    setUpcoming(
      myEvents.filter(e => new Date(e.eventDate) >= today)
    );

  } catch (err) {
    console.log("Error:", err);
  }
};
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-32 px-6">
        {/* PROFILE HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl p-8 flex items-center gap-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
            <User size={40} className="text-indigo-600"/>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold">
              {user.fullName || "Welcome Back"}
            </h2>
            <div className="flex items-center gap-2 mt-2 text-indigo-100">
              <Mail size={16}/>
              {user.email}
            </div>
            <span className="inline-block mt-3 bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold">
              {user.role}
            </span>
          </div>
          <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-50 transition">
            <Edit3 size={16}/>
            Edit Profile
          </button>
        </div>
        {/* STATS */}
        <div className="grid grid-cols-3 gap-6 mt-10">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="text-3xl font-bold text-indigo-600">
               {joinedEvents.length}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Events Joined
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
           <h3 className="text-3xl font-bold text-purple-600">
              {upcoming.length}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Upcoming Events
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="text-3xl font-bold text-green-600">0</h3>
            <p className="text-gray-500 text-sm mt-1">
              Certificates
            </p>
          </div>
        </div>
        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-3 gap-6 mt-10">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
            <Calendar className="text-indigo-600 mb-3" size={28}/>
            <h3 className="font-semibold text-lg">
              My Events
            </h3>
            <p className="text-gray-500 text-sm">
              View events you registered
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
            <Trophy className="text-purple-600 mb-3" size={28}/>
            <h3 className="font-semibold text-lg">
              Certificates
            </h3>
            <p className="text-gray-500 text-sm">
              Download your certificates
            </p>
          </div>
          <div
            onClick={logout}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
          >
            <LogOut className="text-red-500 mb-3" size={28}/>
            <h3 className="font-semibold text-lg">
              Logout
            </h3>
            <p className="text-gray-500 text-sm">
              Sign out of your account
            </p>
          </div>
        </div>
        {/* RECENT ACTIVITY */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">
            Recent Activity
          </h2>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              No recent activity yet. Register for events to see updates here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
