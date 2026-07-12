export type TableType = "simple" | "ordered" | "vip";

export interface TableConfig {
    id: number;
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    type: TableType;
    leftSeats?: number;   // for "ordered" tables
    rightSeats?: number;  // for "ordered" tables
    nearSeats?: number;   // for "vip" table (the 6-seat side)
}

export const TABLES: TableConfig[] = [
    // Top row
    { id: 1, label: "Table 1 (10 pax)", x: 60, y: 40, width: 220, height: 90, type: "simple" },
    { id: 2, label: "Table 2 (10 pax)", x: 340, y: 40, width: 220, height: 90, type: "simple" },
    { id: 3, label: "Table 3 (10 pax)", x: 620, y: 40, width: 220, height: 90, type: "simple" },

    // Middle long table
    { id: 4, label: "Table 4 (30 pax)", x: 220, y: 190, width: 500, height: 80, type: "simple" },

    // VIP table — sits between Table 4 and the 5-9 row, matching the floor plan's oval placement
    { id: 10, label: "VIP (8 pax)", x: 360, y: 330, width: 280, height: 70, type: "vip", nearSeats: 6 },

    // Bottom row
    { id: 5, label: "Table 5 (10 pax)", x: 60, y: 480, width: 90, height: 220, type: "ordered", leftSeats: 5, rightSeats: 5 },
    { id: 6, label: "Table 6 (20 pax)", x: 260, y: 460, width: 90, height: 260, type: "ordered", leftSeats: 10, rightSeats: 10 },
    { id: 7, label: "Table 7 (20 pax)", x: 460, y: 460, width: 90, height: 260, type: "ordered", leftSeats: 10, rightSeats: 10 },
    { id: 8, label: "Table 8 (21 pax)", x: 660, y: 460, width: 90, height: 260, type: "ordered", leftSeats: 10, rightSeats: 11 },
    { id: 9, label: "Table 9 (22 pax)", x: 860, y: 460, width: 90, height: 260, type: "ordered", leftSeats: 11, rightSeats: 11 },
];