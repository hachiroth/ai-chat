import { Body, Controller, Get, Post } from "@nestjs/common";
import { ConvsersationCreateDto } from "./conversation.dto";
import { ConversationService } from "./conversation.service";

@Controller("conversation")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post("create")
  async create(
    @Body() body?: ConvsersationCreateDto | ConvsersationCreateDto[],
  ) {
    const result = await this.conversationService.create(body);
    return {
      message: "Created successfully",
      affectedRows: result.generatedMaps.length,
      ids: result.identifiers,
    };
  }

  @Get()
  async findAll() {
    return await this.conversationService.findAll();
  }
}
