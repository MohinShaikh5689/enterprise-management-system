import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
}

interface TaskFormData {
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
}

const AssignTask = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',

  });
  const department = localStorage.getItem('department');
  
  const fetchEmployees = async() => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/admin/department/${department}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('Authtoken')}`,
            }
        });
        setEmployees(response.data.employees);
    } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Failed to load employees. Please refresh the page.');
        } finally {
            setLoading(false);
        }
  };
  
  useEffect(() => {
    fetchEmployees();
  }, []);

  

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.assignedTo || !formData.dueDate) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await axios.post(

        'http://localhost:4000/api/tasks',
        {
          ...formData,
          status: 'PENDING',
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Authtoken')}`,
          }
        }
      );
      
      setSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err: any) {
      console.error('Error assigning task:', err);
      setError(err.response?.data?.message || 'Failed to assign task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-gray-800 text-white shadow-lg focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar with overlay for mobile */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 bg-gray-600 bg-opacity-75 z-10 lg:hidden`} onClick={toggleSidebar}></div>
      
      {/* Fixed Sidebar Container */}
      <div className="fixed inset-y-0 left-0 z-20 w-64 hidden lg:block">
        <AdminSidebar />
      </div>
      
      {/* Mobile Sidebar (shown when toggled) */}
      <div className={`transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 w-64 transition-transform duration-300 ease-in-out lg:hidden`}>
        <AdminSidebar />
      </div>

      {/* Main content with proper margin */}
      <div className="flex-1 w-full lg:ml-64 transition-all duration-300">
        <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Header with background */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6 text-white">
              <h1 className="text-2xl font-bold">Assign New Task</h1>
              <p className="mt-2 text-blue-100">Create and assign tasks to employees</p>
            </div>
            
            <div className="p-8">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg shadow-sm">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">Task assigned successfully!</p>
                    </div>
                  </div>
                </div>
              )}
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="ml-2 text-gray-600">Loading employees...</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Task Title Field */}
                  <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Task Title <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 py-3 px-4 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                      placeholder="Enter task title"
                    />
                  </div>
                  
                  {/* Task Description Field */}
                  <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Task Description <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 py-3 px-4 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                      placeholder="Describe the task in detail..."
                    />
                  </div>
                  
                  {/* Assign Employee and Due Date Fields in a 2-column grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Assign To Field */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                      <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
                        Assign To <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="assignedTo"
                          id="assignedTo"
                          value={formData.assignedTo}
                          onChange={handleChange}
                          className="block w-full rounded-lg border-gray-300 py-3 px-4 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-all appearance-none"
                        >
                          <option value="" disabled>Select Employee</option>
                          {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                              {employee.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Due Date Field */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                      <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        id="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="block w-full rounded-lg border-gray-300 py-3 px-4 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                      />
                    </div>
                  </div>
                  
                 
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    
                  
                  
                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Assigning Task...
                        </>
                      ) : "Assign Task"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTask;