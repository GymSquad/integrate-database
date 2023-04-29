import { existsSync, writeFileSync } from "fs";
import { prisma } from "..";

const main = async () => {
  const downloadInfo = await prisma.download_info.findMany({
    select: {
      Site_ID: true,
      Location: true,
    },
  });

  downloadInfo.forEach(({ Site_ID, Location }) => {
    if (!Location) return;
    if (!existsSync(Location)) {
      writeFileSync("test-log.txt", Location + "\n", { flag: "a" });
    }
  });
};

main();
