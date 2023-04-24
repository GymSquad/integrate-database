import { exec } from "child_process";
import { Router } from "express";
import { prisma } from "./app";

export const mappingRouter = Router();

const ARCHIVE_PATH = process.env.ARCHIVE_PATH;

mappingRouter.get("/", (_, res) => res.send("mapping"));

type MappingParams = {
  site_id: string;
  name: string;
  url: string;
};

mappingRouter.post("/", async (req, res) => {
  const { site_id, name, url }: MappingParams = req.body;
  const result = await prisma.website.findMany({
    where: {
      url,
      name,
    },
  });

  if (result.length == 0) {
    throw new Error("Not found");
  }

  if (result.length > 1) {
    throw new Error("Duplicate");
  }

  if (ARCHIVE_PATH == undefined) {
    throw new Error("ArchivePath is not defined");
  }

  exec(
    `ln -s ${ARCHIVE_PATH}/webarchive/${site_id} ${ARCHIVE_PATH}/new/${result[0].id}`,
    (error) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(
        `${ARCHIVE_PATH}/webarchive/${site_id} -> ${ARCHIVE_PATH}/new/${result[0].id}`
      );
    }
  );

  res.send("OK");
});

mappingRouter.get("/all", async (req, res) => {
  prisma;
});
