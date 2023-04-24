import { prisma } from "..";

/**class_high -> class_high_name */
export const createClassHighNameMap = async () => {
  const category = await prisma.class_high.findMany({
    select: {
      class_high: true,
      class_high_name: true,
    },
  });
  const categoryList = category.map(
    (c) => Object.values(c) as [number, string]
  );

  return new Map(categoryList);
};

/**class_mid -> class_mid_name */
export const createClassMidNameMap = async () => {
  const classMidTable = await prisma.class_high_to_mid.findMany({
    select: {
      class_mid: true,
      class_mid_name: true,
    },
  });
  const classMidNameList = classMidTable.map(
    (c) => Object.values(c) as [number, string]
  );

  return new Map(classMidNameList);
};

/**class_low -> class_low_name */
export const createClassLowNameMap = async () => {
  const classLowTable = await prisma.class_mid_to_low.findMany({
    select: {
      class_low: true,
      class_low_name: true,
    },
  });
  const classLowNameList = classLowTable.map(
    (c) => Object.values(c) as [number, string]
  );

  return new Map(classLowNameList);
};
