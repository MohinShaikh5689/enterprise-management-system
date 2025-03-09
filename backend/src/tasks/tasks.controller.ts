import { Controller, Post, Request, UseGuards, UnauthorizedException, Body, Get, Param, Req } from '@nestjs/common';
import { AuthGuard } from 'src/Utils/authGuard';
import { TaskService, MonthlyStats } from './task.service';
import { CreateTaskDto } from './createTask.dto';
import { Status } from '@prisma/client';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TaskService) {}
    
    @UseGuards(AuthGuard)
    @Post()
    async createTask(@Request() req:any, @Body() data: CreateTaskDto) {
        if(!req.admin){
           throw new UnauthorizedException('Only Admins can create tasks');
        }

        return this.taskService.createTask(req.admin, data);
    }

    @UseGuards(AuthGuard)
    @Get()
    async getTasks(@Request() req:any) {
        if(!req.user){
            throw new UnauthorizedException('Only Employees can view tasks');
        }
        return this.taskService.getTasksBYEmployeeId(req.user.id);
    }

    @UseGuards(AuthGuard)
    @Get('average/:department')
    async getAverageByDepartment(@Request() req:any, @Param('department') department: string): Promise<{ 
        department: string; 
        monthlyStats: MonthlyStats[]; 
        overall: { 
            totalTasks: number; 
            completedTasks: number; 
            completionRate: number; 
        }; 
    }> {
        if(!req.admin){
            console.log("req triggered");
            throw new UnauthorizedException('Only Admins can view average tasks');
        }
        return this.taskService.getAverageByDepartment(department);
    }

    @UseGuards(AuthGuard)
    @Get('average')
    async getAverage(@Request() req:any){
        if(!req.user){
            throw new UnauthorizedException('Only Employees can view average tasks');
        }
        return this.taskService.getEmployeeAverage(req.user.id);
    }

    @UseGuards(AuthGuard)
    @Post(':id/:status')
    async updateTaskStatus(
      @Request() req: any, 
      @Param('id') id: string,
      @Param('status') statusParam: string
    ) {
      if (!req.user) {
        throw new UnauthorizedException('Only Employees can update tasks');
      }
      
        const status = statusParam as Status;
      
      return this.taskService.updateTaskStatus(id, status);
    }

    @UseGuards(AuthGuard)
    @Get('getTasksByAdmin')
    async getTasksByAdmin(@Req() req:any) {
        if(!req.admin){
            throw new UnauthorizedException('Only Admins can view tasks');
        }
        return this.taskService.getTaskAssignedByAdminId(req.admin.id);
    }

}


