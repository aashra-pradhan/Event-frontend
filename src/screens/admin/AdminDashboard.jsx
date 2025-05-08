import React from "react";
import Navbar from "../../components/Navbar";
import AdminEventList from "../admin/AdminEventList";
import AdminUserList from "../admin/AdminUserList";

const AdminDashboard = () => {
  return (
    <>
      <Navbar isLoggedIn={true} />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-5 ">Admin Dashboard</h1>
        <div className="mb-10">
          <AdminEventList />
        </div>
        <div>
          <AdminUserList />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
