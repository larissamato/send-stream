import express from "express";
import router from "./routes.js";
import cors from "cors";
import "./services/cronJobs.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

app.listen(3000, () => console.log("API rodando"));
