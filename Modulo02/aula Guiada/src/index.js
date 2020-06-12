import express from "express";
import { promises } from "fs";
import accountsRouter from "./routes/accounts.js";
import winston from "winston";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./doc.js";
import cors from "cors";

const { writeFile, readFile, appendFile } = promises;

global.FileName = "./account.json";

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
global.Logger = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "my-bank-api.log" }),
  ],
  format: combine(label({ label: "my-bank-api" }), timestamp(), myFormat),
});

const port = 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/account", accountsRouter);
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
