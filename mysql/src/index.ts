import { PrismaClient } from "@prisma/client";
import axios from "axios";

import category from "./category";
import department from "./department";
import office from "./office";
import website from "./website";

export const prisma = new PrismaClient();
export const apiClient = axios.create({ baseURL: "http://localhost:3000" });

const run_all = async () => {
  await category.run();
  await department.run();
  await office.run();
  await website.run();
};

run_all().catch(console.error);
