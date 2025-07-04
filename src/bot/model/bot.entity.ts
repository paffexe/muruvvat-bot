import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IBotCreationAttr {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  language_code: string;
}

@Table({ tableName: "bot" })
export class Bot extends Model<Bot, IBotCreationAttr> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  declare user_id: number;

  @Column({
    type: DataType.STRING(100),
  })
  declare username: string;

  @Column({
    type: DataType.STRING(50),
  })
  declare first_name: string;

  @Column({
    type: DataType.STRING(50),
  })
  declare last_name: string;

  @Column({
    type: DataType.STRING(3),
  })
  declare language_code: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare status: boolean;

  @Column({
    type: DataType.STRING(15),
  })
  declare phone_number: string;
}
