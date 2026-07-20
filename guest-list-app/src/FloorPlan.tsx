import { useEffect } from "react";
import { TABLES, type TableConfig } from "./floorPlanConfig";
import { type GuestInfo } from "./guestsMatcher";
import { theme } from "./theme";

const SEAT_RADIUS = 8;
const SEAT_GAP = 5;

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
        <div style={{ minHeight: "100vh", background: `${theme.colors.background} url('/bg.png') center / cover no-repeat`, fontFamily: theme.fonts.body }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
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
                        {match.table <= 20 ? (
                            <>Table <strong>{match.table}</strong></>
                        ) : (
                            <>Viking Table <strong>{match.table - 20}</strong>
                                {match.side && <> — Seat <strong>{match.position}</strong></>}
                            </>
                        )}
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
                    viewBox="0 0 1000 1300"
                    width="100%"
                    style={{
                        borderRadius: 12,
                        boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
                        border: `1px solid ${theme.colors.border}`,
                        overflow: "hidden",
                    }}
                >
                    <defs>
                        {/* Background image pattern with reduced opacity */}
                        <pattern id="bgPattern" patternUnits="userSpaceOnUse" width="1000" height="1300">
                            <image href="/bg.png" x="0" y="0" width="1000" height="1300" preserveAspectRatio="xMidYMid slice" opacity="0.35" />
                        </pattern>
                        {/* Drop shadow for tables */}
                        <filter id="tableShadow" x="-10%" y="-10%" width="130%" height="140%">
                            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#3A2E1E" floodOpacity="0.08" />
                        </filter>
                        {/* Glow for highlighted table */}
                        <filter id="highlightGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor={theme.colors.primary} floodOpacity="0.35" />
                        </filter>
                        {/* Glow for highlighted seat */}
                        <filter id="seatGlow" x="-60%" y="-60%" width="220%" height="220%">
                            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={theme.colors.primary} floodOpacity="0.5" />
                        </filter>
                    </defs>

                    {/* Base cream background */}
                    <rect width="1000" height="1300" fill={theme.colors.background} rx="12" />
                    {/* Background pattern overlay */}
                    <rect width="1000" height="1300" fill="url(#bgPattern)" rx="12" />

                    {/* Decorative border inset */}
                    <rect x="20" y="20" width="960" height="1260" rx="8" fill="none"
                        stroke={theme.colors.primary} strokeWidth="0.8" strokeOpacity="0.3" />

                    {/* ── L-Shape Carpet (under tables) ── */}
                    <LShapeCarpet />

                    {/* ── Static Sweetheart Table ── */}
                    <SweetheartTable />

                    {/* ── Dance Floor ── */}
                    <DanceFloor />

                    {/* ── All configured tables ── */}
                    {TABLES.map((table) => {
                        const isHighlighted = `table-${table.id}` === highlightedTableId;
                        if (table.type === "round") {
                            return <RoundTable key={table.id} table={table} isHighlighted={isHighlighted} />;
                        }
                        return <OrderedTable key={table.id} table={table} isHighlighted={isHighlighted} highlightedSeatId={highlightedSeatId} />;
                    })}
                </svg>
            </div>
        </div>
    );
}

/* ─── Static Sweetheart Table (decorative — matching reference image) ─── */

function SweetheartTable() {
    const cx = 500;
    const cy = 120;
    const w = 260;
    const h = 60;

    return (
        <g>
            {/* Outer border */}
            <rect
                x={cx - w / 2 - 4} y={cy - h / 2 - 4}
                width={w + 8} height={h + 8} rx={4}
                fill="none"
                stroke={theme.colors.primary}
                strokeWidth={2}
            />
            {/* Filled brown background */}
            <rect
                x={cx - w / 2} y={cy - h / 2}
                width={w} height={h} rx={2}
                fill={theme.colors.primary}
            />
            {/* "Sweetheart Table" label */}
            <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="central"
                fontSize={20} fontFamily={theme.fonts.heading} fill="#FFFFFF"
                fontWeight={500}
            >
                Sweetheart Table
            </text>

            {/* ── Chairs above the table ── */}
            {/* Left end chair (brown, no label) */}
            <rect x={cx - 80} y={cy - h / 2 - 42} width={28} height={26} rx={8}
                fill="none" stroke={theme.colors.primary} strokeWidth={2} />
            <rect x={cx - 80} y={cy - h / 2 - 42} width={28} height={10} rx={4}
                fill={theme.colors.primary} />

            {/* Bride chair (pink) */}
            <rect x={cx - 36} y={cy - h / 2 - 44} width={32} height={30} rx={8}
                fill="#F8E8E6" stroke="#D88A82" strokeWidth={1.8} />
            <text x={cx - 20} y={cy - h / 2 - 26} textAnchor="middle" dominantBaseline="central"
                fontSize={9} fill="#C0645C" fontFamily={theme.fonts.body} fontWeight={500}
            >Bride</text>

            {/* Groom chair (blue) */}
            <rect x={cx + 4} y={cy - h / 2 - 44} width={32} height={30} rx={8}
                fill="#E6F0F6" stroke="#5B9EC4" strokeWidth={1.8} />
            <text x={cx + 20} y={cy - h / 2 - 26} textAnchor="middle" dominantBaseline="central"
                fontSize={9} fill="#3A7FA8" fontFamily={theme.fonts.body} fontWeight={500}
            >Groom</text>

            {/* Right end chair (brown, no label) */}
            <rect x={cx + 52} y={cy - h / 2 - 42} width={28} height={26} rx={8}
                fill="none" stroke={theme.colors.primary} strokeWidth={2} />
            <rect x={cx + 52} y={cy - h / 2 - 42} width={28} height={10} rx={4}
                fill={theme.colors.primary} />
        </g>
    );
}

/* ─── Dance Floor ─── */

function DanceFloor() {
    const cx = 500;
    const cy = 260;
    const w = 260;
    const h = 110;

    return (
        <g>
            {/* Outer border (double border like the reference image) */}
            <rect
                x={cx - w / 2 - 5} y={cy - h / 2 - 5}
                width={w + 10} height={h + 10} rx={3}
                fill="none"
                stroke={theme.colors.primary}
                strokeWidth={2}
            />
            {/* Inner border */}
            <rect
                x={cx - w / 2} y={cy - h / 2}
                width={w} height={h} rx={2}
                fill="none"
                stroke={theme.colors.primary}
                strokeWidth={1}
            />

            {/* Dance icon (using the image) */}
            <image
                href="/Ballroom Dance.png"
                x={cx - 16} y={cy - 28}
                width={32} height={32}
                opacity={0.85}
            />

            {/* "Dance Floor" text */}
            <text x={cx} y={cy + 24} textAnchor="middle" dominantBaseline="central"
                fontSize={20} fontFamily={theme.fonts.heading} fill={theme.colors.primary}
                fontWeight={500}
            >
                Dance Floor
            </text>
        </g>
    );
}

/* ─── L-Shape Carpet (walkway with clearance) ─── */

function LShapeCarpet() {
    const color = theme.colors.primary;
    const opacity = 0.22;

    return (
        <g>
            {/* Vertical part — center column (ends at y=1140, spans x in [450, 550]) */}
            <rect x={450} y={350} width={100} height={790} rx={0}
                fill={color} opacity={opacity} />
            {/* Horizontal part — bottom left (starts at x=40, spans y in [1140, 1220]) */}
            <rect x={40} y={1140} width={510} height={80} rx={0}
                fill={color} opacity={opacity} />
        </g>
    );
}

/* ─── Round Table ─── */

function RoundTable({ table, isHighlighted }: { table: TableConfig; isHighlighted: boolean }) {
    const cx = table.x;
    const cy = table.y;
    const radius = table.radius ?? 42;
    const seats = table.seats ?? 10;
    const seatOrbit = radius + SEAT_RADIUS + SEAT_GAP;

    return (
        <g id={`table-${table.id}`}>
            {/* Table body (circle) */}
            <circle
                cx={cx} cy={cy} r={radius}
                fill={isHighlighted ? theme.colors.surfaceMuted : theme.colors.surface}
                stroke={isHighlighted ? theme.colors.primary : theme.colors.border}
                strokeWidth={isHighlighted ? 2.5 : 1}
                filter={isHighlighted ? "url(#highlightGlow)" : "url(#tableShadow)"}
            />
            {/* Table number */}
            <text
                x={cx} y={cy}
                textAnchor="middle" dominantBaseline="central"
                fontSize={15} fontFamily={theme.fonts.body}
                fontWeight={isHighlighted ? 700 : 500}
                fill={isHighlighted ? theme.colors.primary : theme.colors.text}
            >
                {table.id}
            </text>

            {/* Seats around the circle */}
            {Array.from({ length: seats }).map((_, i) => {
                const angle = (2 * Math.PI * i) / seats - Math.PI / 2;
                const sx = cx + seatOrbit * Math.cos(angle);
                const sy = cy + seatOrbit * Math.sin(angle);
                return (
                    <rect
                        key={i}
                        x={sx - 6} y={sy - 6}
                        width={12} height={12} rx={3}
                        fill={isHighlighted ? theme.colors.surfaceMuted : "#F0EBE0"}
                        stroke={isHighlighted ? theme.colors.primary : theme.colors.border}
                        strokeWidth={0.6}
                        opacity={0.75}
                        transform={`rotate(${(360 * i) / seats}, ${sx}, ${sy})`}
                    />
                );
            })}
        </g>
    );
}

/* ─── Ordered Table (Viking) ─── */

function OrderedTable({
    table, isHighlighted, highlightedSeatId,
}: { table: TableConfig; isHighlighted: boolean; highlightedSeatId: string | null }) {
    const leftSeats = table.leftSeats ?? 5;
    const rightSeats = table.rightSeats ?? 5;
    const leftSpacing = table.height / leftSeats;
    const rightSpacing = table.height / rightSeats;

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
                x={table.x + table.width / 2} y={table.y - 14}
                textAnchor="middle" fontSize={12} fontFamily={theme.fonts.body}
                fontWeight={isHighlighted ? 600 : 500}
                fill={isHighlighted ? theme.colors.primary : theme.colors.text}
            >
                {table.label}
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