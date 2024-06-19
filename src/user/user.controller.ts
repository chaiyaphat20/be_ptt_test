import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  async register(
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('phone') phone: string,
    @Body('roomId') roomId: string,
  ): Promise<User> {
    return this.userService.register(firstName, lastName, phone, roomId);
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get('available-seats/:roomId')
  async getAvailableSeats(@Param('roomId') roomId: string): Promise<{ availableSeats: number }> {
    const availableSeats = await this.userService.getAvailableSeats(roomId);
    return { availableSeats };
  }

  @Get('registered-count/:roomId')
  async getRegisteredCount(@Param('roomId') roomId: string): Promise<{ registeredCount: number }> {
    const registeredCount = await this.userService.getRegisteredCount(roomId);
    return { registeredCount };
  }
}
