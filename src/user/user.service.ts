import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from 'src/room/schema/room.shema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) { }

  async register(firstName: string, lastName: string, phone: string, roomId: string): Promise<UserDocument> {
    const room = await this.roomModel.findById(roomId).exec();
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    if (room.users.length >= room.limit) {
      throw new BadRequestException('Room is full');
    }

    const newUser = new this.userModel({ firstName, lastName, phone, room: roomId });
    await newUser.save();

    room.users.push(newUser);
    await room.save();

    return newUser;
  }

  async getUsers(): Promise<UserDocument[]> {
    return this.userModel.find().populate('room', 'name limit').exec();
  }

  async getAvailableSeats(roomId: string): Promise<number> {
    const room = await this.roomModel.findById(roomId).exec();
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room.limit - room.users.length;
  }

  async getRegisteredCount(roomId: string): Promise<number> {
    const room = await this.roomModel.findById(roomId).exec();
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room.users.length;
  }
}
