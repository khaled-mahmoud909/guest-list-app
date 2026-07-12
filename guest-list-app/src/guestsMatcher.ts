export interface Guest {
    name: string;
    table: number;
    side?: "left" | "right" | "near" | "end1" | "end2";
    position?: number;
}

export interface GuestMatch {
    found: boolean;
    name?: string;
    table?: number;
    side?: "left" | "right" | "near" | "end1" | "end2";
    position?: number;
}

const ORDERED_TABLES = new Set([5, 6, 7, 8, 9, 10]);

function normalize(name: string): string {
    return name
        .normalize("NFKC")          // handles curly quotes / unicode variants from mobile keyboards
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

export class GuestDirectory {
    private byName: Map<string, Guest> = new Map();

    constructor(guests: Guest[]) {
        for (const guest of guests) {
            const key = normalize(guest.name);

            if (ORDERED_TABLES.has(guest.table)) {
                if (!guest.side || !guest.position) {
                    throw new Error(
                        `Data error: "${guest.name}" is at table ${guest.table} (seat order matters) but is missing side/position.`
                    );
                }
            }

            if (this.byName.has(key)) {
                throw new Error(
                    `Data error: duplicate name detected — "${guest.name}" collides with an existing entry. ` +
                    `Since duplicates shouldn't exist in this guest list, check for a typo or accidental repeated row.`
                );
            }

            this.byName.set(key, guest);
        }
    }

    findGuest(enteredName: string): GuestMatch {
        const key = normalize(enteredName);
        const guest = this.byName.get(key);

        if (!guest) {
            return { found: false };
        }

        return {
            found: true,
            name: guest.name,
            table: guest.table,
            side: guest.side,
            position: guest.position,
        };
    }
}