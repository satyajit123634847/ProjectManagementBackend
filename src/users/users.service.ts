import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModel } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: UserModel,
    private jwtService: JwtService,
  ) {}

  // Create a new user
  async createUser(
    email: string,
    name: string,
  ): Promise<UserDocument> {
    try {
      const formattedPassword = `${name}@123`; // Enforcing password format

      const newUser = new this.userModel({ email, password: formattedPassword, name });
      return await newUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException('Error creating user');
    }
  }

  // Find a user by email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Find a user by ID
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  // Validate user login
  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.findByEmail(email);

    if (user && (await user.comparePassword(password))) {
      return user;
    }
    return null;
  }

  // Generate JWT for authenticated user
  async generateJWT(user: UserDocument): Promise<string> {
    const payload = { email: user.email, sub: user._id };
    return this.jwtService.sign(payload);
  }

  async getAllUsers(): Promise<{
    status: boolean;
    message: string;
    data: UserDocument[];
  }> {
    try {
      const users = await this.userModel.find({ status: true }).exec();
      return {
        status: true,
        message: 'Users retrieved successfully',
        data: users,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving users');
    }
  }

  async updateUser(
    id: string,
    updateData: Partial<{ email: string; name: string; password: string }>,
  ): Promise<{ status: boolean; message: string; data: UserDocument }> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();
      if (!updatedUser) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return {
        status: true,
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async softDeleteUser(
    id: string,
  ): Promise<{ status: boolean; message: string; data: UserDocument }> {
    try {
      const deletedUser = await this.userModel
        .findByIdAndUpdate(id, { status: false }, { new: true })
        .exec();
      if (!deletedUser) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return {
        status: true,
        message: 'User deleted successfully',
        data: deletedUser,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting user');
    }
  }
}
