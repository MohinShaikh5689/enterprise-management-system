import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import { CreateTaskDto } from "./createTask.dto";
import { Status } from "@prisma/client";

export interface MonthlyStats {
    month: string;
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
}

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) { }
    async createTask(user: any, data: CreateTaskDto) {
        try {
            const task = await this.prisma.task.create({
                data: {
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    adminId: user.id,
                    assignedTo: data.assignedTo
                }
            });
            return task;    
        } catch (error) {
            console.log(error);
            throw new HttpException('Internal Server Error', 500); 
        }
    }

    async getTasksBYEmployeeId(id: string) {
        try {
             const tasks = await this.prisma.task.findMany({
                    where: { assignedTo: id }
                });
            if (!tasks) {
                return {
                    message: 'No tasks found'
                }
            }
            return tasks;
        } catch (error) {
            throw new HttpException('Internal Server Error', 500);
        }
    };
    async updateTaskStatus(id: string, status: Status) {
        try {
            const task = await this.prisma.task.update({
                where: { id },
                data: {
                    status: status
                }
            })
            return task;
        } catch (error) {
            console.log(error);
            throw new HttpException('Internal Server Error', 500);
        }
    }

    async getAverageByDepartment(departmentName: string) {
        try {
            // First, find the department by name
            const department = await this.prisma.department.findFirst({
                where: { name: departmentName },
                include: {
                    employees: {
                        include: {
                            assignedTasks: true
                        }
                    }
                }
            });

            if (!department) {
                throw new HttpException(`Department '${departmentName}' not found`, 404);
            }

            // Get current date info
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            
            // Initialize monthly stats
            const monthlyStats: MonthlyStats[] = [];
            
            // Calculate stats for each month from January to current month
            for (let month = 0; month <= currentMonth; month++) {
                // Collect all tasks for all employees in the department for this month
                const tasksThisMonth = department.employees.flatMap(employee => 
                    employee.assignedTasks.filter(task => {
                        const taskDate = new Date(task.createdAt);
                        return taskDate.getFullYear() === currentYear && taskDate.getMonth() === month;
                    })
                );
                
                // Count total tasks and completed tasks for the month
                const totalTaskCount = tasksThisMonth.length;
                const completedTaskCount = tasksThisMonth.filter(task => 
                    task.status === Status.COMPLETED
                ).length;
                
                // Calculate completion rate (average)
                const completionRate = totalTaskCount > 0 
                    ? (completedTaskCount / totalTaskCount) * 100 
                    : 0;
                
                // Add to monthly stats
                monthlyStats.push({
                    month: new Date(currentYear, month, 1).toLocaleString('default', { month: 'long' }),
                    totalTasks: totalTaskCount,
                    completedTasks: completedTaskCount,
                    completionRate: Math.round(completionRate * 100) / 100, // Round to 2 decimal places
                });
            }
            
            // Calculate overall average for the department
            const allTasks = department.employees.flatMap(employee => 
                employee.assignedTasks.filter(task => {
                    const taskDate = new Date(task.createdAt);
                    return taskDate.getFullYear() === currentYear;
                })
            );
            
            const totalTaskCount = allTasks.length;
            const completedTaskCount = allTasks.filter(task => 
                task.status === Status.COMPLETED
            ).length;
            
            const overallCompletionRate = totalTaskCount > 0 
                ? (completedTaskCount / totalTaskCount) * 100 
                : 0;
            
            return {
                department: departmentName,
                monthlyStats,
                overall: {
                    totalTasks: totalTaskCount,
                    completedTasks: completedTaskCount,
                    completionRate: Math.round(overallCompletionRate * 100) / 100,
                }
            };
        } catch (error) {
            console.error('Error calculating department averages:', error);
            throw new HttpException(error.message || 'Internal Server Error', error.status || 500);
        }
    }

    async getEmployeeAverage(id: string) {
        try {
            const user = await this.prisma.employee.findUnique({
                where: { id },
                include: { assignedTasks: true }
            })
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();

            const MonthlyStats: MonthlyStats[] = [];
            for (let month = 0; month <= currentMonth; month++) {
                const tasksThisMonth = user?.assignedTasks.filter(task => {
                    const taskDate = new Date(task.createdAt);
                    return taskDate.getFullYear() === currentYear && taskDate.getMonth() === month;
                }) ?? [];
                
                const totalTaskCount = tasksThisMonth.length;
                const completedTaskCount = tasksThisMonth.filter(task => 
                    task.status === Status.COMPLETED
                ).length;

                const completionRate = totalTaskCount > 0 
                    ? (completedTaskCount / totalTaskCount) * 100 
                    : 0;
                
                MonthlyStats.push({
                    month: new Date(currentYear, month, 1).toLocaleString('default', { month: 'long' }),
                    totalTasks: totalTaskCount,
                    completedTasks: completedTaskCount,
                    completionRate 
                });
            }
            return MonthlyStats;
            
            
        } catch (error) {
            throw new HttpException('Internal Server Error', 500);
        }
    }

    async getTaskAssignedByAdminId(id: string){
        try {
            const tasks = await this.prisma.task.findMany({
                where: { adminId: id }
            });
            if (!tasks) {
                return {
                    message: 'No tasks found'
                }
            }
            return tasks;
        } catch (error) {
            throw new HttpException('Internal Server Error', 500);
        }
    }
}