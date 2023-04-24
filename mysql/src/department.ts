import { apiClient, prisma } from ".";
import { createClassHighNameMap } from "./maps/name";

const main = async () => {
  const classMidTable = await prisma.class_high_to_mid.findMany({
    select: {
      class_high: true,
      class_mid_name: true,
    },
  });
  const classHighNameMap = await createClassHighNameMap();
  const res = await Promise.allSettled(
    classMidTable.map(({ class_high, class_mid_name }) => {
      const classHighName = classHighNameMap.get(class_high);
      return apiClient.post("/department", {
        categoryName: classHighName,
        departmentName: class_mid_name,
      });
    })
  ).catch(console.error);
  console.log(res);
};

export default { run: main };
