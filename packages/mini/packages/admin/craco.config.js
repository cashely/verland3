import path from "node:path";
const { resolve } = path;
module.exports = {
  webpack: {
    alias: {
      "@": resolve("src"),
    },
  },
};
