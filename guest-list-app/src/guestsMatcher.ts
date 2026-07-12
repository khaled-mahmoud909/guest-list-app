export interface Guest {
    name: string;
    table: number;
    side?: "left" | "right";
    position?: number;
}

export interface GuestMatch {
    found: boolean;
    name?: string;
    table?: number;
    side?: "left" | "right";
    position?: number;
}

const ORDERED_TABLES = new Set([5, 6, 7, 8, 9]);

function normalize(name: string): string {
    return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export class GuestDirectory {
    private byName: Map<string, Guest> = new Map();

    constructor(guests: Guest[]) {
        for (const guest of guests) {
            const key = normalize(guest.name);

            if (ORDERED_TABLES.has(guest.table)) {
                if (!guest.side || !guest.position) {
                    throw new Error(
                        `Guest "${guest.name}" is at table ${guest.table} (seat order matters) but is missing side/position.`
                    );
                }
            }

            if (this.byName.has(key)) {
                // Don't hard-crash the whole app on a duplicate — flag it instead,
                // since a wedding guest list realistically may have near-duplicate names.
                console.warn(`Duplicate name in guest list: "${guest.name}"`);
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