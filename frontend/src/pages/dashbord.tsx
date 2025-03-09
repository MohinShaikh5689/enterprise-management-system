import { useState, useEffect } from 'react';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface MonthlyStats {
  month: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
}

interface DashboardData {
  department: string;
  monthlyStats: MonthlyStats[];
  overall: {
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
  };
}

interface Department {
  id: string;
  name: string;
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const department = localStorage.getItem('department');
  const [selectedDepartment, setSelectedDepartment] = useState<string>(department? department : 'Engineering');
  const [departments, setDepartments] = useState<Department[]>([]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/admin/departments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Authtoken')}`,
        }
      });
      setDepartments(response.data);
    } catch (err) {
      setError("Failed to load departments");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/tasks/average/${selectedDepartment}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Authtoken')}`,
          }
        });
        setData(response.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchDepartments();
  }, [selectedDepartment]);

  // Chart configuration
  const chartData = {
    labels: data?.monthlyStats.map(item => item.month) || [],
    datasets: [
      {
        label: 'Total Tasks',
        data: data?.monthlyStats.map(item => item.totalTasks) || [],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      },
      {
        label: 'Completed Tasks',
        data: data?.monthlyStats.map(item => item.completedTasks) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${data?.department || 'Department'} Monthly Task Completion`,
      },
    },
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-lg font-medium text-gray-600">
          Loading dashboard data...
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Dashboard Header with Department Dropdown */}
          <div className="border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">Department Dashboard</h1>
            <div className="mt-3 sm:mt-0 w-full sm:w-64">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Select Department
              </label>
              <select
                id="department"
                name="department"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={selectedDepartment}
                onChange={handleDepartmentChange}
              >
                {departments.map((dept:Department) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Loading state while refreshing data */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10">
              <div className="animate-pulse text-lg font-medium text-gray-600">
                Updating data...
              </div>
            </div>
          )}
          
          {/* Dashboard Content */}
          <div className="p-6">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-indigo-50 rounded-lg p-6 shadow-sm">
                <div className="text-sm font-medium text-indigo-600 mb-1">Total Tasks</div>
                <div className="text-3xl font-bold text-gray-900">{data?.overall.totalTasks}</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6 shadow-sm">
                <div className="text-sm font-medium text-green-600 mb-1">Completed Tasks</div>
                <div className="text-3xl font-bold text-gray-900">{data?.overall.completedTasks}</div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
                <div className="text-sm font-medium text-blue-600 mb-1">Completion Rate</div>
                <div className="text-3xl font-bold text-gray-900">{data?.overall.completionRate}%</div>
              </div>
            </div>
            
            {/* Charts */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Monthly Performance</h2>
              <div className="h-80">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
            
            {/* Monthly Data Table */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <h2 className="text-lg font-medium text-gray-800 p-6 border-b border-gray-100">Monthly Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Tasks</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data?.monthlyStats.map((month) => (
                      <tr key={month.month}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{month.month}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{month.totalTasks}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{month.completedTasks}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="mr-2">{month.completionRate}%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${month.completionRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;