import { Injectable } from "@nestjs/common";
import { BOT_NAME } from "../../app.constants";
import { Context, Markup, Telegraf } from "telegraf";
import { InjectBot } from "nestjs-telegraf";
import { InjectModel } from "@nestjs/sequelize";
import { Bot } from "../model/bot.entity";
import { Sabrlilar } from "./model/sabrlilar.model";

@Injectable()
export class SabrlilarService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Sabrlilar) private readonly sabrlilarModel: typeof Sabrlilar,

    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) {}

  async onRoleSabrli(ctx: Context) {
    try {
      await ctx.replyWithHTML("Siz sabrli bo'lib ro'yxatdan o'tmoqchimisiz?", {
        ...Markup.keyboard([["Ha, to'g'ri", "Yo'q, noto'g'ri"]]).resize(),
      });
    } catch (error) {
      console.log(`Error in role:`, error);
    }
  }

  async onSabrli(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);

      if (!user) {
        await ctx.replyWithHTML(`Iltimos, <b>/start</b> tugmasini bosing`, {
          ...Markup.keyboard([["/start"]]).resize(),
        });
      } else {
        await this.sabrlilarModel.create({
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
}
