import { DataSource } from 'typeorm';
import { Role } from '../../roles/roles.entity';

export async function roleSeeder(dataSource: DataSource) {
  const roleRepo = dataSource.getRepository(Role);

  const roles = [
    { code: 'ADMIN_HR', name: 'Admin HR' },
    { code: 'EMPLOYEE', name: 'Employee' },
  ];

  for (const role of roles) {
    const existing = await roleRepo.findOne({
      where: { code: role.code },
    });

    if (!existing) {
      await roleRepo.save(role);
    }
  }

  console.log('Roles seeded successfully');
}
