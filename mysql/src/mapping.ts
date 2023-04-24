import { apiClient, prisma } from ".";

export const main = async () => {
  const siteInfo = await prisma.site_info.findMany({
    select: {
      Site_ID: true,
      URL: true,
      Name: true,
    },
  });

  await Promise.allSettled(
    siteInfo.map((info) =>
      apiClient.post("/mapping", {
        site_id: info.Site_ID,
        name: info.Name,
        url: info.URL,
      })
    )
  );
};

export default { run: main };
