/*
  Warnings:

  - Added the required column `hora` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "hora" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Event" ("createdAt", "data", "descricao", "id", "updatedAt") SELECT "createdAt", "data", "descricao", "id", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_descricao_key" ON "Event"("descricao");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
