import React, { useState, useEffect, useContext } from "react";
import { fetchRoles, fetchUsers, addRole, updateRole, deleteRole } from "../api/mockServer";
import { UserContext } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import Swal from "sweetalert2";
import Modal from "./Modal";

const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoleDetails, setSelectedRoleDetails] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [currentRoleName, setCurrentRoleName] = useState(null);

  const { currentUser } = useContext(UserContext);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetchRoles().then(setRoles);
    fetchUsers().then(setUsers);
  }, []);

  const handleRoleChange = (roleName) => {
    const role = roles.find((r) => r.name === roleName);
    setSelectedRole(roleName);
    setRolePermissions(role ? role.permissions : []);
  };

  const hasPermission = (permission) => {
    return rolePermissions.includes(permission);
  };

  const adminUsersCount = users.filter((user) => user.role === "Admin").length;

  const handleAddRole = () => {
    if (!hasPermission("Write")) {
      Swal.fire("You do not have permission to add roles.");
      return;
    }
    setSelectedRoleDetails(null);
    setShowModal(true);
  };

  const handleEditRole = (role) => {
    if (role.name === "Admin" && adminUsersCount === 1) {
      Swal.fire("You cannot Edit the last admin role.");
      return;
    }

    if (!hasPermission("Write")) {
      Swal.fire("You do not have permission to edit roles.");
      return;
    }
    setSelectedRoleDetails(role);
    setShowModal(true);
  };

  const handleDeleteRole = (roleName) => {
    if (roleName === "Admin" && adminUsersCount === 1) {
      Swal.fire("You cannot delete the last admin role.");
      return;
    }

    if (!hasPermission("Delete")) {
      Swal.fire("You do not have permission to delete roles.");
      return;
    }
    deleteRole(roleName).then(() => setRoles(roles.filter((role) => role.name !== roleName)));
  };

  const handleSaveRole = (role) => {
    if (role.id) {
      updateRole(role).then((updatedRole) => {
        setRoles((prevRoles) =>
          prevRoles.map((r) => (r.id === updatedRole.id ? updatedRole : r))
        );
      });
    } else {
      addRole(role).then((newRole) => {
        setRoles((prevRoles) => [...prevRoles, newRole]);
      });
    }
    setShowModal(false);
  };

  const toggleActionMenu = (roleName) => {
    setCurrentRoleName(roleName);
    setShowActionMenu(!showActionMenu);
  };

  return (
    <div>
      <div className="flex flex-col items-center md:flex-col md:items-start">
        <h1 className="text-2xl font-bold mb-4">Role Management</h1>

        <div className="mb-4"> 
          <label className="font-semibold mr-2">Select Role:</label> 
          <select value={selectedRole} onChange={(e) => handleRoleChange(e.target.value)} className={`p-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} transition duration-200`} > 
            <option value="">-- Select a Role --</option> 
            {roles.map((role) => (<option key={role.name} value={role.name} className="text-sm"> {role.name} </option>))} 
          </select> 
        </div>

        {hasPermission("Write") && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            onClick={handleAddRole}
          >
            Add Role
          </button>
        )}
      </div>

      <table className="mt-4 w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Role Name</th>
            <th className="border border-gray-300 px-4 py-2">Permissions</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.name} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{role.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                {role.permissions.join(", ")}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="bg-gray-300 text-black px-2 py-1 rounded"
                  onClick={() => toggleActionMenu(role.name)}
                >
                  ...
                </button>
                {showActionMenu && currentRoleName === role.name && (
                  <div className={`absolute bg-${theme === 'dark' ? 'gray-800' : 'white'} border border-${theme === 'dark' ? 'gray-700' : 'gray-300'} rounded shadow-lg z-10`}>
                    {hasPermission("Write") && (
                      <button
                        className={`block w-full text-left px-4 py-2 hover:bg-${theme === 'dark' ? 'gray-700' : 'gray-200'}`}
                        onClick={() => handleEditRole(role)}
                      >
                        Edit
                      </button>
                    )}
                    {hasPermission("Delete") && (
                      <button
                        className={`block w-full text-left px-4 py-2 hover:bg-${theme === 'dark' ? 'gray-700' : 'gray-200'} ${role.name === "Admin" && adminUsersCount === 1 ? "cursor-not-allowed opacity-50" : ""}`}
                        onClick={() => handleDeleteRole(role.name)}
                        disabled={role.name === "Admin" && adminUsersCount === 1}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <RoleForm
            role={selectedRoleDetails}
            onSave={handleSaveRole}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

const RoleForm = ({ role, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    role || { name: "", permissions: [] }
  );

  const { theme } = useTheme();

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => {
      const newPermissions = checked
        ? [...prev.permissions, name]
        : prev.permissions.filter((perm) => perm !== name);
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded shadow-md`}>
      <div className="mb-4">
        <label className={`block mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Role Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-800'} p-2 w-full`}
          required
        />
      </div>

      <div className="mb-4">
        <label className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Permissions:</label>
        <div className="flex flex-col">
          {["Read", "Write", "Delete", "Execute"].map((permission) => (
            <label key={permission} className="flex items-center">
              <input
                type="checkbox"
                name={permission}
                checked={formData.permissions.includes(permission)}
                onChange={handleChange}
                className={`mr-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}
              />
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}>{permission}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className={`px-4 py-2 rounded mr-2 ${theme === 'dark' ? 'bg-green-600' : 'bg-green-500'} text-white`}
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-500'} text-white`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RoleList;