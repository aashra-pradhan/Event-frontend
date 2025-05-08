import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "../screens/admin/AdminDashboard";
import ManageUsers from "../screens/admin/AdminUserList";
import ManageEvents from "../screens/admin/ManageEvents";
import CreateEvent from "../screens/admin/AdminEventList";
// import AdminProfile from "../screens/admin/AdminProfile";
import AdminReports from "../screens/admin/AdminReports";

const Admin = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route index element={<AdminDashboard />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/manage-events" element={<ManageEvents />} />
          <Route path="/admin/create-event" element={<CreateEvent />} />
          {/* <Route path="/admin/profile" element={<AdminProfile />} /> */}
          {/* <Route path="/admin/reports" element={<AdminReports />} /> */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<>404 - Admin route not found</>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Admin;
