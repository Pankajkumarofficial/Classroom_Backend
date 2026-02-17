import arcjet, { detectBot, shield, slidingWindow } from "@arcjet/node";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.ARCJET_KEY && process.env.NODE_ENV === "test") {
    throw new Error("ARCJET_KEY is required in test environment");
}

const aj = arcjet({
    key: process.env.ARCJET_KEY!,
    rules: [
        shield({ mode: "LIVE" }),
        detectBot({
            mode: "LIVE", //
            allow: [
                "CATEGORY:SEARCH_ENGINE",
            ],
        }),
        slidingWindow({
            mode: "LIVE",
            interval: '2s',
            max: 5,
        })
    ],
});

export default aj;