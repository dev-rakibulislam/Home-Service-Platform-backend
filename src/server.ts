import app from "./app";
import { config } from "./config/env";
import { prisma } from "./config/prisma";
import main from "./needSeed";
import seedIntoDB from "./seed";

async function startServer() {
	try {
		await prisma.$connect();
		console.log("database connected successfully.");
		await seedIntoDB();
		// for dummy data max 1 time for storage
		// await main()
		app.listen(config.port, () => {
			console.log(`running on => http://127.0.0.1:${config.port}`);
		});
	} catch (error) {
		await prisma.$disconnect();
		console.dir(error);
	}
}
startServer();
