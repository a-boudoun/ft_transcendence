import { Controller, Get, Patch, Delete, Req, Res, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Jwt2faAuthGuard } from './guards/jwt-2fa-auth.guard';
import { JwtSigninGuard } from './guards/jwt-signin.guard';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDTO } from 'src/users/dto/update-user.dto';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Get('42')  
  @UseGuards(AuthGuard('42'))
  AuthCallback(@Req() req, @Res({ passthrough: true }) res) {
    return this.authService.login(req.user, res, false);
  }

  @Get('google')  
  @UseGuards(AuthGuard('google'))
  GoogleAuthCallback(@Req() req, @Res({ passthrough: true }) res) {
    return this.authService.login(req.user, res, false);
  }

  @Patch('singin')
  @UseGuards(JwtSigninGuard)
  signin(@Req() req, @Res({ passthrough: true }) res, @Body() body:  UpdateUserDTO) {
    return this.authService.signin(req.user, res, body);
  }  

  @Delete('logout')
  @UseGuards(Jwt2faAuthGuard)
  logout(@Req() req, @Res({ passthrough: true }) res) {
    this.authService.logout(req.user.id, res);
  }

  @Get('2fa/generate')
  @UseGuards(Jwt2faAuthGuard)
  async generate2FAsecret(@Req() req) {
    const { otpauthUrl } = await this.authService.generate2FAsecret(req.user.id);

    return this.authService.generateQR(otpauthUrl);
  }

  @Patch('2fa/turnOn')
  @UseGuards(Jwt2faAuthGuard)
  async turnOn(@Req() req,  @Res({ passthrough: true }) res, @Body() {code} : {code: string}) {
      return await this.authService.turnOn2FA(req.user.id, code, res);
  }

  @Patch('2fa/login')
  @UseGuards(JwtAuthGuard)
  async login2FA(@Req() req, @Body() {code} : {code: string}, @Res({ passthrough: true }) res) {
    try {
      await this.authService.validate2FA(code, req.user.id);
    }
    catch (e) {
      if (e instanceof Error)
      return {valid: false, message: e.message};
    }
      await this.authService.confirm2FA(req.user.id, res);
      return {valid: true, message: 'Valid 2FA code'};
  }

}
