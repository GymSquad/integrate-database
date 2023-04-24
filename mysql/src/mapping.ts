import { apiClient, prisma } from ".";

export const main = async () => {
  const siteInfo = await prisma.site_info.findMany({
    select: {
      Site_ID: true,
      URL: true,
      Name: true,
    },
  });

  apiClient.post("/mapping", {
    site_id: siteInfo[0].Site_ID,
    name: siteInfo[0].Name,
    url: siteInfo[0].URL,
  });
};

export default { run: main };
