import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className={`bottom-0 left-0 w-full mt-2 p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} text-center`}>
      <p className={`mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        © {new Date(Date.now()).getFullYear()} Your Company. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;