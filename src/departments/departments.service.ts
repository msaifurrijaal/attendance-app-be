import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './departments.entity';
import { Repository } from 'typeorm';
import { CreateDepartmentDto, UpdateDepartmentDto } from './departments.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private repo: Repository<Department>,
  ) {}

  create(dto: CreateDepartmentDto) {
    const data = this.repo.create(dto);
    return this.repo.save(data);
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const data = await this.repo.findOneBy({ id });

    if (!data)
      throw new NotFoundException(`Department with id ${id} not found`);
    Object.assign(data, dto);

    return this.repo.save(data);
  }
}
