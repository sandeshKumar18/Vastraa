import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, addUser, updateUser, deleteUser } from "../../redux/slices/adminSlice";
import { toast } from "sonner";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // Default role
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addUser(formData)).unwrap();
      toast.success("User created successfully.");
      // Reset the form after submission
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "customer",
      });
    } catch (err) {
      toast.error(err.message || "Failed to add user.");
    }
  };

  const handleRoleChange = async (userId, name, email, newRole) => {
    try {
      await dispatch(updateUser({ id: userId, name, email, role: newRole })).unwrap();
      toast.success("User role updated successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to update user role.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast.success("User deleted successfully.");
      } catch (err) {
        toast.error(err.message || "Failed to delete user.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      {/* --- Add New User Form --- */}
      <div className="p-6 rounded-lg border mb-6 bg-white shadow-sm">
        <h3 className="text-lg font-bold mb-4">Add New User</h3>
        {error && <p className="text-red-500 mb-4">{error.message || error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition font-semibold"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add User"}
          </button>
        </form>
      </div>

      {/* --- User List Table --- */}
      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users && users.map((user) => (
              <tr key={user._id} className="border-b bg-white hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-900">{user.name}</td>
                <td className="py-4 px-4">{user.email}</td>
                <td className="py-4 px-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, user.name, user.email, e.target.value)}
                    className="border border-gray-300 rounded p-1 text-sm bg-gray-50 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;