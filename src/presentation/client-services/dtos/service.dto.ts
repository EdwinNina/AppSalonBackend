import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ServiceDto {

   @IsNotEmpty()
   @IsString()
   name!: string;

   @IsNotEmpty()
   @IsNumber()
   price!: number;
}