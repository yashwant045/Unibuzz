import { User } from "lucide-react";
import { useEffect, useState } from "react";
export default function Profile() {
  const [user, setUser] = useState({ email: "", role: "" });
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token.includes(".")) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          email: payload.sub,
          role: payload.role,
        });
      } catch (e) {
        console.error("Invalid token");
      }
    }
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Profile
      </h1>
      <div className="bg-white rounded-xl shadow p-6 flex items-center gap-6">
        <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center">
          <User size={36} className="text-white"/>
        </div>
        <div>
          <p className="text-gray-700">
            {user.email}
          </p>
          <p className="text-sm text-gray-500">
            Role: {user.role}
          </p>
        </div>
      </div>
    </div>
  );
}
