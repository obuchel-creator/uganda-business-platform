import { DataTypes, Sequelize } from 'sequelize'
import type { DatabaseMigration } from '../migration.js'

const migration: DatabaseMigration = {
  name: '001_initial_business_directory',

  async up(queryInterface, transaction) {
    const timestamps = {
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    }

    await queryInterface.createTable('users', {
      id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
      email: { type: DataTypes.STRING(320), allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING(255), allowNull: false },
      full_name: { type: DataTypes.STRING(160), allowNull: false },
      account_status: { type: DataTypes.STRING(24), allowNull: false, defaultValue: 'active' },
      ...timestamps,
    }, { transaction })

    await queryInterface.createTable('business_categories', {
      id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
      name: { type: DataTypes.STRING(120), allowNull: false },
      slug: { type: DataTypes.STRING(140), allowNull: false, unique: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      ...timestamps,
    }, { transaction })

    await queryInterface.createTable('businesses', {
      id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
      owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      name: { type: DataTypes.STRING(180), allowNull: false },
      slug: { type: DataTypes.STRING(200), allowNull: false, unique: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      contact_email: { type: DataTypes.STRING(320), allowNull: true },
      phone: { type: DataTypes.STRING(32), allowNull: true },
      district: { type: DataTypes.STRING(100), allowNull: true },
      locality: { type: DataTypes.STRING(120), allowNull: true },
      publication_status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: 'draft' },
      verification_status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: 'unverified' },
      ...timestamps,
    }, { transaction })

    await queryInterface.createTable('business_category_assignments', {
      business_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: 'businesses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      category_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: 'business_categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
    }, { transaction })

    await queryInterface.addIndex('businesses', ['publication_status', 'district'], {
      name: 'businesses_publication_district_idx',
      transaction,
    })

    await queryInterface.sequelize.query(
      `ALTER TABLE "users" ADD CONSTRAINT "users_account_status_check" CHECK ("account_status" IN ('active', 'suspended'))`,
      { transaction },
    )
    await queryInterface.sequelize.query(
      `ALTER TABLE "businesses" ADD CONSTRAINT "businesses_publication_status_check" CHECK ("publication_status" IN ('draft', 'pending_review', 'published', 'suspended', 'rejected'))`,
      { transaction },
    )
    await queryInterface.sequelize.query(
      `ALTER TABLE "businesses" ADD CONSTRAINT "businesses_verification_status_check" CHECK ("verification_status" IN ('unverified', 'pending', 'verified', 'rejected'))`,
      { transaction },
    )
  },

  async down(queryInterface, transaction) {
    await queryInterface.dropTable('business_category_assignments', { transaction })
    await queryInterface.dropTable('businesses', { transaction })
    await queryInterface.dropTable('business_categories', { transaction })
    await queryInterface.dropTable('users', { transaction })
  },
}

export default migration
