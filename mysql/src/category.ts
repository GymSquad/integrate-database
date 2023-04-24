import { apiClient, prisma } from ".";

const main = async () => {
  const classHighName = await prisma.class_high.findMany({
    select: {
      class_high_name: true,
    },
  });

  const res = await Promise.allSettled(
    classHighName.map(({ class_high_name }) => {
      console.log(class_high_name);
      return apiClient.post("/category", { categoryName: class_high_name });
    })
  ).catch(console.error);

  console.log(res);
};

export default { run: main };
