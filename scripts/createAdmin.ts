import "dotenv/config";
import bcrypt from "bcrypt";
import { db } from "../server/db";  // adjust if your db file path differs
import { users } from "../shared/schema";

const email = "mohammedtousif8709@gmail.com";
const username = "admin";
const password = "MD Tousif2004";

const hashedPassword = await bcrypt.hash(password, 10);

await db.insert(users).values({
  email,
  username,
  password: hashedPassword,
  isAdmin: true,
});

console.log("✅ Admin user created:", email);
process.exit(0);
