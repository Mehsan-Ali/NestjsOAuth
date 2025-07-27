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
import { RefereshToken } from './schemas/referesh-token.schema'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class AuthService {
  constructor (
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtSecret: JwtService,
    @InjectModel(RefereshToken.name)
    private refereshTokenModel: Model<RefereshToken>,
  ) {}

  // signup
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

  // login
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
    const { password: hashedPassword, ...userDta } = user.toObject()
    const tokens = await this.generateJWT(userDta._id)
    return { ...userDta, ...tokens }
  }
  // refersh token

  async refereshToken (refreshToken: string) {
    const token = await this.refereshTokenModel.findOne({
      token: refreshToken,
      expiryDate: { $gt: new Date() },
    })
    if (!token) {
      throw new UnauthorizedException('Invalid refresh token')
    }
    if (token.expiryDate < new Date()) {
      throw new UnauthorizedException('Token expired')
    }
    return this.generateJWT(token.userId)
  }

  // generate JWT Token
  async generateJWT (userId) {
    const accessToken = await this.jwtSecret.sign(
      { userId },
      { expiresIn: '1h' },
    )
    const refereshToken = uuidv4()
    await this.storeRefereshToken(userId, refereshToken)
    return { accessToken, refereshToken }
  }

  //store refersh token
  async storeRefereshToken (userId, refereshToken) {
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 3)
    const token = await this.refereshTokenModel.updateOne(
      { userId },
      { $set: { expiryDate, token: refereshToken } },
      { upsert: true },
    )
    return token
  }
}
