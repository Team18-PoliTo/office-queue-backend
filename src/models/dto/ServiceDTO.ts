// @ts-ignore
import { IsNumber, IsString, IsNotEmpty, IsPositive } from 'class-validator';

export class ServiceDTO {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  avg_process_time: number;
}
