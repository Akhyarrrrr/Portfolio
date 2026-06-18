import Squares from "../Squares/Squares";

export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 h-[100dvh] w-full">
      <Squares
        speed={0.16}
        squareSize={40}
        direction="diagonal"
        borderColor="rgba(255,255,255,0.16)"
        hoverFillColor="#61DCA3"
      />
    </div>
  );
}
