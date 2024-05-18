import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { periodType } from "../../../lib/types/types";
import { createPeriod, getPeriods } from "../../../lib/mongo/periods";
import { hasSession, isAdmin } from "../../../lib/utils/apiChecks";
import { isPeriodType } from "../../../lib/utils/validators";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!hasSession(res, session)) return;

  try {
    if (req.method === "GET") {
      const { periods, error } = await getPeriods();

      if (error) throw new Error(error);

      return res.status(200).json({ periods });
    }

    if (req.method === "POST") {
      if (!isAdmin(res, session)) return;
      const period = req.body as periodType;

      if (!isPeriodType(req.body)) {
        return res.status(400).json({ error: "Invalid data format" });
      }

      const { error } = await createPeriod(period);
      if (error) throw new Error(error);
      return res.status(201).json({ message: "Period created successfully" });
    }
  } catch {
    res.status(500).json("An error occurred");
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} is not allowed.`);
};

export default handler;
