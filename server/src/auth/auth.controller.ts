import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //Post: Signup
  @Post('signup')
  async signUp(@Body() body: SignupDto) {
    return this.authService.signup(body)
  }

  //Post: Login
  @Post('login')
  async loginUser(@Body() credentials: LoginDto) {
    return this.authService.loginUser(credentials)
  }
  //Post: Referesh Token
}