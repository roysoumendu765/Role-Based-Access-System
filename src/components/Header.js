import React from 'react';
import { useTheme } from '../contexts/ThemeContext'; 

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-800">
      <div className="flex items-center">

        <h1 className="ml-4 text-xl font-bold text-gray-800 dark:text-white">Role Based Access Control</h1>
      </div>
      <div className="flex items-center">
        <label className="flex items-center cursor-pointer">
          <span className="mr-2 text-gray-800 dark:text-white">
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={toggleTheme}
            className="hidden"
            id="toggle"
          />
          <div className="relative w-14 h-8 bg-gray-300 dark:bg-gray-600 rounded-full transition duration-200 ease-in">
            <div 
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in ${theme === 'dark' ? 'translate-x-full bg-gray-800' : ''}`}
            />
          </div>
        </label>
      </div>
    </header>
  );
};

export default Header;