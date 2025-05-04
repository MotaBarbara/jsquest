import Button from "../components/button";
import Header from "../components/header";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section>
          <p>The Ultimate JavaScript Challenge Platform</p>
          <h1>Master JavaScript Become a [developer]</h1>
          <p>
            Level up your JavaScript skills through interactive challenges,
            structured progression, and monthly competitions - learning made
            fun, focused, and fiercely competitive.
          </p>
          <div>
            <Button href="/auth/login">Get started</Button>
            <Button href="/auth/login" variant="secondary">
              How it works
            </Button>
          </div>
        </section>
        <section>
          <p>The Ultimate JavaScript Challenge Platform</p>
          <h2></h2>
          <div className="">
            <img src="" alt="" />
            <div>
              <h3>Sign Up & Start</h3>
              <p>
                Create your free account and dive into your first challenge in
                seconds - no setup, no fluff.
              </p>
            </div>
          </div>
          <div className="">
            <img src="" alt="" />
            <div>
              <h3>Complete Level-Based Challenges</h3>
              <p>
                Progress through structured JavaScript exercises, one level at a
                time - no skipping allowed, mastery required.
              </p>
            </div>
          </div>
          <div className="">
            <img src="" alt="" />
            <div>
              <h3>Track Success & Climb the Ranks</h3>
              <p>
                Get instant feedback, track your growth, and see how you stack
                up with detailed progress metrics.
              </p>
            </div>
          </div>
          <div className="">
            <img src="" alt="" />
            <div>
              <h3>Join the Leaderboard</h3>
              <p>
                Compete in monthly rankings, earn your spot at the top, and show
                the world your JavaScript skills.
              </p>
            </div>
          </div>
        </section>
        <section>
          <h2>Testimonial does here</h2>
          <Button href="/auth/login">Get started</Button>
        </section>
        <section>
          <div>
            <a href="">Gamified Progression</a>
            <a href="">Monthly Rankings</a>
            <a href="">Success Metrics</a>
            <a href="">Secure Login</a>
          </div>
          <div>
            <div>
              <img src="" alt="" />
              <p>10 challenges per level. No skipping, earn your way up.</p>
            </div>
            <div>
              <img src="" alt="" />
              <p>Climb the leaderboard and compete every month.</p>
            </div>
            <div>
              <img src="" alt="" />
              <p>Track your progress, accuracy, and streaks.</p>
            </div>
            <div>
              <img src="" alt="" />
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
        <img src="" alt="js quest logotype" />
        <div>
          <a href="">How It Works</a>
          <a href="">Testimonials</a>
          <a href="">Features & Benefits</a>
        </div>
      </section>
    </>
  );
}
