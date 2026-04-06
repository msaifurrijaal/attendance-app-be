import { Department } from 'src/departments/departments.entity';
import { DataSource } from 'typeorm';

export async function departmentSeeder(dataSource: DataSource) {
  const repo = dataSource.getRepository(Department);

  const data = [
    { code: 'HUMAN_RESOURCE', name: 'Human Resource' },
    { code: 'INFORMATION_TECHNLOGY', name: 'Information Technology' },
    { code: 'FINANCE', name: 'Finance' },
  ];

  for (const item of data) {
    const exist = await repo.findOne({ where: { code: item.code } });

    if (!exist) {
      await repo.save(item);
    }
  }

  console.log('Departments seeded successfully');
}
