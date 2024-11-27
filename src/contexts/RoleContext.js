import React, { createContext, useState, useEffect } from "react";
import { fetchRoles } from "../api/mockServer";

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchRoles().then(setRoles);
  }, []);

  return (
    <RoleContext.Provider value={{ roles, setRoles }}>
      {children}
    </RoleContext.Provider>
  );
};
