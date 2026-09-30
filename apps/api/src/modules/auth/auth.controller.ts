import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Learner Login: POST /auth/login
   */
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  /**
   * Learner Signup: POST /auth/signup
   */
  @Post('signup')
  signup(@Body() body: { name: string; email: string; password: string; programIds?: string[] }) {
    return this.authService.signup(body);
  }

  /**
   * Admin Login: POST /auth/admin-login
   * Only ADMIN / SUPER_ADMIN / MANAGER roles can use this.
   */
  @Post('admin-login')
  adminLogin(@Body() body: { email: string; password: string }) {
    return this.authService.adminLogin(body.email, body.password);
  }

  /**
   * Refresh Token: POST /auth/refresh
   */
  @Post('refresh')
  refreshToken(@Body() body: { refresh_token: string }) {
    return this.authService.refreshToken(body.refresh_token);
  }

  /**
   * Get current user profile (requires valid JWT): GET /auth/me
   * Returns user info + enrolled programs for tenant separation.
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.sub);
  }
}
