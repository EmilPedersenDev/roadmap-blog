/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.sql(`CREATE TYPE tiers AS ENUM ('free', 'premium');`)
  pgm.sql(`
    ALTER TABLE IF EXISTS users 
    ADD COLUMN tier tiers NOT NULL DEFAULT 'free',
    ADD COLUMN stripe_customer_id TEXT, 
    ADD COLUMN stripe_subscription_id TEXT, 
    ADD COLUMN stripe_subscription_status TEXT;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
    ALTER TABLE IF EXISTS users 
    DROP COLUMN tier,
    DROP COLUMN stripe_customer_id, 
    DROP COLUMN stripe_subscription_id, 
    DROP COLUMN stripe_subscription_status;
  `);
  pgm.sql(`DROP TYPE tiers;`);
};
