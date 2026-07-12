import { useState } from "react";
import { saveCheckIn } from "./storage";
import guestsData from "./guests.json";
import { GuestDirectory, type GuestMatch } from "./guestsMatcher";

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
        <div style={styles.container}>
            <h1>Guest check-in</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your full name"
                    style={styles.input}
                    autoFocus
                />
                <button type="submit" style={styles.button}>
                    Find my seat
                </button>
            </form>

            {notFound && (
                <p style={styles.error}>
                    We couldn't find that name. Please check the spelling matches your
                    RSVP exactly (e.g. include your full name), then try again.
                </p>
            )}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        maxWidth: 420,
        margin: "0 auto",
        padding: "48px 20px",
        textAlign: "center",
        fontFamily: "sans-serif",
    },
    input: {
        width: "100%",
        padding: "14px 12px",
        fontSize: 16,          // must stay >=16px to prevent iOS auto-zoom on focus
        marginTop: 16,
        boxSizing: "border-box",
        borderRadius: 8,
        border: "1px solid #ccc",
    },
    button: {
        width: "100%",
        padding: "14px 12px",  // taller = easier thumb target
        fontSize: 16,
        marginTop: 12,
        cursor: "pointer",
        borderRadius: 8,
    },
    error: {
        color: "#b00020",
        marginTop: 16,
        fontSize: 15,
    },
};