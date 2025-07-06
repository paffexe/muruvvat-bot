import { Column, DataType, Model, Table } from "sequelize-typescript";

interface ISabrliCreationAttr {
  user_id: number;
  last_state: string;
}

@Table({ tableName: "sabrlilar" })
export class Sabrlilar extends Model<Sabrlilar, ISabrliCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.BIGINT,
  })
  declare user_id: number;

  @Column({
    type: DataType.STRING(100),
  })
  declare name: string;

  @Column({
    type: DataType.STRING(15),
  })
  declare phone_number: string;

  @Column({
    type: DataType.STRING,
  })
  declare region: string;

  @Column({
    type: DataType.STRING,
  })
  declare district: string;

  @Column({
    type: DataType.STRING(50),
  })
  declare last_state: string;
}
