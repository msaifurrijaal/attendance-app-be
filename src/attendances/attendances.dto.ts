import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CheckInDto {
  @ApiProperty({ example: '2026-04-03T10:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  check_in_time: string;

  @ApiProperty({ example: 'url-image' })
  @IsNotEmpty()
  @IsString()
  check_in_photo: string;
}

export class CheckOutDto {
  @ApiProperty({ example: '2026-04-03T17:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  check_out_time: string;

  @ApiProperty({ example: 'url-image' })
  @IsNotEmpty()
  @IsString()
  check_out_photo: string;
}

export class UpdateAttendanceDto {
  @ApiPropertyOptional({ example: '2026-04-03T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  check_in_time?: string;

  @ApiPropertyOptional({ example: '2026-04-03T17:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  check_out_time?: string;

  @ApiPropertyOptional({
    example: 'url-image',
  })
  @IsOptional()
  @IsString()
  check_in_photo?: string;

  @ApiPropertyOptional({
    example: 'url-image',
  })
  @IsOptional()
  @IsString()
  check_out_photo?: string;
}

export class GetAttendancesDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ example: 'uuid-user-id' })
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @ApiPropertyOptional({ example: 'uuid-department-id' })
  @IsOptional()
  @IsUUID()
  department_id?: string;

  @ApiPropertyOptional({ example: '2026-04-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ example: '2026-04-30T23:59:59.999Z' })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
    return value;
  })
  @IsBoolean()
  with_deleted?: boolean;

  @ApiPropertyOptional({ example: 'updated_at' })
  @IsOptional()
  @IsString()
  sort_by?: string;

  @ApiPropertyOptional({ example: 'desc' })
  @IsOptional()
  @IsString()
  sort_order?: string;
}
