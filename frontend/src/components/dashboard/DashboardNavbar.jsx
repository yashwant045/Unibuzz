import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function DashboardNavbar() {
  const navigate = useNavigate();
let userName;
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
userName = payload.name || payload.username || payload.sub || 'User';
    }
  } catch {}

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bg-[#0f1f3d] text-white px-8 py-4 flex justify-between items-center shadow">
      {/* LEFT */}
      <h1 className="text-xl font-bold">UniBuzz</h1>

      {/* CENTER MENU */}
      <div className="flex gap-8">
        <NavLink 
          to="/dashboard/profile" 
          className={({ isActive }) =>
            isActive ? "text-orange-400 font-bold" : "hover:text-orange-400"
          }
        >
          Profile
        </NavLink>

        <NavLink 
          to="/dashboard/create-event" 
          className={({ isActive }) =>
            isActive ? "text-orange-400 font-bold" : "hover:text-orange-400"
          }
        >
          Create Event
        </NavLink>

        <NavLink 
          to="/dashboard/my-events" 
          className={({ isActive }) =>
            isActive ? "text-orange-400 font-bold" : "hover:text-orange-400"
          }
        >
          My Events
        </NavLink>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <span className="text-sm">{userName}</span>
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
