import { PrismaService } from "src/Prisma/prisma.service";
import { HttpException, Injectable } from "@nestjs/common";
import { CreateEmployeeDto } from "src/admin/CreateEmployee.dto";
import { generateToken } from "src/Utils/generateToken";


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async Login(data: CreateEmployeeDto) {
        const checkUser = await this.prisma.employee.findUnique({
            where: {
                email: data.email,
            },
        });
        if (!checkUser) {
            throw new HttpException('User not found', 404);
        }
        if (checkUser.password !== data.password) {
            throw new HttpException('Incorrect password', 401);
        }
        const token = generateToken(checkUser.id);
        return {
            message: 'Login successful',
            token,
            role: checkUser.role,
            name: checkUser.name
        }
    }

    async adminLogin(data: CreateEmployeeDto) {
        const checkAdmin = await this.prisma.admin.findUnique({
            where: {
                email: data.email,
            },
            include: { department: true }
        });
        if (!checkAdmin) {
            throw new HttpException("User does not exist", 404);
        }
        if (checkAdmin.password !== data.password) {
            throw new HttpException("Incorrect password", 401);
        }
        const token = generateToken(checkAdmin.id);
        return {
            message: 'Login successful',
            token,
            role: checkAdmin.role,
            name: checkAdmin.name,
            department: checkAdmin.department.name
        }
    };
}