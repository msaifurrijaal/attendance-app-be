import { AppDataSource } from '../data-source';
import { departmentSeeder } from './department.seed';
import { roleSeeder } from './role.seed';
import { userSeeder } from './user.seed';

async function runSeed() {
  await AppDataSource.initialize();

  console.log('🌱 Seeding started...');

  await roleSeeder(AppDataSource);
  await departmentSeeder(AppDataSource);
  await userSeeder(AppDataSource);

  console.log('✅ Seeding finished');

  await AppDataSource.destroy();
}

runSeed();
