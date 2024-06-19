import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './schema/room.shema';
import { User, UserDocument } from 'src/user/schema/user.schema';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async createRoom(name: string, limit: number): Promise<Room> {
    const newRoom = new this.roomModel({ name, limit });
    return newRoom.save();
  }

  async getRooms(): Promise<Room[]> {
    return this.roomModel.find().exec();
  }

  async setRoomLimit(roomId: string, newLimit: number): Promise<Room> {
    const room = await this.roomModel.findById(roomId).populate('users').exec();
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    room.limit = newLimit;
    await room.save();

    if (room.users.length > newLimit) {
      const usersToRemove = room.users.slice(newLimit); // get users to remove
      room.users = room.users.slice(0, newLimit); // keep only the first 'newLimit' users
      await room.save();

      // Remove the excess users from the user collection
      const userIdsToRemove = usersToRemove.map(user => user._id);
      await this.userModel.deleteMany({ _id: { $in: userIdsToRemove } }).exec();
    }

    return room;
  }
}