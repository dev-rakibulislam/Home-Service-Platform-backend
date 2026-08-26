// biome-ignore assist/source/organizeImports: <explanation>
import dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

if (!process.env.NODE_ENV) {
	throw new Error("NODE_ENV need");
}
if (!process.env.JWT_ACCESS_SECRET) {
	throw new Error("JWT_ACCESS_SECRET need");
}
if (!process.env.JWT_REFRESH_SECRET) {
	throw new Error("JWT_REFRESH_SECRET need");
}
if (!process.env.DATABASE_URL) {
	throw new Error("JWT_REFRESH_SECRET need");
}

// NODE_ENV= DEVELOPMENT || PRODUCTION
const isProd = process.env.NODE_ENV === "PRODUCTION";

export const config = {
	node_env: process.env.NODE_ENV || "development",
	port: process.env.PORT || 3000,

	app_url: isProd ? process.env.PROD_APP_URL : process.env.DEV_APP_URL,

	database_url: process.env.DATABASE_URL,

	bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

	jwt: {
		jwt_access_secret: process.env.JWT_ACCESS_SECRET,
		jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
		jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
		jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
	},

};

// stripe_product_price_id: process.env.STRIPE_PRODUCT_PRICE_ID!,
// stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
// stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,
