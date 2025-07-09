import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Leave } from './entities/leave.entity';
import { Staff } from '../staff/entities/staff.entity';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';

interface DatabaseError extends Error {
  code?: string;
}

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(Leave)
    private leaveRepository: Repository<Leave>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  async findAll() {
    const leaves = await this.leaveRepository.find({
      relations: ['staff'],
      select: {
        id: true,
        reason: true,
        date_start: true,
        date_end: true,
        staff_id: true,
        createdAt: true,
        updatedAt: true,
        staff: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          no_hp: true,
          address: true,
          gender: true,
        },
      },
      order: { createdAt: 'DESC' },
    });

    return { leaves };
  }

  async findOne(id: string) {
    const leave = await this.leaveRepository.findOne({
      where: { id },
      relations: ['staff'],
      select: {
        id: true,
        reason: true,
        date_start: true,
        date_end: true,
        staff_id: true,
        createdAt: true,
        updatedAt: true,
        staff: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          no_hp: true,
          address: true,
          gender: true,
        },
      },
    });

    if (!leave) {
      throw new NotFoundException('Leave not found');
    }

    return { leave };
  }

  async findStaffOnLeave() {
    const staffOnLeave = await this.staffRepository.find({
      relations: ['leaves'],
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        no_hp: true,
        address: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
        leaves: {
          id: true,
          reason: true,
          date_start: true,
          date_end: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    });

    // Filter only staff that have leaves
    const staffWithLeaves = staffOnLeave.filter(
      (staff) => staff.leaves.length > 0,
    );

    return { staff: staffWithLeaves };
  }

  async create(createLeaveDto: CreateLeaveDto) {
    const { staff_id, date_start, date_end, reason } = createLeaveDto;

    // Check if staff exists
    const staff = await this.staffRepository.findOne({
      where: { id: staff_id },
    });

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    const startDate = new Date(date_start);
    const endDate = new Date(date_end);

    // Validate dates
    if (startDate > endDate) {
      throw new BadRequestException('Start date cannot be after end date');
    }

    // Calculate leave duration in days
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates

    // Check annual leave limit (12 days per year)
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31);

    const existingLeavesThisYear = await this.leaveRepository.find({
      where: {
        staff_id,
        date_start: Between(yearStart, yearEnd),
      },
    });

    let totalDaysUsed = 0;
    existingLeavesThisYear.forEach((leave) => {
      const leaveDuration =
        Math.ceil(
          (leave.date_end.getTime() - leave.date_start.getTime()) /
            (1000 * 3600 * 24),
        ) + 1;
      totalDaysUsed += leaveDuration;
    });

    if (totalDaysUsed + daysDiff > 12) {
      throw new BadRequestException(
        `Annual leave limit exceeded. Used: ${totalDaysUsed} days, Requesting: ${daysDiff} days, Limit: 12 days per year`,
      );
    }

    // Check monthly leave limit (1 leave per month)
    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();
    const monthStart = new Date(startYear, startMonth, 1);
    const monthEnd = new Date(startYear, startMonth + 1, 0);

    const existingLeaveThisMonth = await this.leaveRepository.findOne({
      where: {
        staff_id,
        date_start: Between(monthStart, monthEnd),
      },
    });

    if (existingLeaveThisMonth) {
      throw new BadRequestException(
        `Staff can only take 1 leave per month. Leave already exists in ${monthStart.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
      );
    }

    // Create leave
    const leave = this.leaveRepository.create({
      reason,
      date_start: startDate,
      date_end: endDate,
      staff_id,
    });

    try {
      const savedLeave = await this.leaveRepository.save(leave);

      // Fetch the complete leave with staff details
      const completeLeave = await this.leaveRepository.findOne({
        where: { id: savedLeave.id },
        relations: ['staff'],
        select: {
          id: true,
          reason: true,
          date_start: true,
          date_end: true,
          staff_id: true,
          createdAt: true,
          updatedAt: true,
          staff: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            no_hp: true,
            address: true,
            gender: true,
          },
        },
      });

      return {
        message: 'Leave created successfully',
        leave: completeLeave,
      };
    } catch (error) {
      const dbError = error as DatabaseError;
      throw dbError;
    }
  }

  async update(id: string, updateLeaveDto: UpdateLeaveDto) {
    const leave = await this.leaveRepository.findOne({ where: { id } });

    if (!leave) {
      throw new NotFoundException('Leave not found');
    }

    // If staff_id is being updated, check if new staff exists
    if (updateLeaveDto.staff_id) {
      const staff = await this.staffRepository.findOne({
        where: { id: updateLeaveDto.staff_id },
      });

      if (!staff) {
        throw new NotFoundException('Staff not found');
      }
    }

    // Create update data
    const updateData: {
      reason?: string;
      date_start?: Date;
      date_end?: Date;
      staff_id?: string;
    } = {};

    if (updateLeaveDto.reason) updateData.reason = updateLeaveDto.reason;
    if (updateLeaveDto.date_start)
      updateData.date_start = new Date(updateLeaveDto.date_start);
    if (updateLeaveDto.date_end)
      updateData.date_end = new Date(updateLeaveDto.date_end);
    if (updateLeaveDto.staff_id) updateData.staff_id = updateLeaveDto.staff_id;

    // Validate dates if both are provided
    if (updateData.date_start && updateData.date_end) {
      if (updateData.date_start > updateData.date_end) {
        throw new BadRequestException('Start date cannot be after end date');
      }
    }

    try {
      await this.leaveRepository.update(id, updateData);

      const updatedLeave = await this.leaveRepository.findOne({
        where: { id },
        relations: ['staff'],
        select: {
          id: true,
          reason: true,
          date_start: true,
          date_end: true,
          staff_id: true,
          updatedAt: true,
          staff: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            no_hp: true,
            address: true,
            gender: true,
          },
        },
      });

      return {
        message: 'Leave updated successfully',
        leave: updatedLeave,
      };
    } catch (error) {
      const dbError = error as DatabaseError;
      throw dbError;
    }
  }

  async remove(id: string) {
    const result = await this.leaveRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Leave not found');
    }

    return {
      message: 'Leave deleted successfully',
    };
  }
}
