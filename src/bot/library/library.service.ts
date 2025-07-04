import { Injectable } from "@nestjs/common";
import { BOT_NAME } from "../../app.constants";
import { Context, Markup, Telegraf } from "telegraf";
import { InjectBot } from "nestjs-telegraf";
import { InjectModel } from "@nestjs/sequelize";
import { Bot } from "../model/bot.entity";
import { Library } from "./model/library.model";

@Injectable()
export class LibraryService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Library) private readonly libraryModel: typeof Library,

    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) {}

  async onRoleSahiy(ctx: Context) {
    try {
      await ctx.replyWithHTML("Siz sahiy bo'lib ro'yxatdan o'tmoqchimisiz?", {
        ...Markup.keyboard([["Ha, to'g'ri", "Yo'q, noto'g'ri"]]).resize(),
      });
    } catch (error) {
      console.log(`Error in role:`, error);
    }
  }

  async onSahiy(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);

      if (!user) {
        await ctx.replyWithHTML(`Iltimos, <b>/start</b> tugmasini bosing`, {
          ...Markup.keyboard([["/start"]]).resize(),
        });
      } else {
        await this.libraryModel.create({
          user_id: user_id!,
          last_state: "name",
        });

        await ctx.replyWithHTML("Ismingizni kiriting:", {
          ...Markup.removeKeyboard(),
        });
      }
    } catch (error) {
      console.log(`Error in sahiy:`, error);
    }
  }

 

  async addNewLibrary(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);

      if (!user) {
        await ctx.replyWithHTML(`Iltimos, <b>/start</b> tugmasini bosing`, {
          ...Markup.keyboard([["/start"]]).resize(),
        });
      } else {
        await this.libraryModel.create({
          user_id: user_id!,
          last_state: "name",
        });

        await ctx.replyWithHTML("Yangi kutubxona nomini kiriting:", {
          ...Markup.removeKeyboard(),
        });
      }
    } catch (error) {
      console.log(`Error on library:`, error);
    }
  }
}
