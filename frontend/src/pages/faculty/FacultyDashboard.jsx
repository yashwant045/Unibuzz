import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function FacultyDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          email: payload.sub,
          role: payload.role,
          name: payload.name || payload.sub
        });
      } catch (error) {
        console.error('Invalid token');
        localStorage.removeItem('token');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div>
          <h2 className="text-2xl font-bold">
            Welcome, {user.name}
          </h2>

          <p className="text-white/90">
            Role: {user.role}
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NavLink 
          to="/dashboard/faculty/create-event" 
          className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">Create Event</h3>
          <p>Create new events for students</p>
        </NavLink>

        <NavLink 
          to="/dashboard/my-events" 
          className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">My Events</h3>
          <p>View your created events</p>
        </NavLink>

        <NavLink 
          to="/dashboard/profile" 
          className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">Profile</h3>
          <p>Update your faculty profile</p>
        </NavLink>
      </div>
    </div>
  );
}
