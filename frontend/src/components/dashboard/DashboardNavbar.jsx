import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function DashboardNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  let userName = "User";
  let role = "";
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userName = payload.name || payload.username || payload.sub || 'User';
      role = payload.role;
    }
  } catch {}

  const initials = userName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  const isProfilePage = location.pathname === "/profile" || location.pathname === "/dashboard/faculty";

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0f1f3d] text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
        
        {/* Logo */}
        {role === 'STUDENT' ? (
          <NavLink to="/events" className="text-2xl font-bold tracking-wide hover:text-yellow-400 transition">
            UniBuzz
          </NavLink>
        ) : (
          <NavLink to="/" className="text-2xl font-bold tracking-wide hover:text-yellow-400 transition">
            UniBuzz
          </NavLink>
        )}

        {/* Menu & Profile */}
        <div className="flex items-center gap-8">
          <NavLink 
            to={role === 'FACULTY' ? "/dashboard/faculty" : "/profile"} 
            className={({ isActive }) =>
              isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-400 transition"
            }
          >
            Profile
          </NavLink>

          {role === 'STUDENT' && (
            <>
              <NavLink 
                to="/dashboard/student" 
                className={({ isActive }) =>
                  isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-400 transition"
                }
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/dashboard/certificates" 
                className={({ isActive }) =>
                  isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-400 transition"
                }
              >
                Certificates
              </NavLink>
            </>
          )}

          {role === 'FACULTY' && (
            <NavLink 
              to="/dashboard/create-event" 
              className={({ isActive }) =>
                isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-400 transition"
              }
            >
              Create Event
            </NavLink>
          )}

          <NavLink 
            to="/dashboard/my-events" 
            className={({ isActive }) =>
              isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-400 transition"
            }
          >
            My Events
          </NavLink>

          {/* Profile Circle */}
          {!isProfilePage && (
            <NavLink to={role === 'FACULTY' ? "/dashboard/faculty" : "/profile"}>
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold hover:bg-yellow-400 transition">
                {initials}
              </div>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
