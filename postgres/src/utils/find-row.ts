import { prisma } from "../app";

export const findCategoryRow = async (categoryName: string) => {
  const categoryRow = await prisma.category.findUnique({
    where: {
      name: categoryName,
    },
  });
  return categoryRow;
};

export const findDepartmentRow = async (
  departmentName: string,
  categoryId: string
) => {
  const departmentRow = await prisma.department.findUnique({
    where: {
      name_categoryId: { name: departmentName, categoryId },
    },
  });
  return departmentRow;
};

export const findOfficeRow = async (
  officeName: string,
  departmentId: string
) => {
  const officeRow = await prisma.office.findUnique({
    where: {
      name_departmentId: {
        departmentId,
        name: officeName,
      },
    },
  });
  return officeRow;
};
