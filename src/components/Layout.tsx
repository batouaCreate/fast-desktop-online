import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-950">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
