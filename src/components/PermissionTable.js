import React from "react";

const PermissionTable = ({ permissions, onToggle }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold mb-2">Manage Permissions</h3>
      <table className="border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Permission</th>
            <th className="border border-gray-300 px-4 py-2">Assigned</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((permission) => (
            <tr key={permission.name}>
              <td className="border border-gray-300 px-4 py-2">
                {permission.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="checkbox"
                  checked={permission.assigned}
                  onChange={() => onToggle(permission.name)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionTable;
