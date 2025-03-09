import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  joined: string;
}

const EmployeeLists = () => {
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/admin/employees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Authtoken')}`,
        }
      });
      setEmployees(response.data);
    } catch (err) {
      console.error("Error fetching employee data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-lg font-medium text-gray-600">
          Loading Employees data...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-indigo-600 text-white shadow-lg focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar with overlay for mobile */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden`} onClick={toggleSidebar}></div>
      
      {/* AdminSidebar - This component is fixed and independent */}
      <AdminSidebar />

      {/* Main content - This should be positioned properly */}
      <div className="w-full lg:ml-64 overflow-x-hidden">
        <div className="px-4 py-6 sm:px-6 lg:px-8 mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Employee List</h1>
              <button 
                onClick={fetchData}
                className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
            
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full bg-white overflow-hidden">
                <thead className="text-white bg-indigo-600">
                  <tr>
                    <th className="py-3 px-4 sm:px-5 font-semibold text-xs sm:text-sm text-left">Name</th>
                    <th className="py-3 px-4 sm:px-5 font-semibold text-xs sm:text-sm text-left">Email</th>
                    <th className="py-3 px-4 sm:px-5 font-semibold text-xs sm:text-sm text-left hidden md:table-cell">Department</th>
                    <th className="py-3 px-4 sm:px-5 font-semibold text-xs sm:text-sm text-left hidden sm:table-cell">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employees && employees.length > 0 ? (
                    employees.map((employee, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-2 sm:py-3 px-4 sm:px-5 text-xs sm:text-sm font-medium text-gray-900">{employee.name}</td>
                        <td className="py-2 sm:py-3 px-4 sm:px-5 text-xs sm:text-sm text-gray-500">{employee.email}</td>
                        <td className="py-2 sm:py-3 px-4 sm:px-5 text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {employee.department}
                          </span>
                        </td>
                        <td className="py-2 sm:py-3 px-4 sm:px-5 text-xs sm:text-sm text-gray-500 hidden sm:table-cell">{new Date(employee.joined).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 px-5 text-center text-gray-500">
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLists;