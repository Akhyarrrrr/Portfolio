import Squares from "../components/Squares/Squares";

export default function Background() {
  return (
    <div className="absolute top-0 right-0 left-0 bottom-0 w-full h-full">
      <Squares
        speed={0.2}
        squareSize={40}
        direction="diagonal"
        borderColor="#FFFFFF"
        hoverFillColor="#61DCA3"
      />
    </div>
  );
}
