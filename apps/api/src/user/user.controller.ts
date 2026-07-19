import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserCreateDto } from "./user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post("/create")
  async create(@Body() body: UserCreateDto | UserCreateDto[]) {
    const result = await this.userService.create(body);
    return {
      affectedRows: result.generatedMaps.length,
      message: "Created successfully",
    };
  }
}
