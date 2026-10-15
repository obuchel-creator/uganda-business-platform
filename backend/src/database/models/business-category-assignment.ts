import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { sequelize } from '../sequelize.js'

export class BusinessCategoryAssignment extends Model<InferAttributes<BusinessCategoryAssignment>, InferCreationAttributes<BusinessCategoryAssignment>> {
  declare businessId: string
  declare categoryId: string
}

BusinessCategoryAssignment.init(
  {
    businessId: { type: DataTypes.UUID, primaryKey: true, field: 'business_id' },
    categoryId: { type: DataTypes.UUID, primaryKey: true, field: 'category_id' },
  },
  { sequelize, tableName: 'business_category_assignments', timestamps: false, underscored: true },
)
