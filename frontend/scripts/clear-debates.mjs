import { existsSync, readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;

    for (const rawLine of readFileSync(file, "utf8").split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;

      const eq = line.indexOf("=");
      if (eq === -1) continue;

      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

loadEnvFiles();

const prisma = new PrismaClient();

try {
  const debates = await prisma.debate.deleteMany();
  const sources = await prisma.source.deleteMany();

  console.log(`Removed ${debates.count} debate(s) and related posts/findings/evidence.`);
  console.log(`Removed ${sources.count} orphaned source record(s).`);
} finally {
  await prisma.$disconnect();
}
