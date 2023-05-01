import { Prisma } from "@prisma/client";
import { Router } from "express";
import { writeFile } from "fs/promises";
import { prisma } from "./app";
import {
  findCategoryRow,
  findDepartmentRow,
  findOfficeRow,
} from "./utils/find-row";

export const websiteRouter = Router();

websiteRouter.get("/", async (_, res) => {
  await writeFile(
    "errors.json",
    JSON.stringify(
      errors.map((data, index) => ({ index, ...data })),
      null,
      2
    )
  );
  res.send("ok");
});

type createWebsiteInput = {
  categoryName: string;
  departmentName: string;
  officeName: string;
  siteUrl: string;
  websiteName: string;
};

const errors: {
  websiteName: string;
  siteUrl: string;
}[] = [];

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
  try {
    await prisma.website.upsert({
      create: {
        name: websiteName,
        url: siteUrl,
        office: {
          connect: {
            id: officeRow.id,
          },
        },
      },
      update: {
        office: {
          connect: {
            id: officeRow.id,
          },
        },
      },
      where: {
        url_name: {
          url: siteUrl,
          name: websiteName,
        },
      },
    });
  } catch (err) {
    // console.count("something went wrong");
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      errors.push({
        websiteName,
        siteUrl,
      });
    } else {
      console.log(err);
    }
    // await writeFile("website-error.json", JSON.stringify(req.body));
    return res.status(200).send("bad");
  }

  res.status(201).send("done");
});
