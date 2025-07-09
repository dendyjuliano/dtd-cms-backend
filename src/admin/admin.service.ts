import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginDto } from './dto/login.dto';

// Create interface for database errors
interface DatabaseError extends Error {
  code?: string;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const admin = await this.adminRepository.findOne({
      where: { email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: admin.email, sub: admin.id };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        first_name: admin.first_name,
        last_name: admin.last_name,
        email: admin.email,
      },
    };
  }

  async getProfile(adminId: string) {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'date_of_birth',
        'gender',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return { admin };
  }

  async updateProfile(adminId: string, updateAdminDto: UpdateAdminDto) {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Create update data with proper typing
    const updateData: {
      first_name?: string;
      last_name?: string;
      email?: string;
      date_of_birth?: Date;
      gender?: string;
      password?: string;
    } = {};

    if (updateAdminDto.first_name)
      updateData.first_name = updateAdminDto.first_name;
    if (updateAdminDto.last_name)
      updateData.last_name = updateAdminDto.last_name;
    if (updateAdminDto.email) updateData.email = updateAdminDto.email;
    if (updateAdminDto.gender) updateData.gender = updateAdminDto.gender;
    if (updateAdminDto.date_of_birth) {
      updateData.date_of_birth = new Date(updateAdminDto.date_of_birth);
    }
    if (updateAdminDto.password) {
      updateData.password = await bcrypt.hash(updateAdminDto.password, 10);
    }

    try {
      await this.adminRepository.update(adminId, updateData);

      const updatedAdmin = await this.adminRepository.findOne({
        where: { id: adminId },
        select: [
          'id',
          'first_name',
          'last_name',
          'email',
          'date_of_birth',
          'gender',
          'updatedAt',
        ],
      });

      return {
        message: 'Profile updated successfully',
        admin: updatedAdmin,
      };
    } catch (error) {
      const dbError = error as DatabaseError;
      if (dbError.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async findAll() {
    const admins = await this.adminRepository.find({
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'date_of_birth',
        'gender',
        'createdAt',
        'updatedAt',
      ],
      order: { createdAt: 'DESC' },
    });

    return { admins };
  }

  async findOne(id: string) {
    const admin = await this.adminRepository.findOne({
      where: { id },
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'date_of_birth',
        'gender',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return { admin };
  }

  async create(createAdminDto: CreateAdminDto) {
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const admin = this.adminRepository.create({
      first_name: createAdminDto.first_name,
      last_name: createAdminDto.last_name,
      email: createAdminDto.email,
      gender: createAdminDto.gender,
      date_of_birth: new Date(createAdminDto.date_of_birth),
      password: hashedPassword,
    });

    try {
      const savedAdmin = await this.adminRepository.save(admin);

      // eslint-disable-next-line
      const { password, ...adminWithoutPassword } = savedAdmin;

      return {
        message: 'Admin created successfully',
        admin: adminWithoutPassword,
      };
    } catch (error) {
      const dbError = error as DatabaseError;
      if (dbError.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    const admin = await this.adminRepository.findOne({ where: { id } });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Create update data with proper typing
    const updateData: {
      first_name?: string;
      last_name?: string;
      email?: string;
      date_of_birth?: Date;
      gender?: string;
      password?: string;
    } = {};

    if (updateAdminDto.first_name)
      updateData.first_name = updateAdminDto.first_name;
    if (updateAdminDto.last_name)
      updateData.last_name = updateAdminDto.last_name;
    if (updateAdminDto.email) updateData.email = updateAdminDto.email;
    if (updateAdminDto.gender) updateData.gender = updateAdminDto.gender;
    if (updateAdminDto.date_of_birth) {
      updateData.date_of_birth = new Date(updateAdminDto.date_of_birth);
    }
    if (updateAdminDto.password) {
      updateData.password = await bcrypt.hash(updateAdminDto.password, 10);
    }

    try {
      await this.adminRepository.update(id, updateData);

      const updatedAdmin = await this.adminRepository.findOne({
        where: { id },
        select: [
          'id',
          'first_name',
          'last_name',
          'email',
          'date_of_birth',
          'gender',
          'updatedAt',
        ],
      });

      return {
        message: 'Admin updated successfully',
        admin: updatedAdmin,
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
    const result = await this.adminRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Admin not found');
    }

    return {
      message: 'Admin deleted successfully',
    };
  }
}
