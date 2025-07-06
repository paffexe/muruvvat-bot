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
import { Sabrlilar } from "./sabrlilar/model/sabrlilar.model";
import { SabrlilarService } from "./sabrlilar/sabrlilar.service";
import { SabrlilarUpdate } from "./sabrlilar/sabrlilar.update";

@Module({
  imports: [SequelizeModule.forFeature([Bot, Library, Sabrlilar])],
  controllers: [],
  providers: [
    BotService,
    LibraryService,
    LibraryUpdate,
    SabrlilarService,
    SabrlilarUpdate,
    BotUpdate,
    {
      provide: BOT_NAME,
      useFactory: () => new Telegraf(process.env.BOT_TOKEN!), // yoki sozlangan bot
    },
  ],
})
export class BotModule {}
