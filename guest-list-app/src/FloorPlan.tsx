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
                    {match.side && ` — seat ${match.position}`}
                </p>
                <button
                    onClick={onSearchDifferentName}
                    style={{ background: "none", border: "none", color: "#0066cc", textDecoration: "underline", cursor: "pointer" }}
                >
                    Not you? Search a different name
                </button>
            </div>

            <svg viewBox="0 0 1000 800" width="100%" style={{ border: "1px solid #ddd", background: "#fafafa" }}>
                {TABLES.map((table) => {
                    const isHighlighted = `table-${table.id}` === highlightedTableId;

                    if (table.type === "simple") {
                        return <SimpleTable key={table.id} table={table} isHighlighted={isHighlighted} />;
                    }
                    if (table.type === "vip") {
                        return (
                            <VipTable
                                key={table.id}
                                table={table}
                                isHighlighted={isHighlighted}
                                highlightedSeatId={highlightedSeatId}
                            />
                        );
                    }
                    return (
                        <OrderedTable
                            key={table.id}
                            table={table}
                            isHighlighted={isHighlighted}
                            highlightedSeatId={highlightedSeatId}
                        />
                    );
                })}
            </svg>
        </div>
    );
}

function SimpleTable({ table, isHighlighted }: { table: TableConfig; isHighlighted: boolean }) {
    return (
        <g id={`table-${table.id}`}>
            <rect
                x={table.x} y={table.y} width={table.width} height={table.height} rx={10}
                fill={isHighlighted ? "#ffe08a" : "#ffffff"}
                stroke={isHighlighted ? "#e0a800" : "#333"}
                strokeWidth={isHighlighted ? 4 : 2}
            />
            <text
                x={table.x + table.width / 2} y={table.y + table.height / 2}
                textAnchor="middle" dominantBaseline="central" fontSize={14}
                fontWeight={isHighlighted ? "bold" : "normal"} fill="#333"
            >
                {table.label}
            </text>
        </g>
    );
}

function OrderedTable({
    table, isHighlighted, highlightedSeatId,
}: {
    table: TableConfig; isHighlighted: boolean; highlightedSeatId: string | null;
}) {
    const leftSeats = table.leftSeats ?? 5;
    const rightSeats = table.rightSeats ?? 5;
    const leftSpacing = table.height / leftSeats;
    const rightSpacing = table.height / rightSeats;

    return (
        <g id={`table-${table.id}`}>
            <rect
                x={table.x} y={table.y} width={table.width} height={table.height} rx={8}
                fill={isHighlighted ? "#fff3d6" : "#ffffff"}
                stroke={isHighlighted ? "#e0a800" : "#333"}
                strokeWidth={isHighlighted ? 3 : 2}
            />
            <text
                x={table.x + table.width / 2} y={table.y - 10}
                textAnchor="middle" fontSize={13}
                fontWeight={isHighlighted ? "bold" : "normal"} fill="#333"
            >
                {table.label}
            </text>

            {Array.from({ length: leftSeats }).map((_, i) => {
                const seatId = `table-${table.id}-left-${i + 1}`;
                const isSeatHighlighted = seatId === highlightedSeatId;
                return (
                    <rect
                        key={seatId} id={seatId}
                        x={table.x - SEAT_SIZE - SEAT_GAP}
                        y={table.y + i * leftSpacing + (leftSpacing - SEAT_SIZE) / 2}
                        width={SEAT_SIZE} height={SEAT_SIZE} rx={3}
                        fill={isSeatHighlighted ? "#e0a800" : "#e0e0e0"}
                        stroke={isSeatHighlighted ? "#a37500" : "#666"}
                        strokeWidth={isSeatHighlighted ? 2 : 1}
                    />
                );
            })}

            {Array.from({ length: rightSeats }).map((_, i) => {
                const seatId = `table-${table.id}-right-${i + 1}`;
                const isSeatHighlighted = seatId === highlightedSeatId;
                return (
                    <rect
                        key={seatId} id={seatId}
                        x={table.x + table.width + SEAT_GAP}
                        y={table.y + i * rightSpacing + (rightSpacing - SEAT_SIZE) / 2}
                        width={SEAT_SIZE} height={SEAT_SIZE} rx={3}
                        fill={isSeatHighlighted ? "#e0a800" : "#e0e0e0"}
                        stroke={isSeatHighlighted ? "#a37500" : "#666"}
                        strokeWidth={isSeatHighlighted ? 2 : 1}
                    />
                );
            })}
        </g>
    );
}

// VIP table: 6 seats along the "near" side (facing tables 1-4, i.e. the top edge),
// 1 seat at each end (left edge = end1, right edge = end2)
function VipTable({
    table, isHighlighted, highlightedSeatId,
}: {
    table: TableConfig; isHighlighted: boolean; highlightedSeatId: string | null;
}) {
    const nearSeats = table.nearSeats ?? 6;
    const nearSpacing = table.width / nearSeats;

    const nearSeatId = (i: number) => `table-${table.id}-near-${i + 1}`;
    const end1SeatId = `table-${table.id}-end1-1`;
    const end2SeatId = `table-${table.id}-end2-1`;

    return (
        <g id={`table-${table.id}`}>
            <rect
                x={table.x} y={table.y} width={table.width} height={table.height} rx={26}
                fill={isHighlighted ? "#fff3d6" : "#ffffff"}
                stroke={isHighlighted ? "#e0a800" : "#333"}
                strokeWidth={isHighlighted ? 3 : 2}
            />
            <text
                x={table.x + table.width / 2}
                y={table.y + table.height / 2}
                textAnchor="middle" dominantBaseline="central" fontSize={13}
                fontWeight={isHighlighted ? "bold" : "normal"} fill="#333"
            >
                {table.label}
            </text>

            {/* 6 seats along the top ("near" tables 1-4) edge */}
            {Array.from({ length: nearSeats }).map((_, i) => {
                const seatId = nearSeatId(i);
                const isSeatHighlighted = seatId === highlightedSeatId;
                return (
                    <rect
                        key={seatId} id={seatId}
                        x={table.x + i * nearSpacing + (nearSpacing - SEAT_SIZE) / 2}
                        y={table.y - SEAT_SIZE - SEAT_GAP}
                        width={SEAT_SIZE} height={SEAT_SIZE} rx={3}
                        fill={isSeatHighlighted ? "#e0a800" : "#e0e0e0"}
                        stroke={isSeatHighlighted ? "#a37500" : "#666"}
                        strokeWidth={isSeatHighlighted ? 2 : 1}
                    />
                );
            })}

            {/* End 1 — left edge */}
            <rect
                id={end1SeatId}
                x={table.x - SEAT_SIZE - SEAT_GAP}
                y={table.y + table.height / 2 - SEAT_SIZE / 2}
                width={SEAT_SIZE} height={SEAT_SIZE} rx={3}
                fill={end1SeatId === highlightedSeatId ? "#e0a800" : "#e0e0e0"}
                stroke={end1SeatId === highlightedSeatId ? "#a37500" : "#666"}
                strokeWidth={end1SeatId === highlightedSeatId ? 2 : 1}
            />

            {/* End 2 — right edge */}
            <rect
                id={end2SeatId}
                x={table.x + table.width + SEAT_GAP}
                y={table.y + table.height / 2 - SEAT_SIZE / 2}
                width={SEAT_SIZE} height={SEAT_SIZE} rx={3}
                fill={end2SeatId === highlightedSeatId ? "#e0a800" : "#e0e0e0"}
                stroke={end2SeatId === highlightedSeatId ? "#a37500" : "#666"}
                strokeWidth={end2SeatId === highlightedSeatId ? 2 : 1}
            />
        </g>
    );
}