import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('leave')
@UseGuards(JwtAuthGuard) // All routes are protected
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get()
  async findAll() {
    return this.leaveService.findAll();
  }

  @Get('staff-on-leave')
  async findStaffOnLeave() {
    return this.leaveService.findStaffOnLeave();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.leaveService.findOne(id);
  }

  @Post()
  async create(@Body(ValidationPipe) createLeaveDto: CreateLeaveDto) {
    return this.leaveService.create(createLeaveDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateLeaveDto: UpdateLeaveDto,
  ) {
    return this.leaveService.update(id, updateLeaveDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.leaveService.remove(id);
  }
}
