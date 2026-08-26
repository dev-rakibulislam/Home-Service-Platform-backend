import express, { type Express } from "express";
import { authRouter } from "./modules/auth/auth.route";
import AppError from "./core/error/appError";
import cookieParser from "cookie-parser";
const app: Express = express();


app.use(express.json());
app.use(cookieParser());
app.get("/", (_, res) => {
	res.status(200).send("Hello, World!");
});



app.use("/api/v1/auth", authRouter);

// app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/auth", authRouter);

app.use((req, res, next) => {
	next(new AppError(404, `Cannot ${req.method} ${req.originalUrl}. maybe this does not exist or you are not authorized to access this route`));
});

export default app;
