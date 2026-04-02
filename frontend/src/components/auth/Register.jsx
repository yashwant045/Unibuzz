import React, { useState } from "react";
import { MoveRight } from "lucide-react";
import { registerUser } from "@/services/authService";

export default function Register({
  role,
  interestOptions,
  interests,
  toggleInterest,
  InputField,
}) {

  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const data = {
        ...formData,
        role,
        interests,
      };

      await registerUser(data);
      
      if (role === "student") {
        localStorage.setItem("studentInterests", JSON.stringify(interests));
      }

      alert("Registration successful!");

    } catch (error) {

      console.error(error);
      alert("Registration failed");

    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-6"
    >

      <div className="space-y-4">

        <InputField
          placeholder="FULL NAME"
          name="fullName"
          onChange={handleChange}
        />

        <InputField
          placeholder="EMAIL ADDRESS"
          type="email"
          name="email"
          onChange={handleChange}
        />

        <InputField
          placeholder="PASSWORD"
          type="password"
          name="password"
          onChange={handleChange}
        />

        {role === "student" ? (

          <div className="grid grid-cols-2 gap-4 animate-in zoom-in-95 duration-300">

            <InputField
              placeholder="ENROLLMENT NUMBER"
              name="enrollmentNumber"
              onChange={handleChange}
            />

            <InputField
              placeholder="PHONE NUMBER"
              name="phoneNumber"
              onChange={handleChange}
            />

            <InputField
              placeholder="DEPARTMENT"
              name="department"
              onChange={handleChange}
            />

            <InputField
              placeholder="SECTION"
              name="section"
              onChange={handleChange}
            />

            <InputField
              placeholder="YEAR"
              name="year"
              onChange={handleChange}
            />

            <div className="col-span-2 mt-2">

              <label className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest ml-1 mb-3 block">
                Select Interests
              </label>

              <div className="grid grid-cols-3 gap-2">

                {interestOptions.map((opt) => (

                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleInterest(opt.id)}
                    className={`py-3 rounded-xl border text-center transition-all ${
                      interests.includes(opt.id)
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                        : "border-zinc-800 bg-zinc-900/30 text-zinc-500 hover:border-zinc-700"
                    }`}
                  >

                    <div className="text-lg mb-1">{opt.icon}</div>

                    <div className="text-[9px] font-black uppercase tracking-tighter">
                      {opt.label}
                    </div>

                  </button>

                ))}

              </div>

            </div>

          </div>

        ) : (

          <div className="space-y-4 animate-in zoom-in-95 duration-300">

            <InputField
              placeholder="DESIGNATION"
              name="designation"
              onChange={handleChange}
            />

            <InputField
              placeholder="DEPARTMENT"
              name="department"
              onChange={handleChange}
            />

            <InputField
              placeholder="AREA OF EXPERTISE"
              name="expertise"
              onChange={handleChange}
            />

            <InputField
              placeholder="CABIN / OFFICE LOCATION"
              name="officeLocation"
              onChange={handleChange}
            />

          </div>

        )}

      </div>

      <button
        type="submit"
        className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all transform hover:brightness-110 active:scale-[0.98] group ${
          role === "student" ? "bg-indigo-600" : "bg-orange-600"
        }`}
      >
        Get Access

        <MoveRight
          size={18}
          className="group-hover:translate-x-1 transition-transform"
        />

      </button>

    </form>
  );
}