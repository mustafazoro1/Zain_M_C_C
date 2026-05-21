import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { projectsTable } from "./projects";

export const projectImagesTable = pgTable("project_images", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projectsTable.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  isHero: boolean("is_hero").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertProjectImageSchema = createInsertSchema(projectImagesTable).omit({ id: true });
export type InsertProjectImage = z.infer<typeof insertProjectImageSchema>;
export type ProjectImage = typeof projectImagesTable.$inferSelect;
