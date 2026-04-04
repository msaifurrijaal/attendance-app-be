import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { UserJwtPayload } from './types/auth.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { mappingResponse } from 'src/utils/responseHandler.util';
import { errorHandler } from 'src/utils/errorHandler.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const existing = await this.userRepo.findOne({
        where: { email: dto.email },
      });

      if (existing) {
        throw new BadRequestException('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = this.userRepo.create({
        ...dto,
        email: dto.email.toLowerCase().trim(),
        password: hashedPassword,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...savedUser } = await this.userRepo.save(user);

      return mappingResponse({
        message: 'User registered successfully',
        extras: {
          user: {
            ...savedUser,
            image_url: savedUser.image_url
              ? `${this.configService.get('APP_URL')}${savedUser.image_url}`
              : null,
          },
        },
      });
    } catch (error) {
      errorHandler(error);
    }
  }

  async generateTokens(user: UserJwtPayload) {
    const accessToken = await this.jwtService.signAsync(user);
    const refreshToken = await this.jwtService.signAsync(user, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });

    return { accessToken, refreshToken };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      relations: { role: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload: UserJwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role.code,
    };

    const tokens = await this.generateTokens(payload);

    return mappingResponse({
      message: 'User logged in successfully',
      extras: { ...tokens },
    });
  }

  async me(payload: UserJwtPayload) {
    const user = await this.userRepo.findOne({
      where: { id: payload.id },
      relations: { role: true, department: true },
    });

    if (!user) throw new UnauthorizedException('User not found');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...restData } = user;

    return mappingResponse({
      message: 'User found successfully',
      extras: {
        user: {
          ...restData,
          image_url: restData.image_url
            ? `${this.configService.get('APP_URL')}${restData.image_url}`
            : null,
        },
      },
    });
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepo.findOne({
        where: { id: payload.id },
        relations: { role: true },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = {
        id: user.id,
        email: user.email,
        role: user.role.code,
      };

      const tokens = await this.generateTokens(newPayload);

      return mappingResponse({
        message: 'Token refreshed successfully',
        extras: { ...tokens },
      });
    } catch (error) {
      errorHandler(error);
    }
  }
}
