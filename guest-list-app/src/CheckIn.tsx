import { useState } from "react";
import guestsData from "./guests.json";
import { GuestDirectory, type GuestInfo } from "./guestsMatcher";
import { saveCheckIn } from "./storage";
import { theme } from "./theme";

const directory = new GuestDirectory(guestsData as any);

interface Props {
    onFound: (match: GuestInfo) => void;
}

export default function CheckIn({ onFound }: Props) {
    const [nameInput, setNameInput] = useState("");
    const [notFound, setNotFound] = useState(false);
    const [fuzzyMatch, setFuzzyMatch] = useState<GuestInfo | null>(null);
    const [multipleMatches, setMultipleMatches] = useState<GuestInfo[]>([]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setNotFound(false);
        setFuzzyMatch(null);
        setMultipleMatches([]);

        const result = directory.findGuest(nameInput);

        if (result.type === "notFound") {
            setNotFound(true);
        } else if (result.type === "exact") {
            handleSelectGuest(result.guest);
        } else if (result.type === "fuzzy") {
            setFuzzyMatch(result.guest);
        } else if (result.type === "multiple") {
            setMultipleMatches(result.guests);
        }
    }

    function handleSelectGuest(guest: GuestInfo) {
        saveCheckIn(guest);
        onFound(guest);
    }

    const showSearchForm = !fuzzyMatch && multipleMatches.length === 0;

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <p style={styles.bigDay}>The Big Day</p>
                <h2 style={styles.coupleNames}>Joseph &amp; Nicole</h2>

                <div style={styles.divider} />

                <p style={styles.eyebrow}>Guest Check-In</p>
                <h1 style={styles.heading}>Find Your Seat</h1>

                {showSearchForm && (
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <input
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            placeholder="Enter your name"
                            style={styles.input}
                            autoFocus
                        />
                        <button type="submit" className="btn btn-primary" style={styles.button}>
                            Find My Seat
                        </button>
                    </form>
                )}

                {/* Fuzzy Match Did You Mean UI */}
                {fuzzyMatch && (
                    <div style={styles.promptContainer}>
                        <p style={styles.promptText}>Did you mean:</p>
                        <p style={styles.fuzzyName}>{fuzzyMatch.name}?</p>
                        <div style={styles.buttonGroup}>
                            <button
                                onClick={() => handleSelectGuest(fuzzyMatch)}
                                className="btn btn-primary"
                                style={styles.promptBtn}
                            >
                                Yes, that's me
                            </button>
                            <button
                                onClick={() => setFuzzyMatch(null)}
                                className="btn btn-secondary"
                                style={styles.promptBtnSecondary}
                            >
                                No, try again
                            </button>
                        </div>
                    </div>
                )}

                {/* Multiple Matches Partial Search UI */}
                {multipleMatches.length > 0 && (
                    <div style={styles.promptContainer}>
                        <p style={styles.promptText}>Please select your name:</p>
                        <div style={styles.listContainer}>
                            {multipleMatches.map((guest, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectGuest(guest)}
                                    className="btn btn-secondary"
                                    style={styles.listBtn}
                                >
                                    {guest.name}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setMultipleMatches([])}
                            className="btn btn-secondary"
                            style={styles.backBtn}
                        >
                            None of these, search again
                        </button>
                    </div>
                )}

                {notFound && showSearchForm && (
                    <p style={styles.error}>
                        We couldn't find that name. Please check the spelling matches
                        your RSVP exactly, then try again.
                    </p>
                )}
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: "100vh",
        background: theme.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    container: {
        maxWidth: 380,
        width: "100%",
        textAlign: "center",
        fontFamily: theme.fonts.body,
    },
    bigDay: {
        fontSize: 13,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: theme.colors.textMuted,
        margin: "0 0 6px 0",
    },
    coupleNames: {
        fontFamily: theme.fonts.heading,
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: 28,
        color: theme.colors.primary,
        margin: 0,
    },
    divider: {
        width: 40,
        height: 1,
        background: theme.colors.border,
        margin: "24px auto",
    },
    eyebrow: {
        fontSize: 13,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: theme.colors.textMuted,
        marginBottom: 8,
    },
    heading: {
        fontFamily: theme.fonts.heading,
        fontSize: 34,
        fontWeight: 500,
        color: theme.colors.primary,
        margin: "0 0 28px 0",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },
    input: {
        padding: "14px 16px",
        fontSize: 16,
        fontFamily: theme.fonts.body,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 4,
        background: theme.colors.surface,
        color: theme.colors.text,
        boxSizing: "border-box",
    },
    button: {
        padding: "14px 16px",
        fontSize: 14,
        fontFamily: theme.fonts.body,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        fontWeight: 500,
        borderRadius: 4,
    },
    error: {
        marginTop: 16,
        fontSize: 14,
        color: theme.colors.error,
        fontFamily: theme.fonts.body,
        lineHeight: 1.5,
    },
    promptContainer: {
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 8,
        padding: "24px 20px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        width: "100%",
    },
    promptText: {
        fontSize: 14,
        color: theme.colors.textMuted,
        margin: 0,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
    },
    fuzzyName: {
        fontFamily: theme.fonts.heading,
        fontSize: 24,
        color: theme.colors.primary,
        fontWeight: 500,
        margin: "0 0 4px 0",
    },
    buttonGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },
    promptBtn: {
        padding: "12px 16px",
        fontSize: 14,
        fontFamily: theme.fonts.body,
        fontWeight: 500,
        letterSpacing: "0.05em",
        borderRadius: 4,
        width: "100%",
    },
    promptBtnSecondary: {
        padding: "12px 16px",
        fontSize: 13,
        fontFamily: theme.fonts.body,
        letterSpacing: "0.05em",
        color: theme.colors.textMuted,
        border: `1px solid ${theme.colors.border}`,
        background: "transparent",
        borderRadius: 4,
        width: "100%",
    },
    listContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxHeight: 240,
        overflowY: "auto",
        paddingRight: 4,
    },
    listBtn: {
        padding: "11px 14px",
        fontSize: 14,
        fontFamily: theme.fonts.body,
        color: theme.colors.text,
        border: `1px solid ${theme.colors.border}`,
        background: theme.colors.surface,
        borderRadius: 4,
        textAlign: "left",
        width: "100%",
        display: "block",
    },
    backBtn: {
        padding: "10px 14px",
        fontSize: 12,
        fontFamily: theme.fonts.body,
        color: theme.colors.textMuted,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        marginTop: 4,
    },
};