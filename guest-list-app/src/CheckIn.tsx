import { useState } from "react";
import guestsData from "./guests.json";
import { GuestDirectory, type GuestMatch } from "./guestsMatcher";
import { saveCheckIn } from "./storage";
import { theme } from "./theme";

const directory = new GuestDirectory(guestsData as any);

interface Props {
    onFound: (match: GuestMatch) => void;
}

export default function CheckIn({ onFound }: Props) {
    const [nameInput, setNameInput] = useState("");
    const [notFound, setNotFound] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const result = directory.findGuest(nameInput);

        if (!result.found) {
            setNotFound(true);
            return;
        }

        setNotFound(false);
        saveCheckIn(result);
        onFound(result);
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <p style={styles.bigDay}>The Big Day</p>
                <h2 style={styles.coupleNames}>Joseph &amp; Nicole</h2>

                <div style={styles.divider} />

                <p style={styles.eyebrow}>Guest Check-In</p>
                <h1 style={styles.heading}>Find Your Seat</h1>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Enter your full name"
                        style={styles.input}
                        autoFocus
                    />
                    <button type="submit" className="btn btn-primary" style={styles.button}>
                        Find My Seat
                    </button>
                </form>

                {notFound && (
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
};