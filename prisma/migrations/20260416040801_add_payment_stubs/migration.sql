-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('unpaid', 'processing', 'paid', 'failed', 'refunded', 'canceled');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentIntentId" TEXT,
ADD COLUMN     "paymentProvider" TEXT,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'unpaid';
