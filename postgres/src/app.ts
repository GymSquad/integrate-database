import { PrismaClient } from "@prisma/client";
import express from "express";
import { categoryRouter } from "./category";
import { departmentRouter } from "./department";
import { mappingRouter } from "./mapping";
import { officeRouter } from "./office";
import { websiteRouter } from "./website";

const app = express();

app.use(express.json());
app.use("/category", categoryRouter);
app.use("/department", departmentRouter);
app.use("/office", officeRouter);
app.use("/website", websiteRouter);
app.use("/mapping", mappingRouter);

app.get("/", (_, res) => {
  res.send({ ping: "pong" });
});

app.listen(3000, () => console.log("Listen on port 3000"));
export const prisma = new PrismaClient();
