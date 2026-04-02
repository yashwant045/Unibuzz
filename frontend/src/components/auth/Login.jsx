import React, { useState } from "react";
import { MoveRight } from "lucide-react";
import { loginUser } from "@/services/authService";

export default function Login({ role, InputField, onLoginSuccess }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const token = await loginUser({
        email,
        password,
      });

      // send token back to Auth.jsx
      onLoginSuccess(token);

    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">

      {/* add onSubmit here */}
      <form className="space-y-6" onSubmit={handleSubmit}>

        <InputField
          placeholder="EMAIL ADDRESS"
          type="email"
          name="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          placeholder="PASSWORD"
          type="password"
          name="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all transform hover:brightness-110 active:scale-[0.98] group ${
            role === "student" ? "bg-indigo-600" : "bg-orange-600"
          }`}
        >
          Sign In

          <MoveRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />

        </button>

      </form>

    </div>
  );
}