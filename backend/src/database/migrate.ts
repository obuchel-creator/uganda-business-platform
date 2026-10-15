import { QueryTypes } from 'sequelize'
import { migrations } from './migrations/index.js'
import { sequelize } from './sequelize.js'

const migrationTable = 'ubp_schema_migrations'
const migrationLockId = 741_019_202

async function migrate(): Promise<void> {
  const appliedNames = await sequelize.transaction(async (transaction) => {
    await sequelize.query('SELECT pg_advisory_xact_lock(:lockId)', {
      replacements: { lockId: migrationLockId },
      transaction,
    })
    await sequelize.query(
      `CREATE TABLE IF NOT EXISTS "${migrationTable}" (
        "name" VARCHAR(200) PRIMARY KEY,
        "applied_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
      { transaction },
    )

    const applied = await sequelize.query<{ name: string }>(
      `SELECT "name" FROM "${migrationTable}" ORDER BY "name"`,
      { type: QueryTypes.SELECT, transaction },
    )
    const appliedSet = new Set(applied.map(({ name }) => name))

    for (const migration of migrations) {
      if (appliedSet.has(migration.name)) continue

      console.info(`Applying database migration: ${migration.name}`)
      await migration.up(sequelize.getQueryInterface(), transaction)
      await sequelize.query(
        `INSERT INTO "${migrationTable}" ("name") VALUES (:name)`,
        { replacements: { name: migration.name }, transaction },
      )
    }

    return appliedSet
  })

  const newlyApplied = migrations.filter(({ name }) => !appliedNames.has(name))
  console.info(newlyApplied.length ? `Applied ${newlyApplied.length} database migration(s).` : 'Database migrations are up to date.')
}

migrate()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unknown database migration error'
    console.error(`Database migration failed: ${message}`)
    process.exitCode = 1
  })
  .finally(async () => sequelize.close())
