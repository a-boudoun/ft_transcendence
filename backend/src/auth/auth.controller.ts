import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { OAuthGuard } from './guards/42.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Get('42')
  @UseGuards(OAuthGuard)
  async Auth(@Req() req) {
  }

  @Get('redirect')  
  @UseGuards(OAuthGuard)
  async AuthCallback(@Req() req, @Res({ passthrough: true }) res) {
    return this.authService.login(req.user, res);
  }

  @Get('isAuth')
  @UseGuards(JwtAuthGuard)
  protectedResource(@Req() req) { 
    return (req.user);
  }

}
