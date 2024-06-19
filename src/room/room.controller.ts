import { Controller, Post, Get, Body, Patch, Param } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room, RoomDocument } from './schema/room.shema';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) { }

  @Post('create')
  async createRoom(@Body('name') name: string, @Body('limit') limit: number): Promise<Room> {
    return this.roomService.createRoom(name, limit);
  }

  @Get()
  async getRooms(): Promise<Room[]> {
    return this.roomService.getRooms();
  }

  @Patch('limit/:roomId')
  async setRoomLimit(@Param('roomId') roomId: string, @Body('newLimit') newLimit: number): Promise<Room> {
    return this.roomService.setRoomLimit(roomId, newLimit);
  }
}
