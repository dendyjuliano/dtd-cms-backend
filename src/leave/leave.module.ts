import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { Leave } from './entities/leave.entity';
import { Staff } from '../staff/entities/staff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Leave, Staff])],
  controllers: [LeaveController],
  providers: [LeaveService],
})
export class LeaveModule {}
