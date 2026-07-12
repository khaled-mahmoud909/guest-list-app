import { useEffect } from "react";
import { TABLES, type TableConfig } from "./floorPlanConfig";
import type { GuestMatch } from "./guestsMatcher";

const SEAT_SIZE = 16;
const SEAT_GAP = 4;

interface Props {
    match: GuestMatch;
    onSearchDifferentName: () => void;
}

export default function FloorPlan({ match, onSearchDifferentName }: Props) {
    const highlightedTableId = `table-${match.table}`;
    const highlightedSeatId = match.side
        ? `table-${match.table}-${match.side}-${match.position}`
        : null;

    // Auto-scroll the highlighted table into view once rendered
    useEffect(() => {
        const el = document.getElementById(highlightedTableId);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [highlightedTableId]);

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
            <div style={{ textAlign: "center", fontFamily: "sans-serif", marginBottom: 12 }}>
                <h1 style={{ marginBottom: 4 }}>Welcome, {match.name}</h1>
                <p style={{ fontSize: 18 }}>
                    Table {match.table}
                    {match.side && ` — ${match.side === "left" ? "Left" : "Right"} side, seat ${match.position}`}
                </p>
                <button
                    onClick={onSearchDifferentName}
                    style={{
                        background: "none",
                        border: "none",
                        color: "#0066cc",
                        textDecoration: "underline",
                        cursor: "pointer",
                    }}
                >
                    Not you? Search a different name
                </button>
            </div>

            <svg
                viewBox="0 0 1000 800"
                width="100%"
                style={{ border: "1px solid #ddd", background: "#fafafa" }}
            >
                {TABLES.map((table) =>
                    table.ordered ? (
                        <OrderedTable
                            key={table.id}
                            table={table}
                            isHighlighted={`table-${table.id}` === highlightedTableId}
                            highlightedSeatId={highlightedSeatId}
                        />
                    ) : (
                        <SimpleTable
                            key={table.id}
                            table={table}
                            isHighlighted={`table-${table.id}` === highlightedTableId}
                        />
                    )
                )}
            </svg>
        </div>
    );
}

function SimpleTable({
    table,
    isHighlighted,
}: {
    table: TableConfig;
    isHighlighted: boolean;
}) {
    return (
        <g id={`table-${table.id}`}>
            <rect
                x={table.x}
                y={table.y}
                width={table.width}
                height={table.height}
                rx={10}
                fill={isHighlighted ? "#ffe08a" : "#ffffff"}
                stroke={isHighlighted ? "#e0a800" : "#333"}
                strokeWidth={isHighlighted ? 4 : 2}
            />
            <text
                x={table.x + table.width / 2}
                y={table.y + table.height / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={14}
                fontWeight={isHighlighted ? "bold" : "normal"}
                fill="#333"
            >
                {table.label}
            </text>
        </g>
    );
}

function OrderedTable({
    table,
    isHighlighted,
    highlightedSeatId,
}: {
    table: TableConfig;
    isHighlighted: boolean;
    highlightedSeatId: string | null;
}) {
    const seatsPerSide = table.seatsPerSide ?? 5;
    const seatSpacing = table.height / seatsPerSide;

    return (
        <g id={`table-${table.id}`}>
            <rect
                x={table.x}
                y={table.y}
                width={table.width}
                height={table.height}
                rx={8}
                fill={isHighlighted ? "#fff3d6" : "#ffffff"}
                stroke={isHighlighted ? "#e0a800" : "#333"}
                strokeWidth={isHighlighted ? 3 : 2}
            />
            <text
                x={table.x + table.width / 2}
                y={table.y - 10}
                textAnchor="middle"
                fontSize={13}
                fontWeight={isHighlighted ? "bold" : "normal"}
                fill="#333"
            >
                {table.label}
            </text>

            {Array.from({ length: seatsPerSide }).map((_, i) => {
                const seatId = `table-${table.id}-left-${i + 1}`;
                const isSeatHighlighted = seatId === highlightedSeatId;
                return (
                    <rect
                        key={seatId}
                        id={seatId}
                        x={table.x - SEAT_SIZE - SEAT_GAP}
                        y={table.y + i * seatSpacing + (seatSpacing - SEAT_SIZE) / 2}
                        width={SEAT_SIZE}
                        height={SEAT_SIZE}
                        rx={3}
                        fill={isSeatHighlighted ? "#e0a800" : "#e0e0e0"}
                        stroke={isSeatHighlighted ? "#a37500" : "#666"}
                        strokeWidth={isSeatHighlighted ? 2 : 1}
                    />
                );
            })}

            {Array.from({ length: seatsPerSide }).map((_, i) => {
                const seatId = `table-${table.id}-right-${i + 1}`;
                const isSeatHighlighted = seatId === highlightedSeatId;
                return (
                    <rect
                        key={seatId}
                        id={seatId}
                        x={table.x + table.width + SEAT_GAP}
                        y={table.y + i * seatSpacing + (seatSpacing - SEAT_SIZE) / 2}
                        width={SEAT_SIZE}
                        height={SEAT_SIZE}
                        rx={3}
                        fill={isSeatHighlighted ? "#e0a800" : "#e0e0e0"}
                        stroke={isSeatHighlighted ? "#a37500" : "#666"}
                        strokeWidth={isSeatHighlighted ? 2 : 1}
                    />
                );
            })}
        </g>
    );
}