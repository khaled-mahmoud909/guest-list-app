export type TableType = "simple" | "round" | "ordered";

export interface TableConfig {
    id: number;
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    type: TableType;
    radius?: number;       // for "round" tables
    seats?: number;        // number of seats for "round" tables
    leftSeats?: number;    // for "ordered" tables
    rightSeats?: number;   // for "ordered" tables
}

export const TABLES: TableConfig[] = [
    // ── Left column (round tables 1-10) — staggered pattern ──
    { id: 1, label: "Table 1", x: 95, y: 350, width: 0, height: 0, type: "round", radius: 42, seats: 9 },
    { id: 2, label: "Table 2", x: 225, y: 430, width: 0, height: 0, type: "round", radius: 42, seats: 10 },
    { id: 3, label: "Table 3", x: 95, y: 510, width: 0, height: 0, type: "round", radius: 42, seats: 9 },
    { id: 4, label: "Table 4", x: 225, y: 590, width: 0, height: 0, type: "round", radius: 42, seats: 10 },
    { id: 5, label: "Table 5", x: 95, y: 670, width: 0, height: 0, type: "round", radius: 42, seats: 10 },
    { id: 6, label: "Table 6", x: 225, y: 750, width: 0, height: 0, type: "round", radius: 42, seats: 8 },
    { id: 7, label: "Table 7", x: 95, y: 830, width: 0, height: 0, type: "round", radius: 42, seats: 10 },
    { id: 8, label: "Table 8", x: 225, y: 910, width: 0, height: 0, type: "round", radius: 42, seats: 10 },
    { id: 9, label: "Table 9", x: 95, y: 990, width: 0, height: 0, type: "round", radius: 42, seats: 10 },
    { id: 10, label: "Table 10", x: 225, y: 1070, width: 0, height: 0, type: "round", radius: 42, seats: 5 },

    // ── Right column (round tables 11-20) — staggered pattern ──
    { id: 11, label: "Table 11", x: 905, y: 350, width: 0, height: 0, type: "round", radius: 42, seats: 10 },
    { id: 12, label: "Table 12", x: 775, y: 430, width: 0, height: 0, type: "round", radius: 42, seats: 7 },
    { id: 13, label: "Table 13", x: 905, y: 510, width: 0, height: 0, type: "round", radius: 42, seats: 10 },
    { id: 14, label: "Table 14", x: 775, y: 590, width: 0, height: 0, type: "round", radius: 42, seats: 10 },
    { id: 15, label: "Table 15", x: 905, y: 670, width: 0, height: 0, type: "round", radius: 42, seats: 10 },
    { id: 16, label: "Table 16", x: 775, y: 750, width: 0, height: 0, type: "round", radius: 42, seats: 9 },
    { id: 17, label: "Table 17", x: 905, y: 830, width: 0, height: 0, type: "round", radius: 42, seats: 10 },
    { id: 18, label: "Table 18", x: 775, y: 910, width: 0, height: 0, type: "round", radius: 42, seats: 10 },
    { id: 19, label: "Table 19", x: 905, y: 990, width: 0, height: 0, type: "round", radius: 42, seats: 10 },
    { id: 20, label: "Table 20", x: 775, y: 1070, width: 0, height: 0, type: "round", radius: 42, seats: 10 },

    // ── Viking (long) tables in center ──
    { id: 21, label: "Viking 1", x: 350, y: 460, width: 60, height: 270, type: "ordered", leftSeats: 8, rightSeats: 9 },
    { id: 22, label: "Viking 2", x: 350, y: 800, width: 60, height: 270, type: "ordered", leftSeats: 9, rightSeats: 9 },
    { id: 23, label: "Viking 3", x: 590, y: 460, width: 60, height: 270, type: "ordered", leftSeats: 9, rightSeats: 9 },
    { id: 24, label: "Viking 4", x: 590, y: 800, width: 60, height: 270, type: "ordered", leftSeats: 8, rightSeats: 9 },
];
