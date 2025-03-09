import { Controller, Post, Body, UseGuards, Get, UnauthorizedException, Req, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateEmployeeDto } from './CreateEmployee.dto';
import { AuthGuard } from 'src/Utils/authGuard';

@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) {}
    @UseGuards(AuthGuard)
    @Post('create-employee')
    async CreateUser(@Body() data: CreateEmployeeDto) {
        return this.adminService.CreateUser(data);
    }
    @UseGuards(AuthGuard)
    @Post('create-admin')
    async CreateAdmin(@Body() data: CreateEmployeeDto) {
        return this.adminService.CreateAdmin(data);
    }
    @UseGuards(AuthGuard)
    @Get('employees')
    async getEmployees(@Req() req:any) {
        if(!req.admin){
            throw new UnauthorizedException('Only Admins can view employees');
        }
        return this.adminService.getEmployees();
    }

    @UseGuards(AuthGuard)
    @Get('departments')
    async getDepartments(@Req() req:any) {
        if(!req.admin){
            throw new UnauthorizedException('Only Admins can view departments');
        }
        return this.adminService.getDepartments();
    }

    @UseGuards(AuthGuard)
    @Get('department/:name')
    async getDepartment(@Param('name') name: string) {
        return this.adminService.getDepartmentByName(name);
    }

}
