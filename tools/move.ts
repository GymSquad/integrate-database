import { existsSync, readFileSync } from "node:fs";
import { argv } from "node:process";

// 0: ts-node, 1: move.ts, 2: the path of id-mapping.json

const main = () => {
  const mappingPath = argv[2];
  if (mappingPath === undefined) {
    console.error("usage: pnpm run move path-to-mapping.json");
  }
  const mapping = new Map<string, string>(
    Object.entries(JSON.parse(readFileSync(argv[2]).toString()))
  );

  mapping.forEach((id, new_id) => {
    if (!existsSync(`/mnt/webarchive/webarchive/${id}`)) {
      return;
    }
    const moveCmd = `mv /mnt/webarchive/webarchive/${id} /mnt/webarchive/new-archive/${new_id}`;
    console.log(moveCmd);
  });
};

main();
