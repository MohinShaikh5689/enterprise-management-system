import { PrismaService } from "src/Prisma/prisma.service";
import { HttpException, Injectable } from "@nestjs/common";
import { CreateEmployeeDto } from "./CreateEmployee.dto";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  checkIfEmailExists = async (email: string) => {
    const user = await this.prisma.employee.findUnique({
        where: {
            email,
        },
        });
       if(!user){
            const admin = await this.prisma.admin.findUnique({
                where: {
                    email,
                },
            });
            return admin || null;
       }
         return user;
    };

  async CreateUser (data: CreateEmployeeDto) {
    try {
        const existingUser = await this.checkIfEmailExists(data.email);
        if (existingUser) {
            throw new HttpException('User with this email already exists', 409);
        }
        await this.prisma.employee.create({
           data:{
                name: data.name,
                email: data.email,
                password: data.password,
                departmentId: data.department,
                role: data.role,
           }
        })
        return 'User created successfully';
    } catch (error) {
        console.log(error);
        throw new HttpException(error.message, error.status);
    }
  };

  async CreateAdmin (data: CreateEmployeeDto) {
    try {
        const existingUser = await this.checkIfEmailExists(data.email);
        if (existingUser) {
            throw new HttpException('User with this email already exists', 409);
        }
        await this.prisma.admin.create({
           data:{
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role,
                departmentId: data.department,
           }
        })
        return 'Admin created successfully';
    } catch (error) {
        throw new HttpException(error.message, error.status);
    }
  };

  async getEmployees() {
    try {
        const employees = await this.prisma.employee.findMany(
            {
                include:{department: true}
            }
        );
        return employees.map(employee => ({
            id : employee.id,
            name: employee.name,
            email: employee.email,
            department: employee.department.name,
            joined: employee.createdAt
        }));
    } catch (error) {
        throw new HttpException('Internal Server Error', 500);
    }
  }

  async getDepartments() {
    try {
        const departments = await this.prisma.department.findMany({
            select:{
                id: true,
                name: true,
            }
        });
        return departments;
    } catch (error) {
        throw new HttpException('Internal Server Error', 500);
    }
  }

  async getDepartmentByName(name: string) {
    try {
        const department = await this.prisma.department.findFirst({
            where: {
                name
            },include: {employees: true}
        });
        return department;
    } catch (error) {
        throw new HttpException('Internal Server Error', 500);
    }
  }

}
