import { useEffect } from "react";
import { TABLES, type TableConfig } from "./floorPlanConfig";
import { type GuestInfo } from "./guestsMatcher";
import { theme } from "./theme";

const SEAT_RADIUS = 9;
const SEAT_GAP = 6;

interface Props {
    match: GuestInfo;
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
        <div style={{ minHeight: "100vh", background: theme.colors.background, fontFamily: theme.fonts.body }}>
            <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <p style={{
                        fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase",
                        color: theme.colors.textMuted, margin: 0,
                    }}>Welcome</p>
                    <h1 style={{
                        fontFamily: theme.fonts.heading, fontSize: 36, fontWeight: 500,
                        color: theme.colors.primary, margin: "6px 0 6px",
                    }}>{match.name}</h1>

                    {/* Decorative flourish */}
                    <svg width="120" height="16" viewBox="0 0 120 16" style={{ display: "block", margin: "4px auto 14px" }}>
                        <line x1="0" y1="8" x2="45" y2="8" stroke={theme.colors.border} strokeWidth="1" />
                        <circle cx="52" cy="8" r="2" fill={theme.colors.primary} opacity="0.5" />
                        <circle cx="60" cy="8" r="3" fill={theme.colors.primary} />
                        <circle cx="68" cy="8" r="2" fill={theme.colors.primary} opacity="0.5" />
                        <line x1="75" y1="8" x2="120" y2="8" stroke={theme.colors.border} strokeWidth="1" />
                    </svg>

                    <p style={{
                        fontSize: 17, color: theme.colors.text, margin: "0 0 20px",
                        fontWeight: 400,
                    }}>
                        Table <strong>{match.table}</strong>
                        {match.side && <> — Seat <strong>{match.position}</strong></>}
                    </p>
                    <button
                        onClick={onSearchDifferentName}
                        className="btn btn-secondary"
                        style={{
                            fontFamily: theme.fonts.body, fontSize: 13,
                            letterSpacing: "0.08em", textTransform: "uppercase",
                            padding: "10px 24px", borderRadius: 4,
                        }}
                    >
                        Not You? Search a Different Name
                    </button>
                </div>

                {/* Floor Plan SVG */}
                <svg
                    viewBox="0 0 1000 800"
                    width="100%"
                    style={{
                        background: theme.colors.surface,
                        borderRadius: 12,
                        boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
                        border: `1px solid ${theme.colors.border}`,
                    }}
                >
                    <defs>
                        {/* Drop shadow for tables */}
                        <filter id="tableShadow" x="-10%" y="-10%" width="130%" height="140%">
                            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#3A3826" floodOpacity="0.08" />
                        </filter>
                        {/* Glow for highlighted table */}
                        <filter id="highlightGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor={theme.colors.primary} floodOpacity="0.3" />
                        </filter>
                        {/* Glow for highlighted seat */}
                        <filter id="seatGlow" x="-60%" y="-60%" width="220%" height="220%">
                            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={theme.colors.primary} floodOpacity="0.5" />
                        </filter>
                        {/* Subtle floor grid pattern */}
                        <pattern id="floorGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <rect width="40" height="40" fill="none" />
                            <line x1="40" y1="0" x2="40" y2="40" stroke={theme.colors.border} strokeWidth="0.3" strokeOpacity="0.4" />
                            <line x1="0" y1="40" x2="40" y2="40" stroke={theme.colors.border} strokeWidth="0.3" strokeOpacity="0.4" />
                        </pattern>
                    </defs>

                    {/* Floor background with subtle grid */}
                    <rect width="1000" height="800" fill="url(#floorGrid)" rx="12" />

                    {/* Decorative border inset */}
                    <rect x="16" y="16" width="968" height="768" rx="8" fill="none"
                        stroke={theme.colors.border} strokeWidth="0.5" strokeDasharray="6 4" strokeOpacity="0.5" />

                    {TABLES.map((table) => {
                        const isHighlighted = `table-${table.id}` === highlightedTableId;
                        if (table.type === "simple") {
                            return <SimpleTable key={table.id} table={table} isHighlighted={isHighlighted} />;
                        }
                        if (table.type === "vip") {
                            return <VipTable key={table.id} table={table} isHighlighted={isHighlighted} highlightedSeatId={highlightedSeatId} />;
                        }
                        return <OrderedTable key={table.id} table={table} isHighlighted={isHighlighted} highlightedSeatId={highlightedSeatId} />;
                    })}
                </svg>
            </div>
        </div>
    );
}

/* ─── Helpers ─── */

function splitLabel(label: string): { name: string; pax: string } {
    const m = label.match(/^(.+?)\s*(\(.+\))$/);
    return m ? { name: m[1], pax: m[2] } : { name: label, pax: "" };
}

/* ─── Simple Table ─── */

function SimpleTable({ table, isHighlighted }: { table: TableConfig; isHighlighted: boolean }) {
    const { name, pax } = splitLabel(table.label);
    return (
        <g id={`table-${table.id}`} filter={isHighlighted ? "url(#highlightGlow)" : "url(#tableShadow)"}>
            <rect
                x={table.x} y={table.y} width={table.width} height={table.height} rx={14}
                fill={isHighlighted ? theme.colors.surfaceMuted : theme.colors.surface}
                stroke={isHighlighted ? theme.colors.primary : theme.colors.border}
                strokeWidth={isHighlighted ? 2.5 : 1}
            />
            <text
                x={table.x + table.width / 2} y={table.y + table.height / 2 - 7}
                textAnchor="middle" dominantBaseline="central" fontSize={14}
                fontFamily={theme.fonts.body}
                fontWeight={isHighlighted ? 600 : 500}
                fill={isHighlighted ? theme.colors.primary : theme.colors.text}
            >
                {name}
            </text>
            <text
                x={table.x + table.width / 2} y={table.y + table.height / 2 + 12}
                textAnchor="middle" dominantBaseline="central" fontSize={11}
                fontFamily={theme.fonts.body}
                fill={theme.colors.textMuted}
            >
                {pax}
            </text>
        </g>
    );
}

/* ─── Ordered Table ─── */

function OrderedTable({
    table, isHighlighted, highlightedSeatId,
}: { table: TableConfig; isHighlighted: boolean; highlightedSeatId: string | null }) {
    const leftSeats = table.leftSeats ?? 5;
    const rightSeats = table.rightSeats ?? 5;
    const leftSpacing = table.height / leftSeats;
    const rightSpacing = table.height / rightSeats;
    const { name, pax } = splitLabel(table.label);

    return (
        <g id={`table-${table.id}`}>
            {/* Table body */}
            <rect
                x={table.x} y={table.y} width={table.width} height={table.height} rx={12}
                fill={isHighlighted ? theme.colors.surfaceMuted : theme.colors.surface}
                stroke={isHighlighted ? theme.colors.primary : theme.colors.border}
                strokeWidth={isHighlighted ? 2.5 : 1}
                filter={isHighlighted ? "url(#highlightGlow)" : "url(#tableShadow)"}
            />
            {/* Label above table */}
            <text
                x={table.x + table.width / 2} y={table.y - 16}
                textAnchor="middle" fontSize={13} fontFamily={theme.fonts.body}
                fontWeight={isHighlighted ? 600 : 500}
                fill={isHighlighted ? theme.colors.primary : theme.colors.text}
            >
                {name}
            </text>
            <text
                x={table.x + table.width / 2} y={table.y - 3}
                textAnchor="middle" fontSize={10} fontFamily={theme.fonts.body}
                fill={theme.colors.textMuted}
            >
                {pax}
            </text>

            {/* Left seats */}
            {Array.from({ length: leftSeats }).map((_, i) => {
                const seatId = `table-${table.id}-left-${i + 1}`;
                const isSeatHighlighted = seatId === highlightedSeatId;
                const cx = table.x - SEAT_RADIUS - SEAT_GAP;
                const cy = table.y + i * leftSpacing + leftSpacing / 2;
                return (
                    <g key={seatId}>
                        <circle
                            id={seatId} cx={cx} cy={cy} r={SEAT_RADIUS}
                            fill={isSeatHighlighted ? theme.colors.primary : theme.colors.surfaceMuted}
                            stroke={isSeatHighlighted ? theme.colors.primaryDark : theme.colors.border}
                            strokeWidth={isSeatHighlighted ? 2 : 0.8}
                            filter={isSeatHighlighted ? "url(#seatGlow)" : undefined}
                        />
                        {isSeatHighlighted && (
                            <circle cx={cx} cy={cy} r={SEAT_RADIUS + 4}
                                fill="none" stroke={theme.colors.primary} strokeWidth="1.5"
                                strokeDasharray="3 3" opacity="0.5" />
                        )}
                    </g>
                );
            })}

            {/* Right seats */}
            {Array.from({ length: rightSeats }).map((_, i) => {
                const seatId = `table-${table.id}-right-${i + 1}`;
                const isSeatHighlighted = seatId === highlightedSeatId;
                const cx = table.x + table.width + SEAT_RADIUS + SEAT_GAP;
                const cy = table.y + i * rightSpacing + rightSpacing / 2;
                return (
                    <g key={seatId}>
                        <circle
                            id={seatId} cx={cx} cy={cy} r={SEAT_RADIUS}
                            fill={isSeatHighlighted ? theme.colors.primary : theme.colors.surfaceMuted}
                            stroke={isSeatHighlighted ? theme.colors.primaryDark : theme.colors.border}
                            strokeWidth={isSeatHighlighted ? 2 : 0.8}
                            filter={isSeatHighlighted ? "url(#seatGlow)" : undefined}
                        />
                        {isSeatHighlighted && (
                            <circle cx={cx} cy={cy} r={SEAT_RADIUS + 4}
                                fill="none" stroke={theme.colors.primary} strokeWidth="1.5"
                                strokeDasharray="3 3" opacity="0.5" />
                        )}
                    </g>
                );
            })}
        </g>
    );
}

/* ─── VIP Table ─── */

function VipTable({
    table, isHighlighted, highlightedSeatId,
}: { table: TableConfig; isHighlighted: boolean; highlightedSeatId: string | null }) {
    const nearSeats = table.nearSeats ?? 6;
    const nearSpacing = table.width / nearSeats;
    const nearSeatId = (i: number) => `table-${table.id}-near-${i + 1}`;
    const end1SeatId = `table-${table.id}-end1-1`;
    const end2SeatId = `table-${table.id}-end2-1`;
    const { name, pax } = splitLabel(table.label);

    return (
        <g id={`table-${table.id}`}>
            {/* Table body */}
            <rect
                x={table.x} y={table.y} width={table.width} height={table.height} rx={table.height / 2}
                fill={isHighlighted ? theme.colors.surfaceMuted : theme.colors.surface}
                stroke={isHighlighted ? theme.colors.primary : theme.colors.border}
                strokeWidth={isHighlighted ? 2.5 : 1}
                filter={isHighlighted ? "url(#highlightGlow)" : "url(#tableShadow)"}
            />

            {/* VIP star badge */}
            <text
                x={table.x + table.width / 2}
                y={table.y + table.height / 2 - 10}
                textAnchor="middle" dominantBaseline="central"
                fontSize={14} fill={theme.colors.primary} opacity="0.7"
            >
                ★
            </text>

            {/* Label inside table */}
            <text
                x={table.x + table.width / 2} y={table.y + table.height / 2 + 6}
                textAnchor="middle" dominantBaseline="central" fontSize={13}
                fontFamily={theme.fonts.body}
                fontWeight={isHighlighted ? 600 : 500}
                fill={isHighlighted ? theme.colors.primary : theme.colors.text}
            >
                {name}
            </text>
            <text
                x={table.x + table.width / 2} y={table.y + table.height / 2 + 22}
                textAnchor="middle" dominantBaseline="central" fontSize={10}
                fontFamily={theme.fonts.body}
                fill={theme.colors.textMuted}
            >
                {pax}
            </text>

            {/* Near-side seats (top) */}
            {Array.from({ length: nearSeats }).map((_, i) => {
                const seatId = nearSeatId(i);
                const isSeatHighlighted = seatId === highlightedSeatId;
                const cx = table.x + i * nearSpacing + nearSpacing / 2;
                const cy = table.y - SEAT_RADIUS - SEAT_GAP;
                return (
                    <g key={seatId}>
                        <circle
                            id={seatId} cx={cx} cy={cy} r={SEAT_RADIUS}
                            fill={isSeatHighlighted ? theme.colors.primary : theme.colors.surfaceMuted}
                            stroke={isSeatHighlighted ? theme.colors.primaryDark : theme.colors.border}
                            strokeWidth={isSeatHighlighted ? 2 : 0.8}
                            filter={isSeatHighlighted ? "url(#seatGlow)" : undefined}
                        />
                        {isSeatHighlighted && (
                            <circle cx={cx} cy={cy} r={SEAT_RADIUS + 4}
                                fill="none" stroke={theme.colors.primary} strokeWidth="1.5"
                                strokeDasharray="3 3" opacity="0.5" />
                        )}
                    </g>
                );
            })}

            {/* End seat 1 (left) */}
            {renderEndSeat(
                end1SeatId,
                table.x - SEAT_RADIUS - SEAT_GAP,
                table.y + table.height / 2,
                end1SeatId === highlightedSeatId,
            )}

            {/* End seat 2 (right) */}
            {renderEndSeat(
                end2SeatId,
                table.x + table.width + SEAT_RADIUS + SEAT_GAP,
                table.y + table.height / 2,
                end2SeatId === highlightedSeatId,
            )}
        </g>
    );
}

function renderEndSeat(seatId: string, cx: number, cy: number, isSeatHighlighted: boolean) {
    return (
        <g>
            <circle
                id={seatId} cx={cx} cy={cy} r={SEAT_RADIUS}
                fill={isSeatHighlighted ? theme.colors.primary : theme.colors.surfaceMuted}
                stroke={isSeatHighlighted ? theme.colors.primaryDark : theme.colors.border}
                strokeWidth={isSeatHighlighted ? 2 : 0.8}
                filter={isSeatHighlighted ? "url(#seatGlow)" : undefined}
            />
            {isSeatHighlighted && (
                <circle cx={cx} cy={cy} r={SEAT_RADIUS + 4}
                    fill="none" stroke={theme.colors.primary} strokeWidth="1.5"
                    strokeDasharray="3 3" opacity="0.5" />
            )}
        </g>
    );
}