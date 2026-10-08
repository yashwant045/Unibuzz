import { useState, useEffect } from "react";
import { createEvent } from "@/services/eventService";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function CreateEvent() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    eventTime: "12:00", // Default to 12:00
    location: "",
    category: "",
    seats: ""
  });

  const [timeData, setTimeData] = useState({ hour: "12", minute: "00", ampm: "PM" });

  useEffect(() => {
    let h = parseInt(timeData.hour, 10);
    if (timeData.ampm === "PM" && h !== 12) h += 12;
    if (timeData.ampm === "AM" && h === 12) h = 0;
    const hStr = h.toString().padStart(2, '0');
    setForm(prev => ({ ...prev, eventTime: `${hStr}:${timeData.minute}` }));
  }, [timeData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTimeChange = (e) => {
    setTimeData({ ...timeData, [e.target.name]: e.target.value });
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (form.eventDate < todayStr) {
      toast.warning("Event date cannot be in the past.");
      return;
    }

    if (form.eventDate === todayStr && form.eventTime) {
      const now = new Date();
      const [h, m] = form.eventTime.split(":").map(Number);
      const selectedTime = new Date();
      selectedTime.setHours(h, m, 0, 0);
      if (selectedTime < now) {
        toast.warning("Event time cannot be in the past for today's date.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await createEvent(form);
      toast.success("Event created successfully!");
      navigate("/dashboard/my-events");
    } catch (error) {
      toast.error("Error creating event: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
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
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
          required
        />

        <textarea 
          name="description" 
          placeholder="Description" 
          value={form.description}
          onChange={handleChange} 
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-32" 
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Event Date</label>
            <input 
              type="date" 
              name="eventDate" 
              min={todayStr}
              value={form.eventDate}
              onChange={handleChange} 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Event Time</label>
            <div className="flex gap-2">
              <select 
                name="hour"
                value={timeData.hour}
                onChange={handleTimeChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                {[...Array(12)].map((_, i) => {
                  const val = (i + 1).toString().padStart(2, '0');
                  return <option key={val} value={val}>{val}</option>;
                })}
              </select>
              <select 
                name="minute"
                value={timeData.minute}
                onChange={handleTimeChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                {["00", "15", "30", "45"].map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
              <select 
                name="ampm"
                value={timeData.ampm}
                onChange={handleTimeChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        </div>

        <input 
          name="location" 
          placeholder="Location" 
          value={form.location}
          onChange={handleChange} 
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
          required
        />

        <input 
          name="category" 
          placeholder="Category (Workshop, Seminar, etc)" 
          value={form.category}
          onChange={handleChange} 
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
          required
        />

        <input 
          type="number" 
          name="seats" 
          placeholder="Total Seats" 
          value={form.seats}
          onChange={handleChange} 
          min="1"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
          required
        />

        <button 
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
        >
          {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
          {isSubmitting ? "Creating Event..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
