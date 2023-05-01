import { PrismaClient } from "@prisma/client";
import axios from "axios";

import website from "./website";

export const prisma = new PrismaClient();
export const apiClient = axios.create({ baseURL: "http://localhost:3000" });

const run_all = async () => {
  // await category.run();
  // await department.run();
  // await office.run();
  await website.run();
};

run_all().catch(console.error);

// mapping.run().catch(console.error);

// (async () => {
//   // @ts-ignore
//   const file = process.argv[2] as string;
//   console.log(file);
//   const main = (await import(`./${file}`)).default;
//   main().catch(console.error);
// })();
