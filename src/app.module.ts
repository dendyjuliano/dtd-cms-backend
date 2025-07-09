import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { StaffModule } from './staff/staff.module';
import { LeaveModule } from './leave/leave.module';
import { Admin } from './admin/entities/admin.entity';
import { Staff } from './staff/entities/staff.entity';
import { Leave } from './leave/entities/leave.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'dtd_cms',
      entities: [Admin, Staff, Leave],
      synchronize: false,
      logging: true,
      migrations: ['dist/migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations',
    }),
    AdminModule,
    StaffModule,
    LeaveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
