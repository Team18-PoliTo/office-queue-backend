import {
  IsNumber,
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";
import { ServiceDTO } from "./ServiceDTO";

export class CounterDTO {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceDTO)
  services: ServiceDTO[];
}

export default CounterDTO;
