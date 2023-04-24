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

  const res = await Promise.allSettled(
    siteInfo.map(async (info) => {
      const classLowId = siteToClassLowMap.get(info.Site_ID);
      if (classLowId == null) throw `Can't find classLowId: ${info.Site_ID}`;

      const classLowName = classLowNameMap.get(classLowId);
      if (classLowName == null) throw `Can't find classLowName: ${classLowId}`;

      const classMidId = classLowToMidMap.get(classLowId);
      if (classMidId == null) throw `Can't find classMidId: ${classLowId}`;

      const classMidName = classMidNameMap.get(classMidId);
      if (classMidName == null) throw `Can't find classMidName: ${classMidId}`;

      const classHighId = classMidToHighMap.get(classMidId);
      if (classHighId == null) throw `Can't find classHighId: ${classMidId}`;

      const classHighName = classHighNameMap.get(classHighId);
      if (classHighName == null)
        throw `Can't find classHighName: ${classHighId}`;

      return apiClient.post("/website", {
        categoryName: classHighName,
        departmentName: classMidName,
        officeName: classLowName,
        siteUrl: info.URL,
        websiteName: info.Name,
      });
    })
  ).catch(console.error);
};

export default { run: main };
