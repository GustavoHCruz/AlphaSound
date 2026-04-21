-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AudioSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "audioPath" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PROCESSING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "AudioSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AudioSegment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "audioBase64" TEXT,
    "start" REAL NOT NULL,
    "end" REAL NOT NULL,
    "text" TEXT NOT NULL,
    "transcription" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    CONSTRAINT "AudioSegment_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AudioSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
