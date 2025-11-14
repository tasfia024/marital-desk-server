import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: /* your frontend origin or array */ true }));
app.use(express.json());

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));

app.get("/", (req, res) => {
    res.send("MaritalDesk backend server is running...");
});

app.use("/api/auth", authRoutes);

/* Add more routes here, e.g. /api/users, /api/posts, etc. */

// error handler last
app.use(errorHandler);

export default app;
