import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import maritalDeskRoutes from "./routes/marital-desk.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:5173" }));
// app.use(cors({ 
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
// app.use("/uploads", express.static("uploads", {
//     setHeaders: (res, path) => {
//         res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
//         res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
//         res.setHeader('Cache-Control', 'public, max-age=3600');
//     }
// }));

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));

app.get("/", (req, res) => {
    res.send("MaritalDesk backend server is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/v1/marital-desk", maritalDeskRoutes);

/* Add more routes here, e.g. /api/users, /api/posts, etc. */

// error handler last
app.use(errorHandler);

export default app;
