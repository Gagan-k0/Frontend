import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { IsString, IsEmail, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class LoginDto {
  @IsEmail() @IsNotEmpty() email: string;
  @IsString() @IsNotEmpty() password: string;
}

export class SignupDto {
  @IsString() @IsNotEmpty() name: string;
  @IsEmail() @IsNotEmpty() email: string;
  @IsString() @IsNotEmpty() password: string;
  @IsOptional() @IsArray() @IsString({ each: true }) programIds?: string[];
}

export class RefreshDto {
  @IsString() @IsNotEmpty() refresh_token: string;
}

@Controller('auth')
@Throttle({ auth: { limit: 5, ttl: 60000 } })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Learner Login: POST /auth/login
   */
  @Public()
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  /**
   * Learner Signup: POST /auth/signup
   */
  @Public()
  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  /**
   * Admin Login: POST /auth/admin-login
   * Only ADMIN / SUPER_ADMIN / MANAGER roles can use this.
   */
  @Public()
  @Post('admin-login')
  adminLogin(@Body() body: LoginDto) {
    return this.authService.adminLogin(body.email, body.password);
  }

  /**
   * Refresh Token: POST /auth/refresh
   */
  @Public()
  @Post('refresh')
  refreshToken(@Body() body: RefreshDto) {
    return this.authService.refreshToken(body.refresh_token);
  }

  /**
   * Get current user profile (requires valid JWT): GET /auth/me
   * Returns user info + enrolled programs for tenant separation.
   */
  @Get('me')
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.sub);
  }

  /**
   * Check session status: GET /auth/session
   */
  @Get('session')
  checkSession(@Request() req: any) {
    return this.authService.checkSession(req.user.sessionId);
  }

  /**
   * Logout all sessions
   */
  @Post('logout-all')
  logoutAll(@Request() req: any) {
    return this.authService.logoutAll(req.user.sub);
  }
}
