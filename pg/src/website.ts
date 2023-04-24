import { Router } from "express";
import { prisma } from "./app";
import {
  findCategoryRow,
  findDepartmentRow,
  findOfficeRow,
} from "./utils/find-row";

export const websiteRouter = Router();

websiteRouter.get("/", (_, res) => res.send("website"));

type createWebsiteInput = {
  categoryName: string;
  departmentName: string;
  officeName: string;
  siteUrl: string;
  websiteName: string;
};

websiteRouter.post("/", async (req, res) => {
  const {
    categoryName,
    departmentName,
    officeName,
    siteUrl,
    websiteName,
  }: createWebsiteInput = req.body;

  const categoryRow = await findCategoryRow(categoryName);
  if (categoryRow == null) {
    console.log(`"Can't find categoryRow: ${categoryRow}"`);
    return res.status(422).send(`"Can't find categoryRow: ${categoryRow}"`);
  }

  const departmentRow = await findDepartmentRow(departmentName, categoryRow.id);
  if (departmentRow == null) {
    console.log(`"Can't find departmentRow: ${departmentRow}"`);
    return res.status(422).send(`"Can't find departmentRow: ${departmentRow}"`);
  }

  const officeRow = await findOfficeRow(officeName, departmentRow.id);
  if (officeRow == null) {
    console.log(`"Can't find officeRow: ${officeRow}"`);
    return res.status(422).send(`"Can't find officeRow: ${officeRow}"`);
  }

  const createWebsiteInput = await prisma.website.create({
    data: {
      name: websiteName,
      url: siteUrl,
      officeId: officeRow.id,
    },
  });

  res.send("done");
});
