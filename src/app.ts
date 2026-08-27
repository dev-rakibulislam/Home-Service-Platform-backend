// biome-ignore assist/source/organizeImports: <explanation>
import express, { type Express } from "express";
import { authRouter } from "./modules/auth/auth.route";
import AppError from "./core/error/appError";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./core/error/globalErrorHandler";
import { adminRouter } from "./modules/admin/admin.route";
import { categoryRouter } from "./modules/category/category.route";
import { serviceRouter } from "./modules/service/service.route";
import { technicianRouter } from "./modules/technician/technician.route";
import { bookingRouter } from "./modules/booking/booking.route";
import { paymentRouter } from "./modules/payment/payment.route";
const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (_, res) => {
	res.status(200).send("Hello, World!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/technician", technicianRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/services", serviceRouter);

app.use(globalErrorHandler);

app.use((req, _, next) => {
	next(
		new AppError(
			404,
			`Cannot ${req.method} ${req.originalUrl}. maybe this does not exist or you are not authorized to access this route`,
		),
	);
});

export default app;
