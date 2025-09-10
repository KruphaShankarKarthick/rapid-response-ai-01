import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(async () => {
  const plugins = [react()];

  // Only load lovable-tagger in development
  if (process.env.NODE_ENV !== "production") {
    const { componentTagger } = await import("lovable-tagger");
    plugins.push(componentTagger());
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"), // 👈 add this
      },
    },
  };
});
