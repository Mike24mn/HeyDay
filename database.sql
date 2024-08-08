CREATE TABLE IF NOT EXISTS "user" (
 "id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
 "username" text NOT NULL UNIQUE,
 "password" text NOT NULL,
 "access_level" bigint DEFAULT 1,
 PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "business" (
 "id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
 "business_name" VARCHAR(255) NOT NULL,
 "address" text NOT NULL,
 "description" text,
 "business_type" text,
 "phone_number" text,
 "user_id" INTEGER,
 PRIMARY KEY ("id")
);
CREATE TABLE "search_history" (
 "id" SERIAL PRIMARY KEY,
 "name" VARCHAR(255) NOT NULL,
 "address" VARCHAR(255) NOT NULL,
 "user_id" INTEGER NOT NULL,
 "business_id" INTEGER NOT NULL,
 FOREIGN KEY ("user_id") REFERENCES "user"("id"),
 FOREIGN KEY ("business_id") REFERENCES "business"("id")
);
CREATE TABLE IF NOT EXISTS "favorites" (
 "id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
 "user_id" bigint,
 "business_id" bigint NOT NULL,
 "name" text,
 "address" text,
 PRIMARY KEY ("id"),
 CONSTRAINT fk_user FOREIGN KEY("user_id") REFERENCES "user"("id") ON DELETE CASCADE,
 CONSTRAINT fk_business FOREIGN KEY("business_id") REFERENCES "business"("id") ON DELETE CASCADE,
 CONSTRAINT unique_user_favorite UNIQUE (user_id, business_id)
);
CREATE INDEX idx_favorites_business_id ON favorites(business_id);
CREATE TABLE IF NOT EXISTS "happy_hour" (
 "id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
 "business_id" bigint NOT NULL,
 "user_id" bigint,
 "date" date,
 "start_time" time without time zone,
 "end_time" time without time zone,
 "description" text,
 "name" text,
 "address" text,
 "likes" BIGINT DEFAULT 0,
 "interested" BIGINT DEFAULT 0,
 "day_of_week" TEXT,
 PRIMARY KEY ("id"),
 CONSTRAINT fk_business
  FOREIGN KEY("business_id")
  REFERENCES "business"("id")
  ON DELETE CASCADE,
 CONSTRAINT fk_user
  FOREIGN KEY("user_id")
  REFERENCES "user"("id")
  ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "vibe" (
 "id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
 "name" text NOT NULL,
 PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "diet" (
 "id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
 "name" text NOT NULL,
 PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "business_vibe" (
 "business_id" bigint NOT NULL,
 "vibe_id" bigint NOT NULL,
 PRIMARY KEY ("business_id", "vibe_id"),
 CONSTRAINT fk_business
  FOREIGN KEY("business_id")
  REFERENCES "business"("id")
  ON DELETE CASCADE,
 CONSTRAINT fk_vibe
  FOREIGN KEY("vibe_id")
  REFERENCES "vibe"("id")
  ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "business_diet" (
 "business_id" bigint NOT NULL,
 "diet_id" bigint NOT NULL,
 PRIMARY KEY ("business_id", "diet_id"),
 CONSTRAINT fk_business
  FOREIGN KEY("business_id")
  REFERENCES "business"("id")
  ON DELETE CASCADE,
 CONSTRAINT fk_diet
  FOREIGN KEY("diet_id")
  REFERENCES "diet"("id")
  ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "business_image" (
 "id" BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
 "business_id" BIGINT NOT NULL,
 "image_url" TEXT NOT NULL,
 PRIMARY KEY ("id"),
 CONSTRAINT fk_business FOREIGN KEY("business_id") REFERENCES "business"("id") ON DELETE CASCADE
);

