import { Router } from "express";
import { prisma } from "./app";

export const categoryRouter = Router();

type Campus = {
  categoryName: string;
};

categoryRouter.get("/", (_, res) => res.send("category"));

categoryRouter.post("/", async (req, res) => {
  const data: Campus = req.body;
  await prisma.category.create({
    data: {
      name: data.categoryName,
    },
  });
  console.log(data.categoryName);
  res.send("done");
});
