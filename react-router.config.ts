import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";

export default {
  // Enable SSR for API routes, loaders, actions
  ssr: true,
  // Vercel preset handles deployment configuration
  presets: [vercelPreset()],
} satisfies Config;
