import { prisma } from "..";

/**class_mid -> class_high */
export const createClassMidToHighMap = async () => {
  const departments = await prisma.class_high_to_mid.findMany({
    select: {
      class_mid: true,
      class_high: true,
    },
  });
  const departmentList = departments.map(
    ({ class_mid, class_high }) => [class_mid, class_high] as const
  );

  return new Map(departmentList);
};

/**class_low -> class_mid */
export const createClassLowToMidMap = async () => {
  const classLow = await prisma.class_mid_to_low.findMany({
    select: {
      class_low: true,
      class_mid: true,
    },
  });
  const classLowList = classLow.map(
    ({ class_low, class_mid }) => [class_low, class_mid] as const
  );

  return new Map(classLowList);
};

/** site_id -> class_low */
export const createSiteToClassLowMap = async () => {
  const siteClassTable = await prisma.site_class.findMany();

  let lowMap = new Map<number, number[]>();

  siteClassTable.forEach((s) => {
    const low = lowMap.get(s.Site_ID);
    if (low == null) {
      lowMap.set(s.Site_ID, [s.class_low]);
    } else {
      low.push(s.class_low);
    }
  });

  return lowMap;
};
