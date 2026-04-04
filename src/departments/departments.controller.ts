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
import { DepartmentsService } from './departments.service';
import {
  CreateDepartmentDto,
  GetDepartmentsDto,
  UpdateDepartmentDto,
} from './departments.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @Roles('ADMIN_HR')
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  @Roles('ADMIN_HR')
  findAll(@Query() dto: GetDepartmentsDto) {
    return this.departmentsService.findAll(dto);
  }

  @Get(':id')
  @Roles('ADMIN_HR')
  findOne(
    @Param('id') id: string,
    @Query('with_deleted', new DefaultValuePipe(false), ParseBoolPipe)
    withDeleted: boolean,
  ) {
    return this.departmentsService.findById(id, withDeleted);
  }

  @Patch(':id')
  @Roles('ADMIN_HR')
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @Roles('ADMIN_HR')
  remove(@Param('id') id: string) {
    return this.departmentsService.delete(id);
  }
}
