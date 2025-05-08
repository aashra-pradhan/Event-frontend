import React, { useEffect, useState } from "react";
import { fetchAllEvents, updateEventStatus } from "../../api/adminAPI";

const AdminEventList = () => {
  const [events, setEvents] = useState([]);

  const loadEvents = async () => {
    try {
      const res = await fetchAllEvents();
      setEvents(res.data.events);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateEventStatus(id, status);
      loadEvents(); // Refresh after update
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const statusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-sm font-semibold";
    switch (status) {
      case "pending":
        return `${base} bg-yellow-100 text-yellow-800`;
      case "accepted":
        return `${base} bg-green-100 text-green-800`;
      case "rejected":
        return `${base} bg-red-100 text-red-800`;
      default:
        return base;
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">All Events</h2>

      {events.length === 0 ? (
        <p className="text-gray-600">No events found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm border border-orange-300 rounded-lg overflow-hidden">
            <thead className="bg-orange-100 text-orange-800">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Organizer</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {events.map((event) => (
                <tr key={event._id} className="border-t">
                  <td className="px-4 py-2">{event.name}</td>
                  <td className="px-4 py-2">{event.username}</td>
                  <td className="px-4 py-2">
                    <span className={statusBadge(event.eventStatus)}>
                      {event.eventStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleStatusChange(event._id, "accepted")}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(event._id, "rejected")}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminEventList;
