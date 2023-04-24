import { apiClient, prisma } from ".";
import { createClassHighNameMap, createClassMidNameMap } from "./maps/name";
import { createClassMidToHighMap } from "./maps/table";

const main = async () => {
  const classMidToHighMap = await createClassMidToHighMap();

  const classHighNameMap = await createClassHighNameMap();
  const classMidNameMap = await createClassMidNameMap();

  const classLowTable = await prisma.class_mid_to_low.findMany({
    select: {
      class_low: true,
      class_low_name: true,
      class_mid: true,
    },
  });

  const res = await Promise.allSettled(
    classLowTable.map(async (row) => {
      const classHighId = classMidToHighMap.get(row.class_mid);
      if (classHighId == null) {
        console.log("Not found classHighId: ", classHighId);
        return;
      }

      const classHighName = classHighNameMap.get(classHighId);
      if (classHighName == null) {
        console.log("Not found classHighName: ", classHighName);
        return;
      }

      const classMidName = classMidNameMap.get(row.class_mid);
      if (classMidName == null) {
        console.log("Not found classMidName: ", classMidName);
        return;
      }

      return apiClient.post("/office", {
        officeName: row.class_low_name,
        departmentName: classMidName,
        categoryName: classHighName,
      });
    })
  );
};

export default { run: main };
