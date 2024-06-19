import { Injectable } from '@nestjs/common';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private registrationModel: Model<User>
  ) { }

  async register(firstName: string, lastName: string, phone: string): Promise<User> {
    // const registeredUsers = await this.registrationModel.find().exec();
    // if (registeredUsers.length >= this.totalSeats) {
    //   throw new Error('No seats available');
    // }
    const newRegistration = new this.registrationModel({ firstName, lastName, phone, });
    return newRegistration.save();
  }
}
