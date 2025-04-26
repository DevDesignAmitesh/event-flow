import { Request, Response, Router } from "express";
import { middleware } from "../../middleware";
import { prisma } from "../../prisma/src";

const notificationRouter = Router();

// GET /api/v1/notifications
notificationRouter.get(
  "/",
  middleware,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = (req as any).user.userId; // you must have userId from your middleware

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const notifications = await prisma.notifications.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json({ notifications });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
);

export default notificationRouter;
