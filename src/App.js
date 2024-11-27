import React from "react";
import UserList from "./components/UserList";
import RoleList from "./components/RoleList";
import { UserProvider } from "./contexts/UserContext";
import { RoleProvider } from "./contexts/RoleContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header"; 
import Footer from "./components/Footer";

const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <RoleProvider>
          <Header /> 
          <div className="container mx-auto mt-6">
            <UserList />
            <hr className="my-6" />
            <RoleList />
          </div>
          <Footer />
        </RoleProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;