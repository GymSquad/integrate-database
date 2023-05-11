import throttledQueue from "throttled-queue";
import { apiClient, prisma } from ".";
import {
  createClassHighNameMap,
  createClassLowNameMap,
  createClassMidNameMap,
} from "./maps/name";
import {
  createClassLowToMidMap,
  createClassMidToHighMap,
  createSiteToClassLowMap,
} from "./maps/table";

const main = async () => {
  const siteInfo = await prisma.site_info.findMany({
    select: {
      Site_ID: true,
      URL: true,
      Name: true,
    },
  });

  if (siteInfo == null) {
    console.log("Can't find siteInfo");
    return;
  }

  const siteToClassLowMap = await createSiteToClassLowMap();
  const classLowToMidMap = await createClassLowToMidMap();
  const classMidToHighMap = await createClassMidToHighMap();

  const classLowNameMap = await createClassLowNameMap();
  const classMidNameMap = await createClassMidNameMap();
  const classHighNameMap = await createClassHighNameMap();

  const throttle = throttledQueue(100, 1000);

  console.log(siteInfo.length);

  await Promise.allSettled(
    siteInfo.map(async (info) => {
      const classLowIdList = siteToClassLowMap.get(info.Site_ID);
      if (classLowIdList == null)
        throw `Can't find classLowId: ${info.Site_ID}`;

      const axiosList = classLowIdList.map((classLowId) => {
        const classLowName = classLowNameMap.get(classLowId);
        if (classLowName == null) {
          throw `Can't find classLowName: ${classLowId}`;
        }

        const classMidId = classLowToMidMap.get(classLowId);
        if (classMidId == null) {
          throw `Can't find classMidId: ${classLowId}`;
        }
        const classMidName = classMidNameMap.get(classMidId);
        if (classMidName == null) {
          throw `Can't find classMidName: ${classMidId}`;
        }

        const classHighId = classMidToHighMap.get(classMidId);
        if (classHighId == null) {
          throw `Can't find classHighId: ${classMidId}`;
        }

        const classHighName = classHighNameMap.get(classHighId);
        if (classHighName == null) {
          throw `Can't find classHighName: ${classHighId}`;
        }

        return throttle(() =>
          apiClient.post("/website", {
            categoryName: classHighName,
            departmentName: classMidName,
            officeName: classLowName,
            siteUrl: info.URL,
            siteId: info.Site_ID,
            websiteName: info.Name,
          })
        );
      });

      const results = await Promise.allSettled(axiosList);

      results.forEach((result) => {
        if (result.status === "rejected") {
          console.error(result.reason);
        }
      });
    })
  ).catch(console.error);
};

export default { run: main };
