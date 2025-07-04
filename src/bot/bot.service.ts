import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { InjectBot } from "nestjs-telegraf";
import { BOT_NAME } from "../app.constants";
import { Library } from "./library/model/library.model";
import { Bot } from "./model/bot.entity";
import { Context, Markup, Telegraf } from "telegraf";
import { Op } from "sequelize";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Library) private readonly libraryModel: typeof Library,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) {}

  async start(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user) {
        await this.botModel.create({
          user_id: user_id!,
          username: ctx.from?.username!,
          first_name: ctx.from?.first_name!,
          last_name: ctx.from?.last_name!,
          language_code: ctx.from?.language_code!,
        });
        await ctx.replyWithHTML(
          `Iltimos Akkauntni faollashtirish uchun <b> 📞 Telefon raqamni yuborish </b> tugmasini bosing `,
          {
            ...Markup.keyboard([
              Markup.button.contactRequest("Raqamni yuborish"),
            ]).resize(),
          }
        );
      } else if (!user.status) {
        await ctx.replyWithHTML(
          `Iltimos, Akkauntni faollashtirish uchun <b> 📞Telefon raqamni yuborish</b> tugmasini bosing`,
          {
            ...Markup.keyboard([
              [Markup.button.contactRequest("📞Telefon raqamni yuborish")],
            ]).resize(),
          }
        );
      } else {
        await this.chooseRole(ctx);
      }
    } catch (error) {
      console.log(`Error in start:`, error);
    }
  }

  async chooseRole(ctx: Context) {
    await ctx.replyWithHTML(
      `Ushbu Bot, Sahiy insonlar Sabrli insonlarga muruvvat ko'rsatishi uchun yaratilgan. Iltimos, qaysi toifadan ro'yxatdan o'tmoqchisiz?`,
      {
        ...Markup.keyboard([["Sahiy", "Sabrli"]]).resize(),
      }
    );
  }

  async onStop(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user) {
        await ctx.replyWithHTML(`Siz avval ro'yxatdan o'tmagansiz`, {
          ...Markup.removeKeyboard(),
        });
      } else if (user.status) {
        user.status = false;
        user.phone_number = "";
        await user.save();

        await ctx.replyWithHTML(
          `Siz vaqtincha botdan chiqib ketdingiz. Qayta faollashtirish uchun /start tugmasini bosing`,
          { ...Markup.keyboard([["/start"]]).resize() }
        );
      }
    } catch (error) {
      console.log(`Error in stop: `, error);
    }
  }

  async onContact(ctx: Context) {
    try {
      if ("contact" in ctx.message!) {
        const user_id = ctx.from?.id;
        const user = await this.botModel.findByPk(user_id);

        if (!user) {
          await ctx.replyWithHTML(`Iltimos, <b>/start</b> tugmasini bosing`, {
            ...Markup.keyboard([["/start"]]).resize(),
          });
        } else if (ctx.message.contact.user_id != user_id) {
          await ctx.replyWithHTML(
            `Iltimos, o'zingizni telefon raqamingizni yuboring`,
            {
              ...Markup.keyboard([
                [Markup.button.contactRequest("📞 Telefon raqam yuborish")],
              ]).resize(),
            }
          );
        } else {
          let phone = ctx.message.contact.phone_number;
          user.phone_number = phone[0] != "+" ? "+" + phone : phone;
          user.status = true;
          await user.save();

          await ctx.replyWithHTML(`Tabriklayman! Akkount faollashtirildi`, {
            ...Markup.removeKeyboard(),
          });
        }
      }
    } catch (error) {
      console.log(`Error in contact`, error);
    }
  }

  async onText(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);

      if (!user) {
        await ctx.replyWithHTML(`Iltimos, <b>/start</b> tugmasini bosing`, {
          ...Markup.keyboard([["/start"]]).resize(),
        });
        return;
      }

      let library = await this.libraryModel.findOne({
        where: { user_id, last_state: { [Op.ne]: "finish" } },
        order: [["id", "DESC"]],
      });

      if (!library) {
        library = await this.libraryModel.create({
          user_id: user_id!,
          last_state: "name",
        });
      }

      if ("text" in ctx.message!) {
        const userInput = ctx.message.text;

        switch (library.last_state) {
          case "name":
            library.name = userInput;
            library.last_state = "phone_number";
            await library.save();
            await ctx.replyWithHTML("Telefon raqamizni kiriting");
            break;

          case "phone_number":
            library.phone_number = userInput;
            library.last_state = "location";
            await library.save();
            await ctx.replyWithHTML("Locatiyangizni ulashing", {
              ...Markup.keyboard([
                [Markup.button.locationRequest("Manzil ulashish")],
              ]).resize(),
            });
            break;
        }
      }
    } catch (error) {
      console.log(`Error in ontext`, error);
    }
  }

  async onLocation(ctx: Context) {
    try {
      if ("location" in ctx.message!) {
        const user_id = ctx.from?.id;
        if (!user_id) {
          await ctx.replyWithHTML(`Iltimos, <b>/start</b> tugmasini bosing`, {
            ...Markup.keyboard([["/start"]]).resize(),
          });
          return;
        }

        const user = await this.botModel.findByPk(user_id);
        if (!user) {
          await ctx.replyWithHTML(`Iltimos, <b>/start</b> tugmasini bosing`, {
            ...Markup.keyboard([["/start"]]).resize(),
          });
          return;
        }

        const library = await this.libraryModel.findOne({
          where: { user_id, last_state: "location" },
          order: [["id", "DESC"]],
        });

        if (library) {
          library.location =
            ctx.message.location.latitude +
            "|" +
            ctx.message.location.longitude;
          library.last_state = "finish";
          await library.save();
          await ctx.replyWithHTML("Sahiy sifatida ro'yahatdan o'tdingiz!", {
            ...Markup.removeKeyboard(),
          });
        }
      }
    } catch (error) {
      console.log("Error on location: ", error);
    }
  }
}
