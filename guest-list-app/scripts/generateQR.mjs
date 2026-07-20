import QRCode from "qrcode";
import fs from "fs";

// Replace with your actual deployed Vercel URL once you have it
const CHECKIN_URL = "https://seanandvanessafms.vercel.app/";

const outputDir = "./qr-output";
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// High-resolution PNG, good for print
await QRCode.toFile(`${outputDir}/checkin-qr.png`, CHECKIN_URL, {
    width: 1000,
    margin: 2,
    errorCorrectionLevel: "H", // more resilient to smudges/print quality issues
});

// Also generate an SVG (scales cleanly if you want to put it on a banner/sign)
await QRCode.toFile(`${outputDir}/checkin-qr.svg`, CHECKIN_URL, {
    type: "svg",
    margin: 2,
    errorCorrectionLevel: "H",
});

console.log(`QR code generated for: ${CHECKIN_URL}`);
console.log(`Files saved to ${outputDir}/`);