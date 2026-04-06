import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Role } from './roles.entity';
import { mappingResponse } from 'src/utils/responseHandler.util';
import { errorHandler } from 'src/utils/errorHandler.util';
import { GetRolesDto } from './roles.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) { }

  async getRoleAdminHr() {
    try {
      const data = await this.roleRepo.findOne({
        where: { code: 'ADMIN_HR' },
      });

      if (!data) throw new NotFoundException('Admin HR Role not found');

      return mappingResponse({
        message: 'Admin HR Role found',
        extras: { data },
      });
    } catch (error) {
      errorHandler(error);
    }
  }

  async findAll(dto: GetRolesDto) {
    const {
      limit = 10,
      page = 1,
      search,
      sort_by = 'updated_at',
      sort_order = 'desc',
    } = dto;

    const isPaginated = limit !== -1;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) where.name = Like(`%${search}%`);

    try {
      const [data, total] = await this.roleRepo.findAndCount({
        where,
        order: { [sort_by]: sort_order },
        ...(isPaginated && { take: limit, skip }),
      });

      return mappingResponse({
        message: 'Roles found successfully',
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

}
