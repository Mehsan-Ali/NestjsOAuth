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
@Injectable()
export class AuthService {
  constructor (@InjectModel(User.name) private userModel: Model<User>) {}
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
    return { message: 'Login successful', user }
  }
}
