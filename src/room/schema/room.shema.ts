import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

export type RoomDocument = Room & {
  reservedSeats: string,
  remainingSeats: string,
};

@Schema({ timestamps: true })
export class Room {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  limit: number;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  users: User[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
