export default {
  providers: [
    {
      applicationID: "convex",
      domain: process.env.CLERK_DOMAIN?.replace(/\/$/, "") || "",
      authorize: async (token: Record<string, unknown>) => {
        return token.sub ? { sub: token.sub as string } : null;
      },
    },
  ],
};