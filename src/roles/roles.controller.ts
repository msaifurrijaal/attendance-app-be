import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GetRolesDto } from './roles.dto';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Get('admin-hr')
  @ApiOperation({ summary: 'Get Admin HR role without auth' })
  getRoleAdminHr() {
    return this.rolesService.getRoleAdminHr();
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() dto: GetRolesDto) {
    return this.rolesService.findAll(dto);
  }
}