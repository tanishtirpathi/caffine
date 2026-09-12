export default function Name({ scale = 0.5 }: { scale?: number }) {
  // Define base measurements in pixels or rems
  const baseFontSize = 48; // equivalent to text-5xl (3rem)
  const baseDotSize = 28;  // equivalent to w-7 h-7 (1.75rem)
  const baseLetterSpacing = -2;

  return (
    <div 
      className="flex items-center justify-center min-h-screen font-bold text-[#171A2B]"
      style={{
        fontSize: `${baseFontSize * scale}px`,
        letterSpacing: `${baseLetterSpacing * scale}px`,
      }}
    >
      <h2 className="flex items-center leading-none">
        <span>booksp</span>
        <span 
          className="rounded-full bg-[#E8B928]"
          style={{
            width: `${baseDotSize * scale}px`,
            height: `${baseDotSize * scale}px`,
            marginLeft: `${3 * scale}px`,
            marginRight: `${3 * scale}px`,
            // Slight optical alignment for the dot based on scale
            marginTop: `${6 * scale}px`, 
          }}
        />
        <span>t</span>
      </h2>
    </div>
  );
}
