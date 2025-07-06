import {
  Action,
  Command,
  Ctx,
  Hears,
  On,
  Start,
  Update,
} from "nestjs-telegraf";
import { SabrlilarService } from "./sabrlilar.service";
import { Context } from "telegraf";
import { BotService } from "../bot.service";

@Update()
export class SabrlilarUpdate {
  constructor(
    private readonly sabrliService: SabrlilarService,
    private readonly botService: BotService
  ) {}

  @Hears("Sabrli")
  async onHearsSabrli(@Ctx() ctx: Context) {
    await this.sabrliService.onRoleSabrli(ctx);
  }

  @Hears("Ha, to'g'ri")
  async onHearsSabrliy(@Ctx() ctx: Context) {
    await this.sabrliService.onSabrli(ctx);
  }

  @Hears("Yo'q, noto'g'ri")
  async onHearsSahiyRjc(@Ctx() ctx: Context) {
    await this.botService.chooseRole(ctx);
  }

  @Command("sabrli")
  async onCommandSabrli(@Ctx() ctx: Context) {
    await this.sabrliService.onRoleSabrli(ctx);
  }
}
