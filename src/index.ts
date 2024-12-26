import "dotenv/config";

import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import mongoose from "mongoose";

import {
  DB_EVENTS,
  PROCESS_EVENTS,
  PORT_FALLBACK,
  RATE_LIMIT_OPTS,
} from "$configs/constants";

import { GET_MONGO_URL } from "$configs/database";

import routers from "$routers/index";

const APP = express();
const PORT = process.env.PORT || PORT_FALLBACK;

const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_cluster = process.env.DB_CLUSTER;

APP.use(
  cors({
    credentials: true,
  })
);

APP.use(compression());
APP.use(helmet());
APP.use(rateLimit(RATE_LIMIT_OPTS));
APP.use(cookieParser());
APP.use(bodyParser.json());
APP.use(routers());

const SERVER = http.createServer(APP);

SERVER.listen(PORT, () => {
  console.log(`### Server is running on http://localhost:${PORT}`);

  const MONGO_URI = GET_MONGO_URL({
    username: db_username,
    password: db_password,
    cluster: db_cluster,
  });

  mongoose.connect(MONGO_URI, {});

  const db = mongoose.connection;
  db.on(DB_EVENTS.CONNECTED, () => {
    console.log("--- Mongoose connection open");
  });
  db.on(DB_EVENTS.ERROR, (err: Error) => {
    console.error("--- Mongoose connection error:", err);
  });
  db.on(DB_EVENTS.DISCONNECTED, () => {
    console.log("--- Mongoose connection disconnected");
  });
});

for (const $EVENT in PROCESS_EVENTS) {
  process.on($EVENT, () => {
    console.log(`\n### ${$EVENT} signal received.`);

    SERVER.close(() => {
      console.log("### HTTP server closed");
      mongoose.connections.forEach((connection) => {
        connection.close();
      });
    });
  });
}
