-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AudioSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "audioPath" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PROCESSING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "AudioSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AudioSession" ("audioPath", "createdAt", "id", "userId") SELECT "audioPath", "createdAt", "id", "userId" FROM "AudioSession";
DROP TABLE "AudioSession";
ALTER TABLE "new_AudioSession" RENAME TO "AudioSession";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
