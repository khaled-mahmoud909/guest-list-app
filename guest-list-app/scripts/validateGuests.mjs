import fs from "fs";

const guests = JSON.parse(fs.readFileSync("./src/guests.json", "utf-8"));
const ORDERED_TABLES = new Set([5, 6, 7, 8, 9]);
const errors = [];
const seenNames = new Set();

for (const guest of guests) {
    const key = guest.name.trim().toLowerCase().replace(/\s+/g, " ");

    if (seenNames.has(key)) {
        errors.push(`Duplicate name: "${guest.name}"`);
    }
    seenNames.add(key);

    if (!guest.table || guest.table < 1 || guest.table > 9) {
        errors.push(`Invalid table number for "${guest.name}": ${guest.table}`);
    }

    if (ORDERED_TABLES.has(guest.table)) {
        if (guest.side !== "left" && guest.side !== "right") {
            errors.push(`"${guest.name}" (table ${guest.table}) has invalid/missing side: ${guest.side}`);
        }
        if (!guest.position || guest.position < 1) {
            errors.push(`"${guest.name}" (table ${guest.table}) has invalid/missing position: ${guest.position}`);
        }
    }
}

if (errors.length > 0) {
    console.error(`Found ${errors.length} data error(s):\n`);
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
} else {
    console.log(`All ${guests.length} guest records look valid.`);
}