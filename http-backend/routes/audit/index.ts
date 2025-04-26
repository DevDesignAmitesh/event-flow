import { Request, Response, Router } from "express";
import { middleware } from "../../middleware";
import { prisma } from "../../prisma/src";

const auditRouter = Router();

// GET /audit - Fetch audit logs for the logged-in user
auditRouter.get(
  "/",
  middleware,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = (req as any).user?.userId; // assuming your auth middleware adds user to req

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const auditLogs = await prisma.auditLog.findMany({
        where: { userId },
        orderBy: { timestamp: "desc" },
        include: {
          event: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      return res.status(200).json({ auditLogs });
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default auditRouter;
