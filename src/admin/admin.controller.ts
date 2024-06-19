import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Post('register')
  async registerAdmin(
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.adminService.registerAdmin(firstName, lastName, email, password);
  }

  @Post('login')
  async loginAdmin(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.adminService.validateAdmin(email, password);
  }
}
