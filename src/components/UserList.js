import React, { useState, useEffect, useContext } from "react";
import Modal from "./Modal";
import { fetchUsers, fetchRoles, addUser, updateUser, deleteUser } from "../api/mockServer";
import { UserContext } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import Swal from "sweetalert2";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [rolePermissions, setRolePermissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { currentUser } = useContext(UserContext);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetchUsers().then(setUsers);
    fetchRoles().then(setRoles);
  }, []);

  const handleRoleChange = (roleName) => {
    setSelectedRole(roleName);
    const role = roles.find((r) => r.name === roleName);
    setRolePermissions(role ? role.permissions : []);
  };

  const hasPermission = (permission) => {
    return rolePermissions.includes(permission);
  };

  const handleAddUser = () => {
    if (!hasPermission("Write")) {
      Swal.fire("You do not have permission to add users.");
      return;
    }
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    if (!hasPermission("Write")) {
      Swal.fire("You do not have permission to edit users.");
      return;
    }
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (id) => {
    if (!hasPermission("Delete")) {
      Swal.fire("You do not have permission to delete users.");
      return;
    }
    deleteUser(id).then(() => setUsers(users.filter((user) => user.id !== id)));
  };

  const handleSave = (user) => {
    if (user.id) {
      updateUser(user).then((updatedUser) => {
        setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      });
    } else {
      addUser(user).then((newUser) => {
        setUsers((prevUsers) => [...prevUsers, newUser]);
      });
    }
    setShowModal(false);
  };

  const toggleActionsMenu = (userId) => {
    setSelectedUserId(userId);
    setShowActionsMenu(!showActionsMenu);
  };

  return (
    <div>
      <div className="flex flex-col items-center md:flex-col md:items-start">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>

        <div className="mb-4">
          <label className="font-semibold mr-2">Select Role:</label>
          <select
            value={selectedRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            className={`p-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} transition duration-200`} 
          >
            <option value="">-- Select a Role --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.name} className="text-sm">
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {hasPermission("Write") && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            onClick={handleAddUser}
          >
            Add User
          </button>
        )}
      </div>

      <table className="mt-4 w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user, index, self) => {
              return (
                self.findIndex((u) => u.name === user.name) === index ||
                self.findIndex((u) => u.email === user.email) === index ||
                self.findIndex((u) => u.role === user.role) === index
              );
            })
            .map((user) => (
              <tr key={user.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="relative inline-block">
                    <button
                      className="bg-gray-300 text-black px-2 py-1 rounded"
                      onClick={() => toggleActionsMenu(user.id)}
                    >
                      ...
                    </button>
                    {showActionsMenu && selectedUserId === user.id && (
                      <div
                        className={`absolute right-0 mt-2 w-32 bg-${theme === 'dark' ? 'gray-800' : 'white'
                          } border border-${theme === 'dark' ? 'gray-700' : 'gray-300'
                          } rounded shadow-lg z-10`}
                      >
                        {hasPermission('Write') && (
                          <button
                            className={`block w-full text-left px-4 py-2 hover:bg-${theme === 'dark' ? 'gray-700' : 'gray-200'
                              }`}
                            onClick={() => handleEditUser(user)}
                          >
                            Edit
                          </button>
                        )}
                        {hasPermission('Delete') && (
                          <button
                            className={`block w-full text-left px-4 py-2 hover:bg-${theme === 'dark' ? 'gray-700' : 'gray-200'
                              }`}
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <UserForm
            user={selectedUser}
            onSave={handleSave}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

const UserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    user || { name: "", email: "", role: "" }
  );

  const { theme } = useTheme();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded shadow-md`}>
      <div className="mb-4">
        <label className={`block mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-800'} p-2 w-full`}
          required
        />
      </div>
      <div className="mb-4">
        <label className={`block mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-800'} p-2 w-full`}
          required
        />
      </div>
      <div className="mb-4">
        <label className={`block mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Role:</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={`border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-800'} p-2 w-full`}
          required
        />
      </div>
      <div className="flex justify-end mt-4">
        <button type="submit" className={`px-4 py-2 rounded mr-2 ${theme === 'dark' ? 'bg-green-600' : 'bg-green-500'} text-white`}>
          Save
        </button>
        <button type="button" onClick={onCancel} className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-500'} text-white`}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserList;