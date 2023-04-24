import { Router } from "express";
import { prisma } from "./app";

export const departmentRouter = Router();

departmentRouter.get("/", (_, res) => res.send("department"));

type CreateDepartmentInput = {
  categoryName: string;
  departmentName: string;
};

departmentRouter.post("/", async (req, res) => {
  const { categoryName, departmentName }: CreateDepartmentInput = req.body;
  const categoryTable = await prisma.category.findUnique({
    where: {
      name: categoryName,
    },
    select: {
      id: true,
    },
  });
  if (categoryTable == null) {
    res.send("Fail");
    return;
  }

  const createdDepartment = await prisma.department.create({
    data: {
      name: departmentName,
      categoryId: categoryTable.id,
    },
  });

  res.send(createdDepartment);
});
