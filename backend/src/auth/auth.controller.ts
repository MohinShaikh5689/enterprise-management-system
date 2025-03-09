import { Controller, Post, Body } from '@nestjs/common';
import { CreateEmployeeDto } from 'src/admin/CreateEmployee.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('login')
    async Login(@Body() data: CreateEmployeeDto) {
        return this.authService.Login(data);
    }
    @Post('admin-login')
    async adminLogin(@Body() data: CreateEmployeeDto) {
        return this.authService.adminLogin(data);
    }
}
