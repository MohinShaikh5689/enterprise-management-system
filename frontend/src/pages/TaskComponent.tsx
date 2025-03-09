import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeSidebar from "../components/EmployeeSidebar";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

const TaskComponent = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:4000/api/tasks`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('Authtoken')}`,
                }
            });
            setTasks(response.data);
        } catch (err) {
            console.error("Error fetching task data:", err);
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

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        try {
            setUpdatingTaskId(taskId);
            await axios.post(`http://localhost:4000/api/tasks/${taskId}/${newStatus.toUpperCase()}`, 
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('Authtoken')}`,
                    }
                }

            );
            
            // Update the local state to reflect the change
            setTasks(tasks.map(task => 
                task.id === taskId ? { ...task, status: newStatus } : task
            ));
        } catch (err) {
            console.error("Error updating task status:", err);
        } finally {
            setUpdatingTaskId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch(status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in progress':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse text-lg font-medium text-gray-600">
                    Loading Task data...
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
                    className="p-2 rounded-md bg-gray-800 text-white shadow-lg focus:outline-none"
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
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">My Tasks</h1>
                            <button 
                                onClick={fetchData}
                                className="px-3 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700 transition-colors flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            {tasks.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Description</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {tasks.map((task) => (
                                            <tr key={task.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                                                    <div className="max-w-xs truncate">{task.description}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        {updatingTaskId === task.id ? (
                                                            <span className="text-xs text-gray-500">Updating...</span>
                                                        ) : (
                                                            <select 
                                                                className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                                value={task.status}
                                                                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                            >
                                                                <option value="Pending">Pending</option>
                                                                <option value="In_Progress">In Progress</option>
                                                                <option value="Completed">Completed</option>
                                                            </select>
                                                        )}

                                                        <button className="text-gray-600 hover:text-gray-900">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-8">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
                                    <p className="mt-1 text-sm text-gray-500">You don't have any tasks assigned to you yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskComponent;