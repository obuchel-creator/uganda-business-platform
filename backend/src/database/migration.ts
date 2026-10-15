import type { QueryInterface, Transaction } from 'sequelize'

export interface DatabaseMigration {
  name: string
  up(queryInterface: QueryInterface, transaction: Transaction): Promise<void>
  down(queryInterface: QueryInterface, transaction: Transaction): Promise<void>
}
