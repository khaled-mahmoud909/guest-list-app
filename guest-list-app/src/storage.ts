const STORAGE_KEY = "checkedInGuest";

export function saveCheckIn(data: unknown): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // Storage unavailable (private browsing, storage disabled, quota exceeded).
        // Not fatal — the guest just won't get the "welcome back" shortcut on rescan,
        // they'll re-enter their name instead. Fail silently rather than crash.
    }
}

export function loadCheckIn<T>(): T | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as T) : null;
    } catch {
        return null;
    }
}

export function clearCheckIn(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // ignore
    }
}