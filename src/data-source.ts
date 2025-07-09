import { DataSource } from 'typeorm';
import { Admin } from './admin/entities/admin.entity';
import { Staff } from './staff/entities/staff.entity';
import { Leave } from './leave/entities/leave.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'dtd_cms',
  entities: [Admin, Staff, Leave],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
