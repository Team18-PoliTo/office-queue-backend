import {IsNotEmpty, IsNumber, IsPositive, IsString} from "class-validator";

export class TicketDTO {
    @IsNumber()
    id: number;

    @IsString()
    @IsNotEmpty()
    serviceName: string;

    timestamp: string;
}

export default TicketDTO;
