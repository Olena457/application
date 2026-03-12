import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { registerSchema, loginSchema } from './schemas/auth.schema';
import { YupValidationPipe } from '../common/pipes/yup-validation.pipe';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @UsePipes(new YupValidationPipe(registerSchema))
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @UsePipes(new YupValidationPipe(loginSchema))
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
