import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbconnect";
import TestModel from "@/app/models/TestSchema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const getTestData = await TestModel.find({}); //find all objects in db, collection is specified in the TestSchema file
      res.status(200).json({ success: true, data: getTestData });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, error: "Server failed to fetch the data" });
    }
  } else {
    // Proper response for unsupported HTTP methods
    res.setHeader("Allow", ["GET"]); // tells the client which methods are allowed
    res
      .status(405)
      .json({ success: false, error: `Method ${req.method} not allowed` });
  }
}
