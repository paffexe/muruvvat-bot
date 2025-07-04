import {
  Action,
  Command,
  Ctx,
  Hears,
  On,
  Start,
  Update,
} from "nestjs-telegraf";
import { LibraryService } from "./library.service";
import { Context } from "telegraf";
import { BotService } from "../bot.service";

@Update()
export class LibraryUpdate {
  constructor(
    private readonly libraryService: LibraryService,
    private readonly botService: BotService
  ) {}

  @Hears("Sahiy")
  async onHearsLibrary(@Ctx() ctx: Context) {
    await this.libraryService.onRoleSahiy(ctx);
  }

  @Hears("Ha, to'g'ri")
  async onHearsSahiy(@Ctx() ctx: Context) {
    await this.libraryService.onSahiy(ctx);
  }

  @Hears("Yo'q, noto'g'ri")
  async onHearsSahiyRjc(@Ctx() ctx: Context) {
    await this.botService.chooseRole(ctx);
  }
  @Hears("🆕Yangi kutubxona qo'shish")
  async addNewLibrary(@Ctx() ctx: Context) {
    await this.libraryService.addNewLibrary(ctx);
  }
}
