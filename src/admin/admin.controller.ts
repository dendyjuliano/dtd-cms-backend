import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Define interface for authenticated request
interface AuthenticatedRequest extends Request {
  user: {
    adminId: string;
    email: string;
  };
}

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('auth/login')
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.adminService.login(loginDto);
  }

  @Post('auth/logout')
  logout() {
    return { message: 'Logout successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: AuthenticatedRequest) {
    return this.adminService.getProfile(req.user.adminId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body(ValidationPipe) updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.updateProfile(req.user.adminId, updateAdminDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('manage')
  async findAll() {
    return this.adminService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('manage/:id')
  async findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('manage')
  async create(@Body(ValidationPipe) createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('manage/:id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.update(id, updateAdminDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('manage/:id')
  async remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
