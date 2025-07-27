import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { SignupDto } from './dtos/signup.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './schemas/user.schema'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dtos/login.dto'
import { JwtService } from '@nestjs/jwt'
@Injectable()
export class AuthService {
  constructor (
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtSecret: JwtService,
  ) {}
  async signup (signupData: SignupDto) {
    const { name, email, password } = signupData
    const existEmail = await this.userModel.findOne({ email })
    if (existEmail) {
      throw new BadRequestException('Email already exist')
    }
    const hashedPassword = await bcrypt.hashSync(password, 10)

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    })
    return user
  }

  async loginUser (credentials: LoginDto) {
    const { email, password } = credentials
    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw new UnauthorizedException('User not found')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials')
    }
    this
    const { password: hashedPassword, ...userDta } = user.toObject()
    return this.generateJWT(userDta._id)
  }
  // generate JWT Token
  async generateJWT (userId) {
    const accessToken = await this.jwtSecret.sign(
      { userId },
      { expiresIn: '1h' },
    )
    return { accessToken }
  }
}
