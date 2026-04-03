import { Department } from 'src/departments/departments.entity';
import { DataSource } from 'typeorm';

export async function departmentSeeder(dataSource: DataSource) {
  const repo = dataSource.getRepository(Department);

  const data = [
    { code: 'HR', name: 'Human Resource' },
    { code: 'IT', name: 'Information Technology' },
    { code: 'FIN', name: 'Finance' },
  ];

  for (const item of data) {
    const exist = await repo.findOne({ where: { code: item.code } });

    if (!exist) {
      await repo.save(item);
    }
  }

  console.log('Departments seeded successfully');
}
