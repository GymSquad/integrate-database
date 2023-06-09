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
    console.error("Not found");
    res.status(404).send("Not found");
  }

  if (result.length > 1) {
    console.error("Duplicate");
    res.status(500).send("Duplicate");
  }

  if (ARCHIVE_PATH == undefined) {
    console.error("ArchivePath is not defined");
    res.status(500).send("ArchivePath is not defined");
  }

  const cmd = `ln -s ${ARCHIVE_PATH}/webarchive/${site_id} ${ARCHIVE_PATH}/new/${result[0].id}`;
  exec(cmd, (error) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(
      `${ARCHIVE_PATH}/webarchive/${site_id} -> ${ARCHIVE_PATH}/new/${result[0].id}`
    );
  });

  res.send("OK");
});
