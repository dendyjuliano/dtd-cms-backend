import { IsOptional, IsString, IsDateString, IsUUID } from 'class-validator';

export class UpdateLeaveDto {
  @IsString()
  @IsOptional()
  reason?: string;

  @IsDateString()
  @IsOptional()
  date_start?: string;

  @IsDateString()
  @IsOptional()
  date_end?: string;

  @IsUUID()
  @IsOptional()
  staff_id?: string;
}
