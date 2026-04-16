import { prisma } from "@/lib/prisma";

export async function getOrderReceiptByNumberAndToken(orderNumber: string, receiptAccessToken: string) {
  return prisma.order.findUnique({
    where: {
      orderNumber,
      receiptAccessToken,
    },
    include: {
      plan: {
        select: {
          name: true,
        },
      },
      items: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          meal: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}