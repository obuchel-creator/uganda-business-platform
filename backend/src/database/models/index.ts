import { Business } from './business.js'
import { BusinessCategory } from './business-category.js'
import { BusinessCategoryAssignment } from './business-category-assignment.js'
import { User } from './user.js'

User.hasMany(Business, { as: 'businesses', foreignKey: 'ownerId' })
Business.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' })
Business.belongsToMany(BusinessCategory, {
  as: 'categories',
  through: BusinessCategoryAssignment,
  foreignKey: 'businessId',
  otherKey: 'categoryId',
})
BusinessCategory.belongsToMany(Business, {
  as: 'businesses',
  through: BusinessCategoryAssignment,
  foreignKey: 'categoryId',
  otherKey: 'businessId',
})

export { Business, BusinessCategory, BusinessCategoryAssignment, User }
