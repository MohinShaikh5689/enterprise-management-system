import { useState, useEffect } from 'react';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import EmployeeSidebar from '../components/EmployeeSidebar';

// Register the required chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface MonthlyStats {
    month: string;
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
}

const EmployeeDashboard = () => {
    const [data, setData] = useState<MonthlyStats[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:4000/api/tasks/average`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('Authtoken')}`,
                    }
                });
                setData(response.data);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Chart configuration
    const chartData = {
        labels: data?.map(item => item.month) || [],
        datasets: [
            {
                label: 'Total Tasks',
                data: data?.map(item => item.totalTasks) || [],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                borderColor: 'rgb(53, 162, 235)',
                borderWidth: 1,
            }, {
                label: 'Completed Tasks',
                data: data?.map(item => item.completedTasks) || [],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Monthly Task Stats',
            }
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
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

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Mobile sidebar toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-20">
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
            <div className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 bg-gray-600 bg-opacity-75 z-10 lg:hidden`} onClick={toggleSidebar}></div>

            <div className={`transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed z-20 transition-transform duration-300 ease-in-out lg:relative lg:flex`}>
                <EmployeeSidebar />
            </div>

            {/* Main content */}
            <div className="flex-1 w-full lg:ml-64 transition-all duration-300">
                <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-full mx-auto">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Dashboard Header */}
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Task Performance Dashboard</h1>
                        </div>

                        {/* Dashboard Content */}
                        <div className="p-6">
                            {/* Stats Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-indigo-50 rounded-lg p-6 shadow-sm">
                                    <div className="text-sm font-medium text-indigo-600 mb-1">Total Tasks</div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        {data?.reduce((total, month) => total + month.totalTasks, 0)}
                                    </div>
                                </div>

                                <div className="bg-green-50 rounded-lg p-6 shadow-sm">
                                    <div className="text-sm font-medium text-green-600 mb-1">Completed Tasks</div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        {data?.reduce((total, month) => total + month.completedTasks, 0)}
                                    </div>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
                                    <div className="text-sm font-medium text-blue-600 mb-1">Overall Completion Rate</div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        {data && data.length > 0
                                            ? Math.round((data.reduce((total, month) => total + month.completedTasks, 0) /
                                                data.reduce((total, month) => total + month.totalTasks, 0)) * 100)
                                            : 0}%
                                    </div>
                                </div>
                            </div>

                            {/* Charts */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                <h2 className="text-lg font-medium text-gray-800 mb-4">Monthly Performance</h2>
                                <div className="h-80">
                                    <Bar data={chartData} options={chartOptions} />
                                </div>
                            </div>

                            {/* Monthly Data Cards */}
                            <div className="mt-8">
                                <h2 className="text-lg font-medium text-gray-800 mb-4">Monthly Breakdown</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {data?.map((stat) => (
                                        <div key={stat.month} className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-100 shadow-sm">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-semibold text-gray-800 text-lg">{stat.month}</h3>
                                                <span className={`px-2 py-1 text-xs rounded-full ${stat.completionRate >= 75 ? 'bg-green-100 text-green-800' :
                                                        stat.completionRate >= 50 ? 'bg-blue-100 text-blue-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {stat.completionRate}% Complete
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm text-gray-600">Total Tasks</p>
                                                    <p className="font-medium text-gray-900">{stat.totalTasks}</p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm text-gray-600">Completed Tasks</p>
                                                    <p className="font-medium text-gray-900">{stat.completedTasks}</p>
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${stat.completionRate >= 75 ? 'bg-green-500' :
                                                                    stat.completionRate >= 50 ? 'bg-blue-500' :
                                                                        'bg-yellow-500'
                                                                }`}
                                                            style={{ width: `${stat.completionRate}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;