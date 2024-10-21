import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  async signup(
    @Body() body: { email: string; name: string },
  ) {
    try {
      const user = await this.usersService.createUser(
        body.email,
        body.name,
      );
      return {
        status: true,
        message: 'User created successfully with the password name@123',
        data: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      console.log("error:", error);
      if (error.code === 11000) {
        throw new HttpException(
          {
            status: false,
            message: 'Email already exists',
          },
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        {
          status: false,
          message: 'Error creating user',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.authService.validateUser(
        body.email,
        body.password,
      );
      if (!user) {
        throw new HttpException(
          {
            status: false,
            message: 'Invalid credentials',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      const token = await this.authService.login(user);
      return {
        status: true,
        message: 'Login successful',
        data: token,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: false,
          message: 'Error during login',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
