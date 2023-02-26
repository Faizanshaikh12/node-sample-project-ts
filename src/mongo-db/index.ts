import * as Sentry from "@sentry/node";
import mongoose from "mongoose";
import { MONGO_DB, COMMON_CONSTANT, ENVIRONMENT } from '../constants'

export const mongoDbConnection = () => {
    try {
        if (COMMON_CONSTANT.NODE_ENV === ENVIRONMENT.PROD) {
            const DB_URL = `mongodb://${MONGO_DB.MONGO_DB_USER}:${MONGO_DB.MONGO_DB_PASS}@${MONGO_DB.MONGO_DB_URL}:${MONGO_DB.MONGO_DB_PORT}/${MONGO_DB.MONGO_DB_NAME}?retryWrites=false`;
            const certFile = process.cwd() + '/rds-combined-ca-bundle.pem';
            mongoose.connect(DB_URL, {
                tls: true,
                tlsCAFile: certFile,
                tlsAllowInvalidHostnames: true,
                auth: {
                    username: MONGO_DB.MONGO_DB_USER,
                    password: MONGO_DB.MONGO_DB_PASS
                }
            })
              .then(() => {
                  console.log("Mongo Database connection has been successfully connected.");
                  Sentry.captureMessage("Mongo Database connection has been successfully connected.");
              }).catch((err) => {
                Sentry.captureException("Unable to connect to the mongo db database:", err);
                console.error("Unable to connect to the mongo db database:", err);
            })
        } else {
            if (+MONGO_DB.MONGO_DB_LOCAL === 0) {
              mongoose.connect('mongodb+srv://new-user:D0G9U7JjikqJWOeI@biznext-spiral.fqd8eou.mongodb.net/sherbazaar_spiral')
                .then(() => {
                      console.log("Mongo Database local connection has been successfully connected.");
                      Sentry.captureMessage("Mongo Database connection has been successfully connected.");
                  }).catch((err) => {
                    Sentry.captureException("Unable to connect to the mongo db database:", err);
                    console.error("Unable to connect to the mongo db database:", err);
                })
            } else {
                const DB_URL = `mongodb://${MONGO_DB.MONGO_DB_USER}:${MONGO_DB.MONGO_DB_PASS}@${MONGO_DB.MONGO_DB_URL}:${MONGO_DB.MONGO_DB_PORT}/${MONGO_DB.MONGO_DB_NAME}?retryWrites=false`;
                const certFile = process.cwd() + '/rds-combined-ca-bundle.pem';
                mongoose.connect(DB_URL, {
                    tls: true,
                    tlsCAFile: certFile,
                    tlsAllowInvalidHostnames: true,
                    auth: {
                        username: MONGO_DB.MONGO_DB_USER,
                        password: MONGO_DB.MONGO_DB_PASS
                    }
                })
                  .then(() => {
                      console.log("Mongo Database connection has been successfully connected.");
                      Sentry.captureMessage("Mongo Database connection has been successfully connected.");
                  }).catch((err) => {
                    Sentry.captureException("Unable to connect to the mongo db database:", err);
                    console.error("Unable to connect to the mongo db database:", err);
                })
            }

        }
    } catch (error: any) {
        Sentry.captureException("Unable to connect to the mongo db database:", error);
        console.error("Unable to connect to the mongo db database:", error);
    }
};
