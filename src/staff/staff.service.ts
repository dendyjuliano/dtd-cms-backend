import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

// Create interface for database errors
interface DatabaseError extends Error {
  code?: string;
}

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  async findAll() {
    const staff = await this.staffRepository.find({
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'no_hp',
        'address',
        'gender',
        'createdAt',
        'updatedAt',
      ],
      order: { createdAt: 'DESC' },
    });

    return { staff };
  }

  async findOne(id: string) {
    const staff = await this.staffRepository.findOne({
      where: { id },
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'no_hp',
        'address',
        'gender',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    return { staff };
  }

  async create(createStaffDto: CreateStaffDto) {
    const staff = this.staffRepository.create({
      first_name: createStaffDto.first_name,
      last_name: createStaffDto.last_name,
      email: createStaffDto.email,
      no_hp: createStaffDto.no_hp,
      address: createStaffDto.address,
      gender: createStaffDto.gender,
    });

    try {
      const savedStaff = await this.staffRepository.save(staff);

      return {
        message: 'Staff created successfully',
        staff: savedStaff,
      };
    } catch (error) {
      const dbError = error as DatabaseError;
      if (dbError.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async update(id: string, updateStaffDto: UpdateStaffDto) {
    const staff = await this.staffRepository.findOne({ where: { id } });

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    // Create update data with proper typing
    const updateData: {
      first_name?: string;
      last_name?: string;
      email?: string;
      no_hp?: string;
      address?: string;
      gender?: string;
    } = {};

    if (updateStaffDto.first_name)
      updateData.first_name = updateStaffDto.first_name;
    if (updateStaffDto.last_name)
      updateData.last_name = updateStaffDto.last_name;
    if (updateStaffDto.email) updateData.email = updateStaffDto.email;
    if (updateStaffDto.no_hp) updateData.no_hp = updateStaffDto.no_hp;
    if (updateStaffDto.address) updateData.address = updateStaffDto.address;
    if (updateStaffDto.gender) updateData.gender = updateStaffDto.gender;

    try {
      await this.staffRepository.update(id, updateData);

      const updatedStaff = await this.staffRepository.findOne({
        where: { id },
        select: [
          'id',
          'first_name',
          'last_name',
          'email',
          'no_hp',
          'address',
          'gender',
          'updatedAt',
        ],
      });

      return {
        message: 'Staff updated successfully',
        staff: updatedStaff,
      };
    } catch (error) {
      const dbError = error as DatabaseError;
      if (dbError.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    const result = await this.staffRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Staff not found');
    }

    return {
      message: 'Staff deleted successfully',
    };
  }
}
