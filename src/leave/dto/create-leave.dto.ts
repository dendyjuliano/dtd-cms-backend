import { IsNotEmpty, IsString, IsDateString, IsUUID } from 'class-validator';

export class CreateLeaveDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsDateString()
  @IsNotEmpty()
  date_start: string;

  @IsDateString()
  @IsNotEmpty()
  date_end: string;

  @IsUUID()
  @IsNotEmpty()
  staff_id: string;
}
