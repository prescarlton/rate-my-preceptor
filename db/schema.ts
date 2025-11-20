import { createId } from "@paralleldrive/cuid2";
import {
  integer,
  timestamp,
  numeric,
  text,
  pgTable,
} from "drizzle-orm/pg-core";

export const rotations = pgTable("rotations", {
  id: text()
    .primaryKey()
    .$default(() => createId()),
  name: text("name").notNull(),
  location: text("location").notNull(),
  averageRating: numeric("average_rating").notNull().default("0"),
  totalReviews: integer("total_reviews").notNull().default(0),
  created: timestamp()
    .notNull()
    .$default(() => new Date()),
});

export const preceptors = pgTable("preceptors", {
  id: text()
    .primaryKey()
    .$default(() => createId()),
  name: text("name").notNull(),
  specialty: text("specialty"),
  rotationId: text("rotation_id")
    .notNull()
    .references(() => rotations.id, { onDelete: "restrict" }),
  averageRating: numeric("average_rating").notNull().default("0"),
  totalReviews: integer("total_reviews").notNull().default(0),
  created: timestamp()
    .notNull()
    .$default(() => new Date()),
});

export const preceptorReviews = pgTable("preceptor_reviews", {
  id: text()
    .primaryKey()
    .$default(() => createId()),
  preceptorId: text("preceptor_id")
    .notNull()
    .references(() => preceptors.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5 stars
  note: text("note").notNull(),
  created: timestamp()
    .notNull()
    .$default(() => new Date()),
});

export const rotationReviews = pgTable("rotation_reviews", {
  id: text()
    .primaryKey()
    .$default(() => createId()),
  rotationId: text("rotation_id")
    .notNull()
    .references(() => rotations.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5 stars
  note: text("note").notNull(),
  created: timestamp()
    .notNull()
    .$default(() => new Date()),
});

export type Rotation = typeof rotations.$inferSelect;
export type NewRotation = typeof rotations.$inferInsert;
export type Preceptor = typeof preceptors.$inferSelect;
export type NewPreceptor = typeof preceptors.$inferInsert;
export type PreceptorReview = typeof preceptorReviews.$inferSelect;
export type NewPreceptorReview = typeof preceptorReviews.$inferInsert;
export type RotationReview = typeof rotationReviews.$inferSelect;
export type NewRotationReview = typeof rotationReviews.$inferInsert;
