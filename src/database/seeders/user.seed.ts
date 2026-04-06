import { DataSource } from 'typeorm';
import { User } from '../../users/users.entity';
import { Role } from '../../roles/roles.entity';
import { Department } from '../../departments/departments.entity';
import * as bcrypt from 'bcrypt';

export async function userSeeder(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(Role);
  const deptRepo = dataSource.getRepository(Department);

  const roleAdminHr = await roleRepo.findOne({ where: { code: 'ADMIN_HR' } });
  const roleEmployee = await roleRepo.findOne({ where: { code: 'EMPLOYEE' } });

  const deptHr = await deptRepo.findOne({ where: { code: 'HUMAN_RESOURCE' } });
  const deptIt = await deptRepo.findOne({ where: { code: 'INFORMATION_TECHNLOGY' } });

  if (!roleAdminHr || !roleEmployee || !deptHr || !deptIt) {
    console.log('❌ Required roles or departments not found, skipping user seeder');
    return;
  }

  const users = [
    {
      full_name: 'Admin HR',
      email: 'adminhr@mail.com',
      password: 'admin123',
      role_id: roleAdminHr.id,
      department_id: deptHr.id,
      position: 'HR Manager',
    },
    {
      full_name: 'Developer Backend',
      email: 'devbe@mail.com',
      password: 'employee123',
      role_id: roleEmployee.id,
      department_id: deptIt.id,
      position: 'Backend Developer',
    },
    {
      full_name: 'Developer Frontend',
      email: 'devfe@mail.com',
      password: 'employee123',
      role_id: roleEmployee.id,
      department_id: deptIt.id,
      position: 'Frontend Developer',
    },
  ];

  for (const user of users) {
    const existing = await userRepo.findOne({ where: { email: user.email } });

    if (!existing) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await userRepo.save({ ...user, password: hashedPassword });
    }
  }

  console.log('Users seeded successfully');
}