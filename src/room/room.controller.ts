import { Controller, Post, Get, Body, Patch, Param, Query } from '@nestjs/common';
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
  async getRooms(
  ): Promise<Room[]> {
    return this.roomService.getRooms();
  }


  @Get(':id')
  async getRoomById(
    @Param('id') id: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
  ): Promise<Room> {
    return this.roomService.getRoomById(id, search, sortBy);
  }

  @Patch('limit/:roomId')
  async setRoomLimit(@Param('roomId') roomId: string, @Body('newLimit') newLimit: number): Promise<Room> {
    return this.roomService.setRoomLimit(roomId, newLimit);
  }
}
