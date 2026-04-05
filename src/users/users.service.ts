import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { IsNull, Like, Repository } from 'typeorm';
import { GetUsersDto } from './users.dto';
import { mappingResponse } from 'src/utils/responseHandler.util';
import { errorHandler } from 'src/utils/errorHandler.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) { }

  async findAll(dto: GetUsersDto) {
    const {
      limit = 10,
      page = 1,
      search,
      department_id,
      role_id,
      sort_by = 'updated_at',
      sort_order = 'desc',
      with_deleted,
    } = dto;

    const isPaginated = limit !== -1;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (!with_deleted) where.deleted_at = IsNull();
    if (department_id) where.department_id = department_id;
    if (role_id) where.role_id = role_id;
    if (search) where.full_name = Like(`%${search}%`);

    try {
      const [data, total] = await this.repo.findAndCount({
        where,
        order: { [sort_by]: sort_order },
        relations: ['role', 'department'],
        withDeleted: with_deleted,
        ...(isPaginated && { take: limit, skip }),
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mappedData = data.map(({ password, ...user }) => (user));

      return mappingResponse({
        message: 'Users found successfully',
        extras: {
          data: mappedData,
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

  async findById(id: string, withDeleted: boolean = false) {
    try {
      const user = await this.repo.findOne({
        where: { id },
        relations: ['role', 'department'],
        withDeleted,
      });

      if (!user) throw new NotFoundException(`User with id ${id} not found`);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, role_id, department_id, ...restData } = user;

      return mappingResponse({
        message: 'User found successfully',
        extras: {
          user: {
            ...restData,
          }
        },
      });
    } catch (error) {
      errorHandler(error);
    }
  }

  async delete(id: string) {
    try {
      const user = await this.repo.findOne({ where: { id, deleted_at: IsNull() } });
      if (!user) throw new NotFoundException(`User with id ${id} not found`);
      await this.repo.softRemove(user);

      return mappingResponse({ message: 'User deleted successfully' });
    } catch (error) {
      errorHandler(error);
    }
  }
}
