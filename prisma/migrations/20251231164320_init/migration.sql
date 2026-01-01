-- CreateTable
CREATE TABLE "Property" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "rent" INTEGER NOT NULL,
    "layout" TEXT NOT NULL,
    "size" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ViewingSlot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "propertyId" INTEGER NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "reservedCount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ViewingSlot_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slotId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "staffReq" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reservation_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "ViewingSlot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ViewingSlot_propertyId_startTime_key" ON "ViewingSlot"("propertyId", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_token_key" ON "Reservation"("token");
