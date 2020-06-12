import express from "express";
import { promises } from "fs";
import gradesRouter from "./routes/grades.js";
import winston from "winston";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./doc.js";
import cors from "cors";

const { writeFile, readFile, appendFile } = promises;

global.FileName = "./grades.json";

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
global.Logger = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "grades.log" }),
  ],
  format: combine(label({ label: "grades" }), timestamp(), myFormat),
});

const port = 3002;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/grades", gradesRouter);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, async () => {
  try {
    const initialJson = {
      nextId: 1,
      account: [],
    };
    Logger.info(`API Started in port http://localhost:${port}`);
    await writeFile(global.FileName, JSON.stringify(initialJson), {
      flag: "wx",
    });
  } catch (error) {}
});
