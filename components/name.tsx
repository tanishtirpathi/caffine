export default function Name({ scale = 0.5, light = false }: { scale?: number; light?: boolean }) {
  const baseFontSize = 48;
  const baseDotSize = 28;
  const baseLetterSpacing = -2;

  return (
    <div
      className="flex items-center justify-center font-black"
      style={{
        fontSize: `${baseFontSize * scale}px`,
        letterSpacing: `${baseLetterSpacing * scale}px`,
        color: light ? "#1A365D" : "#1A365D",
      }}
    >
      <h2 className="flex items-center leading-none">
        <span>booksp</span>
        <span
          className="inline-flex items-center justify-center rounded-full bg-[#D4AF37]"
          style={{
            width: `${baseDotSize * scale}px`,
            height: `${baseDotSize * scale}px`,
            marginLeft: `${2.5 * scale}px`,
            marginRight: `${2.5 * scale}px`,
            marginTop: `${5 * scale}px`,
            display: "inline-block",
            boxShadow: "inset 0 0 0 1px rgba(26,54,93,0.08)",
          }}
        />
        <span>t</span>
      </h2>
    </div>
  );
}
