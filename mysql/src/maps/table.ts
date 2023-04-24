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
  const siteClassList = siteClassTable.map(
    (s) => [s.Site_ID, s.class_low] as const
  );
  return new Map(siteClassList);
};
