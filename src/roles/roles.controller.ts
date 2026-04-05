import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GetRolesDto } from './roles.dto';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Get()
  findAll(@Query() dto: GetRolesDto) {
    return this.rolesService.findAll(dto);
  }
}