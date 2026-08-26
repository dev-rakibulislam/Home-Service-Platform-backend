import app from "./app";
import { config } from "./config/env";
import { prisma } from "./config/prisma";



async function startServer() {
	try {
		await prisma.$connect();
		console.log("database connected successfully.");
		app.listen(config.port, () => {
			console.log(`running on ${config.port}`);
		});
	} catch (error) {
		await prisma.$disconnect();
		console.dir(error);
	}
}
startServer();
