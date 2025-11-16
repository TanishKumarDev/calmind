// ======================================================================
// Logger Utility (Winston)
//
// Purpose:
// Provides application-wide structured logging. Outputs logs to files in
// production and to the console in development. Ensures consistent log
// formatting and useful metadata for debugging and monitoring.
//
// Log Levels:
//   error → critical failures
//   warn  → unexpected but handled conditions
//   info  → standard lifecycle events
//   debug → verbose details (development only)
//
// Related Files:
//   error.log    → production error logs
//   combined.log → all logs in production
// ======================================================================

import winston from "winston";

// ----------------------------------------------------------------------
// Log format: timestamp + JSON (safe for log aggregators)
// ----------------------------------------------------------------------
const baseFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// ----------------------------------------------------------------------
// Create Winston logger
// ----------------------------------------------------------------------
export const logger = winston.createLogger({
  level: "info", // default log level
  format: baseFormat,
  transports: [
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "combined.log",
    }),
  ],
});

// ----------------------------------------------------------------------
// Console logger in development mode for easier debugging
// ----------------------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      ),
    })
  );
}

// ======================================================================
// End of Logger Utility
// ======================================================================
