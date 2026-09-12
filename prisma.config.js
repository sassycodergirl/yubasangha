const { defineConfig, env } = require("prisma/config");

// Prisma 7's CLI no longer auto-loads .env — load it ourselves so
// `DATABASE_URL` below (and `npx prisma db seed`'s ADMIN_EMAIL/PASSWORD) work.
require("dotenv").config();

module.exports = defineConfig({
  // Used by the CLI (migrate, db seed, studio) — the app itself connects via
  // the driver adapter in src/lib/db.js, not this file.
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    seed: "node prisma/seed.js",
  },
});
