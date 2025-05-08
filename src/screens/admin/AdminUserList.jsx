import React, { useEffect, useState } from "react";
// import { fetchAllUsers } from "../../api/adminAPI";
import { fetchAllUsers, deleteUser } from "../../api/adminAPI";

const AdminUserList = () => {
  // Inside the component
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAllUsers();
        setUsers(res.data.users);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    load();
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">All Users</h2>

      {users.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm border border-orange-300 rounded-lg overflow-hidden">
            <thead className="bg-orange-100 text-orange-800">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-orange-50">
                  <td className="px-4 py-2">{user.fullName}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 capitalize">{user.role}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
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

export default AdminUserList;
