import { Module } from "@nestjs/common";

import { BotModule } from "./bot/bot.module";
import { Bot } from "./bot/model/bot.entity";
import { Library } from "./bot/library/model/library.model";
import { TelegrafModule } from "nestjs-telegraf";
import { BOT_NAME } from "./app.constants";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      useFactory: () => ({
        token: process.env.BOT_TOKEN!,
        middlewares: [],
        include: [BotModule],
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),

    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      models: [Bot, Library],
      autoLoadModels: true,
      logging: false,
      sync: { alter: true },
    }),
    BotModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
