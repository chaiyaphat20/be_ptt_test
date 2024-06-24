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
    const rooms = await this.roomModel.find().populate({
      path: 'users',
      select: 'firstName lastName phone -_id', // เลือกเฉพาะฟิลด์ firstName, lastName, phone และยกเว้น _id
    }).exec();

    // ประกาศตัวแปรเก็บข้อมูลที่นั่งทั้งหมดของแต่ละห้อง
    const roomsWithCounts = await Promise.all(rooms.map(async (room: RoomDocument) => {
      const reservedSeats = room.users.length; // จำนวนที่นั่งที่มีผู้ใช้จองแล้ว
      const remainingSeats = room.limit - reservedSeats; // จำนวนที่นั่งคงเหลือ

      // สร้าง object ใหม่ที่มีข้อมูลเพิ่มเติมเกี่ยวกับจำนวนที่นั่ง
      const roomWithCounts = {
        _id: room._id,
        name: room.name,
        limit: room.limit,
        users: room.users,
        reservedSeats: reservedSeats,
        remainingSeats: remainingSeats,
      };

      return roomWithCounts;
    }));

    return roomsWithCounts;
  }


  async getRoomById(roomId: string, search?: string, sortBy?: string): Promise<RoomDocument> {
    const sortOptions = this.getSortOptions(sortBy);
    console.log('Sort Options:', sortOptions);

    const room = await this.roomModel.findById(roomId).populate({
      path: 'users',
      select: 'firstName lastName phone createdAt -_id',
      match: search ? {
        $or: [
          { firstName: new RegExp(search, 'i') },
          { lastName: new RegExp(search, 'i') },
        ],
      } : {},
      options: { sort: sortOptions },
    }).exec();

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const reservedSeats = room.users.length;
    const remainingSeats = room.limit - reservedSeats;

    return {
      _id: room._id,
      name: room.name,
      limit: room.limit,
      users: room.users,
      reservedSeats: "" + reservedSeats,
      remainingSeats: "" + remainingSeats,
    };
  }

  getSortOptions(sortBy: string) {
    switch (sortBy) {
      case 'firstNameAsc':
        return { 'firstName': 1 };
      case 'firstNameDesc':
        return { 'firstName': -1 };
      case 'lastNameAsc':
        return { 'lastName': 1 };
      case 'lastNameDesc':
        return { 'lastName': -1 };
      case 'createdDateAsc':
        return { 'createdAt': 1 };
      case 'createdDateDesc':
        return { 'createdAt': -1 };
      default:
        return {};
    }
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