// @ts-ignore
import { IsNumber, IsString, IsNotEmpty, IsPositive } from 'class-validator';

export class ServiceResponseDTO {
    @IsNumber()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}