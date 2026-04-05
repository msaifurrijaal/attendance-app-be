import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AttendancesService } from './attendances.service';
import type { UserJwtPayload } from 'src/auth/types/auth.type';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import {
  CheckInDto,
  CheckOutDto,
  GetAttendancesDto,
  UpdateAttendanceDto,
} from './attendances.dto';
import { CurrentUser } from 'src/auth/auth.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('attendances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Get(':id')
  findById(
    @Param('id') id: string,
    @Query('with_deleted', new DefaultValuePipe(false), ParseBoolPipe)
    withDeleted: boolean,
  ) {
    return this.attendancesService.findById(id, withDeleted);
  }

  @Get()
  findAll(@Query() dto: GetAttendancesDto) {
    return this.attendancesService.findAll(dto);
  }

  @Post('check-in')
  checkIn(@Body() dto: CheckInDto, @CurrentUser() user: UserJwtPayload) {
    return this.attendancesService.checkIn(dto, user);
  }

  @Post('check-out')
  checkOut(@Body() dto: CheckOutDto, @CurrentUser() user: UserJwtPayload) {
    return this.attendancesService.checkOut(dto, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAttendanceDto) {
    return this.attendancesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN_HR')
  delete(@Param('id') id: string) {
    return this.attendancesService.delete(id);
  }
}
