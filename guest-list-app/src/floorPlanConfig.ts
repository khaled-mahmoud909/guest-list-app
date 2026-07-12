export interface TableConfig {
    id: number;
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    ordered: boolean; // true = seat order matters (tables 5-9)
    seatsPerSide?: number; // only for ordered tables
}

export const TABLES: TableConfig[] = [
    // Top row
    { id: 1, label: "Table 1 (10 pax)", x: 60, y: 40, width: 220, height: 90, ordered: false },
    { id: 2, label: "Table 2 (10 pax)", x: 340, y: 40, width: 220, height: 90, ordered: false },
    { id: 3, label: "Table 3 (10 pax)", x: 620, y: 40, width: 220, height: 90, ordered: false },

    // Middle long table
    { id: 4, label: "Table 4 (30 pax)", x: 220, y: 190, width: 500, height: 80, ordered: false },

    // Bottom row
    { id: 5, label: "Table 5 (10 pax)", x: 60, y: 480, width: 90, height: 220, ordered: true, seatsPerSide: 5 },
    { id: 6, label: "Table 6 (20 pax)", x: 260, y: 460, width: 90, height: 260, ordered: true, seatsPerSide: 10 },
    { id: 7, label: "Table 7 (20 pax)", x: 460, y: 460, width: 90, height: 260, ordered: true, seatsPerSide: 10 },
    { id: 8, label: "Table 8 (21 pax)", x: 660, y: 460, width: 90, height: 260, ordered: true, seatsPerSide: 10 },
    { id: 9, label: "Table 9 (20 pax)", x: 860, y: 460, width: 90, height: 260, ordered: true, seatsPerSide: 10 },
];