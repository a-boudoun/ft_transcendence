import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { OAuthGuard } from './guards/42.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


interface Profile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}


@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Get('42')
  @UseGuards(OAuthGuard)
  handleAuth() {
  }

  @Get('42/redirect')
  @UseGuards(OAuthGuard)
  async googleAuthCallback(@Req() req, @Res({ passthrough: true }) res) {
    const token = await this.authService.login(req.user);

    console.log('token: ', token);  

    res.cookie('access_token', token, {
      maxAge: 3600,
      sameSite: true,
      secure: false,
      httponly: true,
    }); 

    res.redirect('http://localhost:3000/home');
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  protectedResource() {
    return 'JWT is working!';
  }

}