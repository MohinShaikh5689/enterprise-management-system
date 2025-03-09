import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const EmployeeSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const name = localStorage.getItem('name');
  
  const menuItems = [
    {
      title: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      ),
      path: '/employee/dashboard',
    },
    {
      title: 'My Tasks',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
      ),
      path: '/employee/tasks',
      subMenu: [
        { title: 'Current Tasks', path: '/employee/tasks' },
      ]
    },
    {
      title: 'Time Tracking',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      path: '/',
    },
    {
      title: 'Performance',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      ),
      path: '/',
    },
    {
      title: 'Help & Support',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      path: '/',
    }
  ];

  // Expanded/collapsed state trackers for each menu item
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

  const toggleSubmenu = (title: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} min-h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col fixed top-0 left-0 z-30`}>
      {/* Logo and Collapse Button */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        {!isCollapsed && (
          <div className="text-xl font-bold">Employee Portal</div>
        )}
        <button 
          onClick={toggleSidebar} 
          className={`p-1 rounded-lg hover:bg-gray-700 ${isCollapsed ? 'mx-auto' : ''}`}
          aria-label="Toggle Sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            )}
          </svg>
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav>
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.subMenu && item.subMenu.some(subItem => location.pathname === subItem.path));
              const isExpanded = expandedItems[item.title];
              
              return (
                <li key={item.title}>
                  {item.subMenu ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.title)}
                        className={`flex items-center w-full py-2 px-4 hover:bg-gray-700 ${
                          isActive ? 'bg-gray-700 text-white' : 'text-gray-300'
                        } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                      >
                        <div className="flex items-center">
                          <span className="flex-shrink-0">{item.icon}</span>
                          {!isCollapsed && <span className="ml-3">{item.title}</span>}
                        </div>
                        {!isCollapsed && (
                          <svg
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        )}
                      </button>
                      {(!isCollapsed && isExpanded) && (
                        <ul className="pl-10 py-1 space-y-0.5 mt-1 bg-gray-900">
                          {item.subMenu.map((subItem) => {
                            const isSubActive = location.pathname === subItem.path;
                            return (
                              <li key={subItem.title}>
                                <Link
                                  to={subItem.path}
                                  className={`block py-2 px-4 text-sm ${
                                    isSubActive ? 'text-white font-medium' : 'text-gray-400 hover:text-white'
                                  }`}
                                >
                                  {subItem.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center py-2 px-4 hover:bg-gray-700 ${
                        isActive ? 'bg-gray-700 text-white' : 'text-gray-300'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!isCollapsed && <span className="ml-3">{item.title}</span>}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* User Profile */}
      <div className="border-t border-gray-700 p-4">
        <div className={`flex ${isCollapsed ? 'justify-center' : 'items-center'}`}>
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
              {name?.charAt(0).toUpperCase()}
            </div>
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-white"> {name} </p>
              <Link to="/logout" className="text-xs text-gray-400 hover:text-white">
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeSidebar;