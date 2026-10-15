import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { sequelize } from '../sequelize.js'

export type BusinessPublicationStatus = 'draft' | 'pending_review' | 'published' | 'suspended' | 'rejected'
export type BusinessVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

export class Business extends Model<InferAttributes<Business>, InferCreationAttributes<Business>> {
  declare id: CreationOptional<string>
  declare ownerId: string
  declare name: string
  declare slug: string
  declare description: string | null
  declare contactEmail: string | null
  declare phone: string | null
  declare district: string | null
  declare locality: string | null
  declare publicationStatus: CreationOptional<BusinessPublicationStatus>
  declare verificationStatus: CreationOptional<BusinessVerificationStatus>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

Business.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    ownerId: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING(180), allowNull: false },
    slug: { type: DataTypes.STRING(200), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    contactEmail: { type: DataTypes.STRING(320), allowNull: true, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING(32), allowNull: true },
    district: { type: DataTypes.STRING(100), allowNull: true },
    locality: { type: DataTypes.STRING(120), allowNull: true },
    publicationStatus: { type: DataTypes.STRING(32), allowNull: false, defaultValue: 'draft' },
    verificationStatus: { type: DataTypes.STRING(32), allowNull: false, defaultValue: 'unverified' },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, tableName: 'businesses', underscored: true },
)
