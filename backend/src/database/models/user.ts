import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { sequelize } from '../sequelize.js'

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>
  declare email: string
  declare passwordHash: string
  declare fullName: string
  declare accountStatus: CreationOptional<'active' | 'suspended'>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
      set(value: string) { this.setDataValue('email', value.trim().toLowerCase()) },
    },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    fullName: { type: DataTypes.STRING(160), allowNull: false },
    accountStatus: { type: DataTypes.STRING(24), allowNull: false, defaultValue: 'active' },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, tableName: 'users', underscored: true },
)
