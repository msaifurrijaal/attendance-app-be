import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserJwtPayload } from './types/auth.type';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserJwtPayload => {
    const request = ctx.switchToHttp().getRequest<{ user: UserJwtPayload }>();
    return request.user;
  },
);

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  role_id: string;

  @ApiProperty()
  @IsNotEmpty()
  department_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  position?: string;
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
