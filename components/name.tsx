export default function Name({ scale = 0.5, light = false }: { scale?: number; light?: boolean }) {
  const baseFontSize = 52;
  const baseDotSize = 30;
  const baseLetterSpacing = -2.8;
  const textColor = light ? "#1A365D" : "#1A365D";

  return (
    <div
      className="flex items-center justify-center select-none"
      style={{
        fontSize: `${baseFontSize * scale}px`,
        letterSpacing: `${baseLetterSpacing * scale}px`,
        color: textColor,
        fontWeight: 950,
        fontFamily: "var(--font-geist), var(--font-inter), sans-serif",
        lineHeight: 0.8,
      }}
    >
      <h2 className="flex items-center leading-none" style={{ fontWeight: 950 }}>
        <span>booksp</span>
        <span
          className="inline-flex items-center justify-center rounded-full bg-[#D4AF37]"
          style={{
            width: `${baseDotSize * scale}px`,
            height: `${baseDotSize * scale}px`,
            marginLeft: `${2.8 * scale}px`,
            marginRight: `${2.8 * scale}px`,
            marginTop: `${6 * scale}px`,
            display: "inline-block",
            boxShadow: "inset 0 0 0 1px rgba(26,54,93,0.08)",
            transform: "translateY(-1px)",
          }}
        />
        <span>t</span>
      </h2>
    </div>
  );
}
