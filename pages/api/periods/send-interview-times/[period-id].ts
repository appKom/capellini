import { NextApiRequest, NextApiResponse } from "next";
import { sendOutInterviewTimes } from "../../../../lib/sendInterviewTimes/sendInterviewTimes";
import { hasSession, isAdmin } from "../../../../lib/utils/apiChecks";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const periodId = req.query["period-id"];

  if (typeof periodId !== "string") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!hasSession(res, session)) return;

  try {
    if (req.method === "POST") {
      if (!isAdmin(res, session)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const result = await sendOutInterviewTimes({ periodId });

      if ("error" in result) {
        return res.status(500).json({ error: result.error });
      }

      return res.status(201).json({ message: "Period created successfully" });
    }
  } catch {
    return res.status(500).json("An error occurred");
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;
