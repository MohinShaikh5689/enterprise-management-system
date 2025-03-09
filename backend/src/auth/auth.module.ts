import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/Prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Import the module, not the service
  controllers: [AuthController], // Move controller here instead of exporting it
  providers: [AuthService],
})
export class AuthModule {}