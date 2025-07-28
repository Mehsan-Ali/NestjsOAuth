import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignupDto } from './dtos/signup.dto'
import { LoginDto } from './dtos/login.dto'
import { ReferTokenDto } from './dtos/referesh-token.dto'
import { AuthGuard } from 'src/guards/auth.guard'

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  //Post: Signup
  @Post('signup')
  async signUp (@Body() body: SignupDto) {
    return this.authService.signup(body)
  }

  //Post: Login
  @Post('login')
  async loginUser (@Body() credentials: LoginDto) {
    return this.authService.loginUser(credentials)
  }

  //Post: Referesh Token
  @Post('refresh')
  async refereshToken (@Body() refereshTokenDto: ReferTokenDto) {
    return this.authService.refereshToken(refereshTokenDto.refreshToken)
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getcurrentUser (@Req() req) {
    const userId = req['userId']
    const user = await this.authService.findUserById(userId)
    return user
  }
}
