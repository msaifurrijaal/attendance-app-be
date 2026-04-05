import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './departments.entity';
import { IsNull, Like, Repository } from 'typeorm';
import {
  CreateDepartmentDto,
  GetDepartmentsDto,
  UpdateDepartmentDto,
} from './departments.dto';
import { errorHandler } from 'src/utils/errorHandler.util';
import { mappingResponse } from 'src/utils/responseHandler.util';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private repo: Repository<Department>,
  ) { }

  async create(dto: CreateDepartmentDto) {
    try {
      const data = this.repo.create(dto);
      const result = await this.repo.save(data);
      return mappingResponse({
        message: 'Department created successfully',
        extras: result,
      });
    } catch (error) {
      errorHandler(error);
    }
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    try {
      const data = await this.repo.findOneBy({ id, deleted_at: IsNull() });

      if (!data)
        throw new NotFoundException(`Department with id ${id} not found`);
      Object.assign(data, dto);

      const result = await this.repo.save(data);
      return mappingResponse({
        message: 'Department updated successfully',
        extras: result,
      });
    } catch (error) {
      errorHandler(error);
    }
  }

  async findById(id: string, withDeleted?: boolean) {
    try {
      const data = await this.repo.findOne({
        where: { id },
        withDeleted,
      });

      if (!data)
        throw new NotFoundException(`Department with id ${id} not found`);

      return mappingResponse({
        message: 'Department found successfully',
        extras: data,
      });
    } catch (error) {
      errorHandler(error);
    }
  }

  async findAll(dto: GetDepartmentsDto) {
    const {
      limit = 10,
      page = 1,
      search,
      sort_by = 'updated_at',
      sort_order = 'desc',
      with_deleted,
    } = dto;

    const isPaginated = limit !== -1;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.name = Like(`%${search}%`);
    }

    if (!with_deleted) {
      where.deleted_at = IsNull();
    }

    try {
      const [data, total] = await this.repo.findAndCount({
        where,
        order: { [sort_by]: sort_order },
        withDeleted: with_deleted,
        ...(isPaginated && { take: limit, skip }),
      });

      return mappingResponse({
        message: 'Departments found successfully',
        extras: {
          data,
          meta: {
            page: isPaginated ? page : 1,
            limit: isPaginated ? limit : total,
            total,
            total_pages: isPaginated ? Math.ceil(total / limit) : 1,
          },
        },
      });
    } catch (error) {
      errorHandler(error);
    }
  }

  async delete(id: string) {
    try {
      const data = await this.repo.findOneBy({ id, deleted_at: IsNull() });

      if (!data)
        throw new NotFoundException(`Department with id ${id} not found`);

      await this.repo.softRemove(data);

      return mappingResponse({ message: 'Department deleted successfully' });
    } catch (error) {
      errorHandler(error);
    }
  }
}
