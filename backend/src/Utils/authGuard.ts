import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        const token = authorization?.split(' ')[1];  // Get token from Authorization header
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET
            });
            let admin: { id: string; name: string; email: string; role: string } | null = null;
            const user = await this.prisma.employee.findUnique({ 
                where: { id: payload.id },
                select: { id: true, name: true, email: true,role:true }
            });
            if (!user) {
                 admin = await this.prisma.admin.findUnique({
                    where: { id: payload.id },
                    select: { id: true, name: true, email: true, role: true }
                });
                request.admin = admin;  
                return Promise.resolve(true);
            }
            request.user = user;  
            return Promise.resolve(true);
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

}