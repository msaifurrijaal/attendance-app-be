import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseBoolPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GetUsersDto, UpdateUserDto } from './users.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  findAll(@Query() dto: GetUsersDto) {
    return this.usersService.findAll(dto);
  }

  @Get(':id')
  findById(
    @Param('id') id: string,
    @Query('with_deleted', new DefaultValuePipe(false), ParseBoolPipe) withDeleted: boolean,
  ) {
    return this.usersService.findById(id, withDeleted);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN_HR')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN_HR')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
