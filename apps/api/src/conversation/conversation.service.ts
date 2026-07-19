import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClsService } from "nestjs-cls";
import { Conversation } from "src/entities/conversation.entity";
import { Repository } from "typeorm";
import { ConvsersationCreateDto } from "./conversation.dto";

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    private readonly clsService: ClsService,
  ) {}

  /**
   * Generate a title via timestamp.
   */
  private generateRandomTitle(): string {
    return `Conversation ${Date.now()}`;
  }

  async create(body?: ConvsersationCreateDto | ConvsersationCreateDto[]) {
    const _create = (item?: ConvsersationCreateDto) =>
      this.conversationRepository.create({
        title: item?.title ?? this.generateRandomTitle(),
        user: this.clsService.get("user"),
      });

    const conversations = Array.isArray(body)
      ? body.map(_create)
      : [_create(body)];

    return await this.conversationRepository.insert<{
      identifiers: { id: string }[];
    }>(conversations);
  }

  findAll() {
    return this.conversationRepository.find();
  }
}
