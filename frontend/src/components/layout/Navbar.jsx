import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0f1f3d] text-white shadow-md">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          UniBuzz
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-8">

          <Link
            to="/events"
            className="hover:text-yellow-400 transition"
          >
            Events
          </Link>

          {!token ? (
            <Link
              to="/auth"
              className="hover:text-yellow-400 transition"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={() => navigate("/profile")}
              className="bg-yellow-500 w-10 h-10 rounded-full flex items-center justify-center text-black font-bold hover:bg-yellow-400 transition"
            >
              👤
            </button>
          )}

        </div>

      </div>

    </nav>
  );
}