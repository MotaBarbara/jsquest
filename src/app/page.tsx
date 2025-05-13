import Button from "../components/button";
import TypewriterEffect from "../components/changingHeadline";
import HorizontalScrollSection from "../components/horizontalScrollSection";
import Link from "next/link";


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
        <section>
          <div>
            <h2>
              “This platform made learning JavaScript addictive. The level-based
              challenges kept me motivated, and the leaderboard pushed me to
              going. I went from zero to building real projects in just a few
              weeks.
            </h2>
            <p>— Jamie L., aspiring front-end developer</p>
          </div>
          <Button href="/auth/login">Get started</Button>
        </section>
        <section>
          <div>
            <Link href="">Gamified Progression</Link>
            <Link href="">Monthly Rankings</Link>
            <Link href="">Success Metrics</Link>
            <Link href="">Secure Login</Link>
          </div>
          <div>
            <div>
              {/* <img src="" alt="" /> */}
              <p>10 challenges per level. No skipping, earn your way up.</p>
            </div>
            <div>
              {/* <img src="" alt="" /> */}
              <p>Climb the leaderboard and compete every month.</p>
            </div>
            <div>
              {/* <img src="" alt="" /> */}
              <p>Track your progress, accuracy, and streaks.</p>
            </div>
            <div>
              {/* <img src="" alt="" /> */}
              <p>Save progress and sync across all devices.</p>
            </div>
          </div>
        </section>
        <section>
          <h2>Start mastering JavaScript today, it’s free!</h2>
          <Button href="/auth/login">Get started</Button>
        </section>
      </main>
      <section>
        {/* <img src="" alt="js quest logotype" /> */}
        <div>
          <a href="">How It Works</a>
          <a href="">Testimonials</a>
          <a href="">Features & Benefits</a>
        </div>
      </section>
    </>
  );
}
