export interface Guest {
    name: string;
    table: number;
    side?: "left" | "right" | "near" | "end1" | "end2";
    position?: number;
}

/** The guest info passed around after a successful match. */
export interface GuestInfo {
    name: string;
    table: number;
    side?: "left" | "right" | "near" | "end1" | "end2";
    position?: number;
}

export type SearchResult =
    | { type: "exact"; guest: GuestInfo }
    | { type: "fuzzy"; guest: GuestInfo }
    | { type: "multiple"; guests: GuestInfo[] }
    | { type: "notFound" };

const ORDERED_TABLES = new Set([21, 22, 23, 24]);

/* ─── String helpers ─── */

function normalize(name: string): string {
    return name
        .normalize("NFKC")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

/** Reverse the word order: "khaled mahmoud" → "mahmoud khaled" */
function reverseWords(s: string): string {
    return s.split(" ").reverse().join(" ");
}

/** Extract the individual word tokens from a normalized name. */
function wordTokens(s: string): string[] {
    return s.split(" ").filter(Boolean);
}

/* ─── Levenshtein distance ─── */

function levenshtein(a: string, b: string): number {
    const m = a.length;
    const n = b.length;

    if (m === 0) return n;
    if (n === 0) return m;

    let prev = Array.from({ length: n + 1 }, (_, i) => i);
    let curr = new Array<number>(n + 1);

    for (let i = 1; i <= m; i++) {
        curr[0] = i;
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            curr[j] = Math.min(
                prev[j] + 1,       // deletion
                curr[j - 1] + 1,   // insertion
                prev[j - 1] + cost // substitution
            );
        }
        [prev, curr] = [curr, prev];
    }
    return prev[n];
}

/** Max Levenshtein distance allowed for full-name matching. */
function maxFullDistance(query: string): number {
    return query.length <= 8 ? 2 : 3;
}

/** Max Levenshtein distance allowed for single word matching. */
function maxWordDistance(word: string): number {
    if (word.length <= 3) return 0; // exact match only for very short words
    if (word.length <= 5) return 1; // max 1 typo
    return 2; // max 2 typos for longer words
}

export class GuestDirectory {
    private guests: GuestInfo[] = [];

    constructor(guests: Guest[]) {
        for (const guest of guests) {
            if (ORDERED_TABLES.has(guest.table)) {
                if (!guest.side || !guest.position) {
                    throw new Error(
                        `Data error: "${guest.name}" is at table ${guest.table} (seat order matters) but is missing side/position.`
                    );
                }
            }

            this.guests.push({
                name: guest.name,
                table: guest.table,
                side: guest.side,
                position: guest.position,
            });
        }
    }

    findGuest(enteredName: string): SearchResult {
        const input = normalize(enteredName);
        if (!input) return { type: "notFound" };

        const inputWords = wordTokens(input);

        // 1. Exact Match (full query matching name or reversed name exactly)
        for (const guest of this.guests) {
            const nameNorm = normalize(guest.name);
            if (input === nameNorm || input === reverseWords(nameNorm)) {
                return { type: "exact", guest };
            }
        }

        // 2. Sub-word Match (every query word is fully included in the guest's name words)
        const subWordMatches: GuestInfo[] = [];
        for (const guest of this.guests) {
            const guestWords = wordTokens(normalize(guest.name));
            // Check if every query word matches some guest word exactly
            const allMatched = inputWords.every((qw) => guestWords.includes(qw));
            if (allMatched) {
                subWordMatches.push(guest);
            }
        }

        if (subWordMatches.length === 1) {
            return { type: "exact", guest: subWordMatches[0] };
        }
        if (subWordMatches.length > 1) {
            return { type: "multiple", guests: subWordMatches };
        }

        // 3. Fuzzy Full-name Match (Levenshtein on the entire query against full name or reversed name)
        const threshold = maxFullDistance(input);
        let bestDistance = Infinity;
        let fuzzyCandidates: GuestInfo[] = [];

        for (const guest of this.guests) {
            const nameNorm = normalize(guest.name);
            const distNormal = levenshtein(input, nameNorm);
            const distReversed = levenshtein(input, reverseWords(nameNorm));
            const minDist = Math.min(distNormal, distReversed);

            if (minDist <= threshold) {
                if (minDist < bestDistance) {
                    bestDistance = minDist;
                    fuzzyCandidates = [guest];
                } else if (minDist === bestDistance) {
                    fuzzyCandidates.push(guest);
                }
            }
        }

        if (fuzzyCandidates.length === 1) {
            return { type: "fuzzy", guest: fuzzyCandidates[0] };
        }
        if (fuzzyCandidates.length > 1) {
            return { type: "multiple", guests: fuzzyCandidates };
        }

        // 4. Fuzzy Word-by-Word Match
        // Try to match each input word to a distinct word in the guest name using length-based thresholds
        const fuzzyWordCandidates: GuestInfo[] = [];
        for (const guest of this.guests) {
            const guestWords = [...wordTokens(normalize(guest.name))];

            // For each query word, find a matching guest word and consume it
            let matchCount = 0;
            for (const qw of inputWords) {
                const limit = maxWordDistance(qw);
                let foundIndex = -1;

                // Find a guest word closest to qw within limit
                for (let i = 0; i < guestWords.length; i++) {
                    const gw = guestWords[i];
                    const dist = levenshtein(qw, gw);
                    if (dist <= limit) {
                        foundIndex = i;
                        break;
                    }
                }

                if (foundIndex !== -1) {
                    matchCount++;
                    guestWords.splice(foundIndex, 1); // consume the matched word
                }
            }

            // If we successfully matched every query word to a unique guest word fuzzy-wise
            if (matchCount === inputWords.length) {
                fuzzyWordCandidates.push(guest);
            }
        }

        if (fuzzyWordCandidates.length === 1) {
            return { type: "fuzzy", guest: fuzzyWordCandidates[0] };
        }
        if (fuzzyWordCandidates.length > 1) {
            return { type: "multiple", guests: fuzzyWordCandidates };
        }

        return { type: "notFound" };
    }
}