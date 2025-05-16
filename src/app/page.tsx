import Button from "../components/button";
import TypewriterEffect from "../components/changingHeadline";
import Functionalities from "../components/functionalities";
import HorizontalScrollSection from "../components/horizontalScrollSection";
import Testimonials from "../components/testimonials";
import Image from "next/image";
import Logo from "@/src/assets/js-quest-logo.svg";

const testimonialsData = [
  {
    quote:
      "This platform made learning JavaScript addictive. The level-based challenges kept me motivated.",
    author: "Jamie L., aspiring front-end developer",
  },
  {
    quote:
      "It felt like a game, not a class. I actually look forward to learning now.",
    author: "Taylor M., bootcamp student",
  },
  {
    quote:
      "This platform made learning JavaScript addictive. The level-based challenges kept me motivated.",
    author: "Jamie L., aspiring front-end developer",
  },
  {
    quote:
      "It felt like a game, not a class. I actually look forward to learning now.",
    author: "Taylor M., bootcamp student",
  },
];

export default function Home() {
  return (
    <>
      <main className="!pt-0">
        <section className="h-[100vh] min-h-[600px] max-h-[840px] flex flex-col justify-center items-center text-center gap-4 max-w-[46rem] m-auto">
          <p>The Ultimate JavaScript Challenge Platform</p>
          <h1 className="h1-lp">
            <span className="block">Master JavaScript</span>
            <span>
              <TypewriterEffect />
            </span>
          </h1>
          <p>
            Level up your JavaScript skills through interactive challenges,
            structured progression, and monthly competitions - learning made
            fun, focused, and fiercely competitive.
          </p>
          <div className="flex gap-2 mt-16">
            <Button href="/auth/login">Get started</Button>
            <Button href="/auth/login" variant="secondary">
              How it works
            </Button>
          </div>
        </section>
        <section className="h-[300vh] relative">
          <div className="sticky top-40 h-screen overflow-hidden">
            <HorizontalScrollSection />
          </div>
        </section>
        <section className="py-80 text-center">
          <div>
            <Testimonials testimonials={testimonialsData} />
          </div>
        </section>
        <section>
          <Functionalities />
        </section>
        <section className="p-8 pt-32 bg-[var(--primary-color)] flex flex-col items-start">
          <h2 className="h2-lp mb-6 max-w-95">
            Start mastering JavaScript today, it’s free!
          </h2>
          <div className="flex gap-8 items-center">
            <Button href="/auth/login" variant="tertiary">
              Get started
            </Button>
            <Button href="/auth/login" variant="link">
              Functionalities
            </Button>
          </div>
        </section>
      </main>
      <footer className="flex flex-col items-center px-4 py-12 border-t-1 border-[var(--unavailable-text)] mt-8">
        <Image src={Logo} alt="JS Quest Logo" width={100} height={100} />{" "}
        <div className="mt-4 flex gap-6">
          <a href="">How It Works</a>
          <a href="">Features & Benefits</a>
          <a href="">Testimonials</a>
        </div>
      </footer>
    </>
  );
}
