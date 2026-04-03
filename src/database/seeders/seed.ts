import { AppDataSource } from '../data-source';
import { departmentSeeder } from './department.seed';
import { roleSeeder } from './role.seed';

async function runSeed() {
  await AppDataSource.initialize();

  console.log('🌱 Seeding started...');

  await roleSeeder(AppDataSource);
  await departmentSeeder(AppDataSource);

  console.log('✅ Seeding finished');

  await AppDataSource.destroy();
}

runSeed();
