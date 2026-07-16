// lib/db/seed.ts
// Run with: npm run db:seed
// Inserts sample products with realistic attributes so the RAG demo query
// ("waterproof backpack under $120, fits 16-inch laptop") has real matches.

import { db } from "@/lib/db";
import { products, users } from "@/lib/db/schema";
import bcrypt from "bcryptjs";

async function main() {
  await db.insert(users).values({
    email: "admin@example.com",
    passwordHash: await bcrypt.hash("admin123", 10),
    name: "Admin",
    role: "admin",
  });

  await db.insert(products).values([
    {
      slug: "trailrunner-28l-backpack",
      name: "TrailRunner 28L Hiking Backpack",
      description:
        "A lightweight, fully waterproof hiking backpack with a padded 16-inch laptop sleeve, hydration port, and rain cover.",
      priceCents: 9900,
      category: "backpacks",
      brand: "PeakGear",
      imageUrl: null,
      attributes: {
        waterproof: true,
        laptopCompatibleInches: [13, 14, 15, 16],
        weightGrams: 950,
        colors: ["black", "olive"],
        material: "ripstop nylon",
      },
      stockQuantity: 42,
    },
    {
      slug: "summit-pro-45l",
      name: "Summit Pro 45L Expedition Pack",
      description:
        "A larger multi-day expedition backpack, water-resistant (not fully waterproof) with a 17-inch laptop compartment.",
      priceCents: 18900,
      category: "backpacks",
      brand: "AlpineCo",
      imageUrl: null,
      attributes: {
        waterproof: false,
        laptopCompatibleInches: [15, 16, 17],
        weightGrams: 1700,
        colors: ["grey"],
        material: "polyester",
      },
      stockQuantity: 15,
    },
    {
      slug: "citywalk-commuter-22l",
      name: "CityWalk Commuter Backpack",
      description:
        "A sleek waterproof commuter backpack designed for laptops up to 16 inches, with anti-theft zippers.",
      priceCents: 7400,
      category: "backpacks",
      brand: "UrbanGear",
      imageUrl: null,
      attributes: {
        waterproof: true,
        laptopCompatibleInches: [13, 14, 15, 16],
        weightGrams: 700,
        colors: ["black", "navy"],
        material: "PU-coated canvas",
      },
      stockQuantity: 60,
    },
    {
      slug: "noisecancel-headphones-x2",
      name: "NoiseCancel X2 Headphones",
      description:
        "Over-ear active noise-cancelling headphones with 30-hour battery life.",
      priceCents: 14900,
      category: "audio",
      brand: "SonicWave",
      imageUrl: null,
      attributes: { weightGrams: 280, colors: ["black", "white"] },
      stockQuantity: 30,
    },
  ]);

  console.log("Seed complete. Run `npm run embed:products` next.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
