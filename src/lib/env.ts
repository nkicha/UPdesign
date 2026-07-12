export const DEV_ENV = {
  isDev: process.env.NODE_ENV === "development",
  admin: {
    username: process.env.NEXT_PUBLIC_ADMIN_USERNAME,
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
  },
};
