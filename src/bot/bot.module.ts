import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { BotUpdate } from "./bot.update";
import { Telegraf } from "telegraf";
import { BOT_NAME } from "../app.constants";
import { Bot } from "./model/bot.entity";
import { SequelizeModule } from "@nestjs/sequelize";
import { Library } from "./library/model/library.model";
import { LibraryService } from "./library/library.service";
import { LibraryUpdate } from "./library/library.update";

@Module({
  imports: [SequelizeModule.forFeature([Bot, Library])],
  controllers: [],
  providers: [
    BotService,
    LibraryService,
    LibraryUpdate,
    BotUpdate,
    {
      provide: BOT_NAME,
      useFactory: () => new Telegraf(process.env.BOT_TOKEN!), // yoki sozlangan bot
    },
  ],
})
export class BotModule {}
