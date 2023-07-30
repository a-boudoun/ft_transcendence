import { Controller, Get, Patch, Req, Res, Body, UseGuards } from '@nestjs/common';
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

  @Get('2fa/generate')
  @UseGuards(JwtAuthGuard)
  async generate2FAsecret(@Req() req) {
    const { otpauthUrl } = await this.authService.generate2FAsecret(req.user.username);

    return this.authService.generateQR(otpauthUrl);
  }

  @Patch('2fa/turnOn')
  @UseGuards(JwtAuthGuard)
  async turnOn(@Req() req, @Body() {code} : {code: string}) {

    try {
      await this.authService.validate2FA(code, req.user.username);
    }
    catch (e) {
      if (e instanceof Error)
        return {valid: false, message: e.message};
    }

    return {valid: true, message: 'Valid 2FA code'};
  }


}
