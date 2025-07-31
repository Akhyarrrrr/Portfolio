import AnimatedContent from "./components/AnimatedContent/AnimatedContent";
import SplitText from "./components/SplitText/SplitText";
import BlurText from "./components/BlurText/BlurText";
import Lanyard from "./components/Lanyard/Lanyard";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { HiDownload } from "react-icons/hi";

export default function Hero() {
  return (
    <div
      className="container mx-auto max-w-screen-xl md:h-screen px-4 bg-[#0B0F15]"
      id="hero"
    >
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Kiri */}
        <div className="col-span-6 flex items-center pt-28 md:pt-0">
          <div className="flex items-center h-full">
            <div className="flex flex-col gap-6 ">
              <AnimatedContent
                distance={150}
                direction="horizontal"
                reverse={false}
                initialOpacity={0.2}
                animateOpacity
                scale={1.1}
                threshold={0.2}
              >
                <div className="flex items-center gap-2">
                  <h1 className="text-xl text-white font-semibold">
                    Welcome to My Portfolio...
                  </h1>
                </div>
              </AnimatedContent>

              <div className="flex flex-col items-start">
                <SplitText
                  text="Hey, I'm"
                  className="text-4xl md:text-6xl font-semibold text-start"
                  delay={50}
                  from={{
                    opacity: 0,
                    transform: "translate3d(0,50px,0)",
                  }}
                  to={{
                    opacity: 1,
                    transform: "translate3d(0,0,0)",
                  }}
                  threshold={0.2}
                  rootMargin="-50px"
                />
                <SplitText
                  text="Akhyar"
                  className="text-5xl md:text-6xl font-semibold text-start text-[#61DCA3]"
                  delay={75}
                  from={{
                    opacity: 0,
                    transform: "translate3d(0,50px,0)",
                  }}
                  to={{
                    opacity: 1,
                    transform: "translate3d(0,0,0)",
                  }}
                  threshold={0.2}
                  rootMargin="-50px"
                />
              </div>

              <BlurText
                text="Just finished my Informatics degree, and right now I'm really into building cool digital stuff from websites to mobile apps. I enjoy coding and love turning ideas into something real and useful. Got something in mind? Let's build it together!"
                delay={75}
                animateBy="words"
                direction="top"
                className="text-lg md:text-xl mb-8"
              />

              {/* CV */}
              <div className="flex items-center gap-4 relative z-50 justify-between">
                {/* Button Download CV */}
                <div className="flex items-center gap-4 relative z-50">
                  {/* Download CV Button */}
                  <a
                    href="/CV-Akhyar.pdf"
                    download
                    className="flex items-center gap-2 px-4 md:px-8  py-2 md:py-4 rounded-lg border border-[#61DCA3] text-[#61DCA3] 
                   hover:bg-[#61DCA3] hover:text-white transition duration-300 active:scale-95"
                  >
                    <span>Download CV</span>
                    <HiDownload className="w-5 h-5" />
                  </a>
                </div>

                {/* Social Icons */}
                <div className="flex gap-3">
                  {/* Instagram */}
                  <a
                    href="https://instagram.com/akhyaar._"
                    target="_blank"
                    className="flex h-13 w-13 items-center justify-center rounded-full border border-[#61DCA3] text-[#61DCA3] hover:bg-[#61DCA3] hover:text-white transition"
                  >
                    <FaInstagram size={22} />
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/akhyarrr/"
                    target="_blank"
                    className="flex h-13 w-13 items-center justify-center rounded-full border border-[#61DCA3] text-[#61DCA3] hover:bg-[#61DCA3] hover:text-white transition"
                  >
                    <FaLinkedin size={22} />
                  </a>

                  {/* GitHub */}
                  <a
                    href="https://github.com/Akhyarrrrr"
                    target="_blank"
                    className="flex h-13 w-13 items-center justify-center rounded-full border border-[#61DCA3] text-[#61DCA3] hover:bg-[#61DCA3] hover:text-white transition"
                  >
                    <FaGithub size={22} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kanan */}
        <div className="col-span-6 mt-44 md:mt-0 pt-0 md:pt-8 -mb:20 md:mb-0 ">
          <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
        </div>
      </div>
      .{" "}
    </div>
  );
}
