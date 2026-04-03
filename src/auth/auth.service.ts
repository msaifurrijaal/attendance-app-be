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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
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

    return {
      message: 'User registered successfully',
      user: savedUser,
    };
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
      role: user.role.name,
    };

    const tokens = await this.generateTokens(payload);

    return {
      ...tokens,
    };
  }

  async me(payload: UserJwtPayload) {
    const user = await this.userRepo.findOne({
      where: { id: payload.id },
      relations: { role: true, department: true },
    });

    if (!user) throw new UnauthorizedException('User not found');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...restData } = user;

    return {
      user: restData,
    };
  }
}
