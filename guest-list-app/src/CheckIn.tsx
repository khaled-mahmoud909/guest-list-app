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
    error: {
        color: "#b00020",
        marginTop: 16,
    },
};