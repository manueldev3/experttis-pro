const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "via.placeholder.com",
            "firebasestorage.googleapis.com",
            "https://firebasestorage.googleapis.com"
        ]
    },
    env: {
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
        FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,

        FIREBASE_MESSAGING_VAPID_KEY: process.env.FIREBASE_MESSAGING_VAPID_KEY,
        FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID
    }
}

module.exports = nextConfig
