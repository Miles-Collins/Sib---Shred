import { prisma } from "@/lib/prisma";

export async function getOrderReceiptByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
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