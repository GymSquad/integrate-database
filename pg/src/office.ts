import { Router } from "express";
import { prisma } from "./app";
import { findCategoryRow, findDepartmentRow } from "./utils/find-row";

export const officeRouter = Router();

officeRouter.get("/", (_, res) => res.send("office"));

type createOfficeInput = {
  officeName: string;
  departmentName: string;
  categoryName: string;
};

officeRouter.post("/", async (req, res) => {
  const { officeName, departmentName, categoryName }: createOfficeInput =
    req.body;

  const categoryRow = await findCategoryRow(categoryName);

  if (categoryRow == null) {
    res.status(422).send(`"Can't find categoryName: ${categoryName}"`);
    console.log(`"Can't find categoryName: ${categoryName}"`);
    return;
  }

  const departmentRow = await findDepartmentRow(departmentName, categoryRow.id);
  if (departmentRow == null) {
    res.status(422).send(`"Can't find departmentName: ${departmentName}"`);
    console.log(`"Can't find departmentName: ${departmentName}"`);
    return;
  }

  const existOffice = await prisma.office.findUnique({
    where: {
      name_departmentId: {
        departmentId: departmentRow.id,
        name: officeName,
      },
    },
  });

  if (existOffice) {
    console.log(existOffice.name, existOffice.departmentId);
    res.status(422).send(existOffice.name);
    return;
  }

  const createdOffice = await prisma.office
    .create({
      data: {
        name: officeName,
        departmentId: departmentRow.id,
      },
    })
    .then((e) => res.send(e))
    .catch(() => {
      console.log(officeName);
      res.status(422).send(officeName);
    });
});
