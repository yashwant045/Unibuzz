import { Link } from "react-router-dom";
import { User, CalendarPlus, ClipboardList, LogOut } from "lucide-react";

export default function Sidebar() {

  return (
    <div className="w-64 bg-[#0f172a] text-white flex flex-col justify-between p-6 min-h-screen">

      {/* TOP */}
      <div>

        <h1 className="text-2xl font-bold mb-10">UniBuzz</h1>

        <nav className="space-y-6">

          {/* PROFILE */}
          <Link
            to="/dashboard/faculty"
            className="flex items-center gap-3 hover:text-orange-400"
          >
            <User size={18} />
            Profile
          </Link>

          {/* CREATE EVENT */}
          <Link
            to="/dashboard/create-event"
            className="flex items-center gap-3 hover:text-orange-400"
          >
            <CalendarPlus size={18} />
            Create Event
          </Link>

          {/* MY EVENTS */}
          <Link
            to="/dashboard/my-events"
            className="flex items-center gap-3 hover:text-orange-400"
          >
            <ClipboardList size={18} />
            My Events
          </Link>

        </nav>

      </div>

      {/* LOGOUT */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/auth";
        }}
        className="flex items-center gap-3 hover:text-red-400"
      >
        <LogOut size={18} />
        Logout
      </button>

    </div>
  );
}