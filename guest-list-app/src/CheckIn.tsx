import { useState, useEffect } from "react";
import guestsData from "./guests.json";
import { GuestDirectory, type GuestMatch } from "./guestsMatcher";

const directory = new GuestDirectory(guestsData as any);
const STORAGE_KEY = "checkedInGuest";

function saveToStorage(match: GuestMatch) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(match));
}

function loadFromStorage(): GuestMatch | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as GuestMatch;
    } catch {
        return null;
    }
}

function clearStorage() {
    localStorage.removeItem(STORAGE_KEY);
}

export default function CheckIn() {
    const [savedMatch, setSavedMatch] = useState<GuestMatch | null>(null);
    const [nameInput, setNameInput] = useState("");
    const [activeMatch, setActiveMatch] = useState<GuestMatch | null>(null);
    const [notFound, setNotFound] = useState(false);

    // On load, check if this guest already checked in before
    useEffect(() => {
        const saved = loadFromStorage();
        if (saved) setSavedMatch(saved);
    }, []);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const result = directory.findGuest(nameInput);

        if (!result.found) {
            setNotFound(true);
            setActiveMatch(null);
            return;
        }

        setNotFound(false);
        setActiveMatch(result);
        saveToStorage(result);
        setSavedMatch(result);
    }

    function handleSearchDifferentName() {
        clearStorage();
        setSavedMatch(null);
        setActiveMatch(null);
        setNameInput("");
        setNotFound(false);
    }

    // --- Welcome back screen (returning guest, no active new search) ---
    if (savedMatch && !activeMatch) {
        return (
            <div style={styles.container} >
                <h1>Welcome back, {savedMatch.name} </h1>
                < SeatResult match={savedMatch} />
                <button style={styles.linkButton} onClick={handleSearchDifferentName} >
                    Not you ? Search a different name
                </button>
            </div>
        );
    }

    // --- Just-found result (fresh check-in) ---
    if (activeMatch) {
        return (
            <div style={styles.container} >
                <h1>You're all set, {activeMatch.name}!</h1>
                < SeatResult match={activeMatch} />
            </div>
        );
    }

    // --- Name entry form ---
    return (
        <div style={styles.container} >
            <h1>Guest check -in </h1>
            < form onSubmit={handleSubmit} >
                <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)
                    }
                    placeholder="Enter your full name"
                    style={styles.input}
                    autoFocus
                />
                <button type="submit" style={styles.button} >
                    Find my seat
                </button>
            </form>

            {
                notFound && (
                    <p style={styles.error}>
                        We couldn't find that name. Please check the spelling matches your
                        RSVP exactly(e.g.include your full name), then try again.
                    </p>
                )
            }
        </div>
    );
}

function SeatResult({ match }: { match: GuestMatch }) {
    if (match.side) {
        return (
            <p style={styles.result} >
                Table {match.table} — {match.side === "left" ? "Left" : "Right"} side,
                seat {match.position}
            </p>
        );
    }
    return <p style={styles.result}> Table {match.table} </p>;
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        maxWidth: 400,
        margin: "80px auto",
        padding: 24,
        textAlign: "center",
        fontFamily: "sans-serif",
    },
    input: {
        width: "100%",
        padding: 12,
        fontSize: 16,
        marginTop: 16,
        boxSizing: "border-box",
    },
    button: {
        width: "100%",
        padding: 12,
        fontSize: 16,
        marginTop: 12,
        cursor: "pointer",
    },
    result: {
        fontSize: 22,
        margin: "24px 0",
    },
    error: {
        color: "#b00020",
        marginTop: 16,
    },
    linkButton: {
        background: "none",
        border: "none",
        color: "#0066cc",
        textDecoration: "underline",
        cursor: "pointer",
        marginTop: 16,
    },
};