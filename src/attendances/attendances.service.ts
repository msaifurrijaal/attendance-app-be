import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Attendance } from './attendances.entity';
import { UserJwtPayload } from 'src/auth/types/auth.type';
import { IsNull } from 'typeorm';
import {
  CheckInDto,
  CheckOutDto,
  GetAttendancesDto,
  UpdateAttendanceDto,
} from './attendances.dto';
import { mappingResponse } from 'src/utils/responseHandler.util';
import { errorHandler } from 'src/utils/errorHandler.util';
import { ConfigService } from '@nestjs/config';
import { toPhotoUrl } from 'src/utils/photoUrl.util';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private readonly repo: Repository<Attendance>,
    private configService: ConfigService,
  ) {}

  async checkIn(dto: CheckInDto, user: UserJwtPayload) {
    try {
      const existing = await this.repo.findOne({
        where: {
          user_id: user.id,
          check_out_time: IsNull(),
          deleted_at: IsNull(),
        },
        withDeleted: false,
      });

      if (existing) {
        throw new BadRequestException(
          'You already have an active check-in, please check-out first',
        );
      }

      const attendance = this.repo.create({
        user_id: user.id,
        check_in_time: new Date(dto.check_in_time),
        check_in_photo: dto.check_in_photo,
      });

      const saved = await this.repo.save(attendance);

      return mappingResponse({
        message: 'Check-in successful',
        extras: {
          data: {
            ...saved,
            check_in_photo: toPhotoUrl(saved?.check_in_photo),
          },
        },
      });
    } catch (error) {
      errorHandler(error);
    }
  }

  async checkOut(dto: CheckOutDto, user: UserJwtPayload) {
    try {
      const attendance = await this.repo.findOne({
        where: {
          user_id: user.id,
          check_out_time: IsNull(),
          deleted_at: IsNull(),
        },
      });

      if (!attendance) {
        throw new NotFoundException('No active check-in found');
      }

      if (new Date(dto.check_out_time) <= attendance.check_in_time) {
        throw new BadRequestException(
          'Check-out time must be after check-in time',
        );
      }

      attendance.check_out_time = new Date(dto.check_out_time);
      attendance.check_out_photo = dto.check_out_photo;

      const saved = await this.repo.save(attendance);

      return mappingResponse({
        message: 'Check-out successful',
        extras: {
          data: {
            ...saved,
            check_in_photo: toPhotoUrl(saved?.check_in_photo),
            check_out_photo: toPhotoUrl(saved?.check_out_photo),
          },
        },
      });
    } catch (error) {
      errorHandler(error);
    }
  }

  async update(id: string, dto: UpdateAttendanceDto) {
    try {
      const attendance = await this.repo.preload({
        id,
        ...dto,
        ...(dto.check_in_time && {
          check_in_time: new Date(dto.check_in_time),
        }),
        ...(dto.check_out_time && {
          check_out_time: new Date(dto.check_out_time),
        }),
      });

      if (!attendance)
        throw new NotFoundException(`Attendance with id ${id} not found`);

      if (
        attendance.check_out_time &&
        attendance.check_in_time >= attendance.check_out_time
      ) {
        throw new BadRequestException(
          'Check-out time must be after check-in time',
        );
      }

      const saved = await this.repo.save(attendance);

      return mappingResponse({
        message: 'Attendance updated successfully',
        extras: {
          data: {
            ...saved,
            check_in_photo: toPhotoUrl(saved?.check_in_photo),
            check_out_photo: toPhotoUrl(saved?.check_out_photo),
          },
        },
      });
    } catch (error) {
      errorHandler(error);
    }
  }

  async findById(id: string, withDeleted?: boolean) {
    try {
      const attendance = await this.repo.findOne({
        where: { id },
        withDeleted,
        relations: ['user', 'user.department', 'user.role'],
      });

      if (!attendance)
        throw new NotFoundException(`Attendance with id ${id} not found`);

      const { user, ...attendanceData } = attendance;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;

      return mappingResponse({
        message: 'Attendance found successfully',
        extras: {
          data: {
            ...attendanceData,
            check_in_photo: toPhotoUrl(attendanceData?.check_in_photo),
            check_out_photo: toPhotoUrl(attendanceData?.check_out_photo),
            user: {
              ...userWithoutPassword,
              image_url: toPhotoUrl(userWithoutPassword?.image_url),
            },
          },
        },
      });
    } catch (error) {
      errorHandler(error);
    }
  }

  async findAll(dto: GetAttendancesDto) {
    const {
      limit = 10,
      page = 1,
      user_id,
      department_id,
      start_date,
      end_date,
      sort_by = 'updated_at',
      sort_order = 'desc',
      with_deleted,
    } = dto;

    const skip = (page - 1) * limit;
    const isPaginated = limit !== -1;

    const where: any = {};

    if (!with_deleted) {
      where.deleted_at = IsNull();
    }

    if (user_id) {
      where.user_id = user_id;
    }

    if (department_id) {
      where.user = { department_id };
    }

    if (start_date && end_date) {
      where.check_in_time = Between(new Date(start_date), new Date(end_date));
    } else if (start_date) {
      where.check_in_time = MoreThanOrEqual(new Date(start_date));
    } else if (end_date) {
      where.check_in_time = LessThanOrEqual(new Date(end_date));
    }

    try {
      const [data, total] = await this.repo.findAndCount({
        where,
        order: { [sort_by]: sort_order },
        relations: ['user', 'user.department', 'user.role'],
        withDeleted: with_deleted,
        ...(isPaginated && { take: limit, skip }),
      });

      const mappedData = data.map((attendance) => {
        const { user, ...attendanceData } = attendance;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;
        return {
          ...attendanceData,
          check_in_photo: toPhotoUrl(attendanceData?.check_in_photo),
          check_out_photo: toPhotoUrl(attendanceData?.check_out_photo),
          user: {
            ...userWithoutPassword,
            image_url: toPhotoUrl(userWithoutPassword?.image_url),
          },
        };
      });

      return mappingResponse({
        message: 'Attendances found successfully',
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

  async delete(id: string) {
    try {
      const attendance = await this.repo.findOne({
        where: { id, deleted_at: IsNull() },
      });

      if (!attendance)
        throw new NotFoundException(`Attendance with id ${id} not found`);

      await this.repo.softRemove(attendance);

      return mappingResponse({ message: 'Attendance deleted successfully' });
    } catch (error) {
      errorHandler(error);
    }
  }
}
