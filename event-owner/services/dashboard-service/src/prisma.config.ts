import { defineConfig } from '@prisma/config';

export default defineConfig({
  // relative to the location of this file
  schema: './src/prisma/schema.prisma',
});
