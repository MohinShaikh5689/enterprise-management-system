import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TasksController } from './tasks.controller';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' }
        })
    ],
    providers: [TaskService],
    controllers: [TasksController]
})
export class TaskModule { }