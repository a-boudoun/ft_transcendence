import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { OAuthGuard } from './guards/42.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Get('42')
  @UseGuards(OAuthGuard)
  handleAuth() {
  }

  @Get('42/redirect')
  @UseGuards(OAuthGuard)
  async AuthCallback(@Req() req, @Res({ passthrough: true }) res) {
    const token = await this.authService.login(req.user); 

    res.cookie('access_token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'strict',
      path: '/'
  });

    res.redirect('http://localhost:3000/home');
  }

  @Get('isAuth')
  @UseGuards(JwtAuthGuard)
  protectedResource(@Req() req) { 
    return (req.user);
  }

}