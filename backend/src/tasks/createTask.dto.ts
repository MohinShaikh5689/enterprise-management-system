import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Status } from "@prisma/client";


export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    status: Status;

    @IsNotEmpty()
    @IsString()
    assignedTo: string;
}