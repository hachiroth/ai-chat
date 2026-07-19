import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClsService } from "nestjs-cls";
import { FindOptionsWhere, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { UserCreateDto } from "./user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly clsService: ClsService,
  ) {}

  findAll(): Promise<User[]> {
    const _userId = this.clsService.get("user.id");
    console.log("get user id from cls", _userId);
    return this.userRepository.find();
  }

  create(body: UserCreateDto | UserCreateDto[]) {
    const _create = (dto: UserCreateDto) => this.userRepository.create(dto);
    const users = Array.isArray(body) ? body.map(_create) : [_create(body)];
    return this.userRepository.insert(users);
  }

  findOne(where: FindOptionsWhere<User>) {
    return this.userRepository.findOneBy(where);
  }
}
