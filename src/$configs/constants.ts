import "dotenv/config";

export const PORT_FALLBACK = 8080;
export const SECRET = process.env.SECRET || "secret-string";
export const COOKIE = process.env.COOKIE || "cookie-string";

export const DB_EVENTS = {
  CONNECTED: "connected",
  ERROR: "error",
  DISCONNECTED: "disconnected",
};

export const PROCESS_EVENTS = {
  SIGINT: "SIGINT",
  SIGTERM: "SIGTERM",
};

export const RATE_LIMIT_OPTS = {
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 100,
};
