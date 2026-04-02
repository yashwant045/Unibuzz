import { useState } from "react";
import { createEvent } from "@/services/eventService";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    category: "",
    seats: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(form);
      alert("Event Created ✅");
      navigate("/dashboard/faculty");
    } catch (error) {
      alert("Error creating event: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Create Event</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input 
          name="title" 
          placeholder="Title" 
          value={form.title}
          onChange={handleChange} 
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          required
        />

        <textarea 
          name="description" 
          placeholder="Description" 
          value={form.description}
          onChange={handleChange} 
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-32" 
          required
        />

        <input 
          type="date" 
          name="eventDate" 
          value={form.eventDate}
          onChange={handleChange} 
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          required
        />

        <input 
          name="location" 
          placeholder="Location" 
          value={form.location}
          onChange={handleChange} 
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          required
        />

        <input 
          name="category" 
          placeholder="Category (AI, Web, etc)" 
          value={form.category}
          onChange={handleChange} 
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          required
        />

        <input 
          type="number" 
          name="seats" 
          placeholder="Total Seats" 
          value={form.seats}
          onChange={handleChange} 
          min="1"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          required
        />

        <button className="bg-orange-600 hover:bg-orange-700 text-white w-full py-3 rounded-lg font-semibold transition-colors">
          Create Event
        </button>
      </form>
    </div>
  );
}
