const users = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "Editor", status: "Inactive" },
];

const roles = [
  { id: 1, name: "Admin", permissions: ["Read", "Write", "Delete"] },
  { id: 2, name: "Editor", permissions: ["Read", "Write"] },
];

let userIdCounter = users.length + 1;
let roleIdCounter = roles.length + 1;

export const fetchUsers = () => Promise.resolve(users);
export const fetchRoles = () => Promise.resolve(roles);

export const addUser = (user) => {
  const newUser = { ...user, id: userIdCounter++ };
  users.push(newUser);  
  return Promise.resolve(newUser);  
};

export const updateUser = (updatedUser) => {
  const index = users.findIndex((u) => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = { ...updatedUser }; 
  }
  return Promise.resolve(updatedUser); 
};

export const deleteUser = (id) => {
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) users.splice(index, 1);
  return Promise.resolve();
};

export const addRole = (role) => {
  role.id = roleIdCounter++;
  roles.push(role);
  return Promise.resolve(role);
};

export const updateRole = (updatedRole) => {
  const index = roles.findIndex((r) => r.id === updatedRole.id);
  if (index !== -1) roles[index] = updatedRole;
  return Promise.resolve(updatedRole);
};

export const deleteRole = (id) => {
  const index = roles.findIndex((r) => r.id === id);
  if (index !== -1) roles.splice(index, 1);
  return Promise.resolve();
};
