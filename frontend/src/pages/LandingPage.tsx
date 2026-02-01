import { useAuth0 } from "@auth0/auth0-react";
import PixelBackground from "@/components/pixel/PixelBackground";
import { Button } from "@/components/ui/button";
import React, { useLayoutEffect, useRef } from "react";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
        // keep URL hash nice (optional)
        history.replaceState(null, "", href);
      }}
      className="text-sm text-black/70 hover:text-black hover:underline transition"
    >
      {children}
    </a>
  );
}

function PixelDivider() {
  return (
    <div className="relative w-full h-14 bg-black/20 border-y-2 border-black snap-none">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute left-10 top-3 h-6 w-10 bg-black/25" />
        <div className="absolute left-24 top-7 h-4 w-6 bg-black/25" />
        <div className="absolute right-20 top-4 h-5 w-8 bg-black/25" />
        <div className="absolute right-40 top-8 h-3 w-6 bg-black/25" />
      </div>
    </div>
  );
}

function ScrollArrows({
  downTo,
  upTo,
  dark,
}: {
  downTo?: string;
  upTo?: string;
  dark?: boolean;
}) {
  const cls = dark ? "text-white/70 hover:text-white" : "text-black/50 hover:text-black";

  return (
    <div className="mt-10 flex justify-center gap-10">
      {upTo && (
        <button
          className={`transition ${cls}`}
          onClick={() => document.querySelector(upTo)?.scrollIntoView({ behavior: "smooth", block: "start" })}
          aria-label="Scroll up"
          type="button"
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      )}

      {downTo && (
        <button
          className={`transition ${cls}`}
          onClick={() => document.querySelector(downTo)?.scrollIntoView({ behavior: "smooth", block: "start" })}
          aria-label="Scroll down"
          type="button"
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      )}
    </div>
  );
}

function Section({
  id,
  dark = false,
  fit = false,
  children,
}: {
  id: string;
  dark?: boolean;
  fit?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={[
        "relative w-full snap-start",
        fit
          ? "h-[calc(100vh-var(--header-h))] flex items-center overflow-y-auto md:overflow-hidden"
          : "py-20 md:py-28",
        // for anchor offset if body ever scrolls
        "scroll-mt-[calc(var(--header-h)+12px)]",
        dark ? "bg-black/25" : "bg-transparent",
      ].join(" ")}
    >
      <div
        className={
          fit
            ? "mx-auto max-w-6xl px-4 py-[clamp(18px,5vh,56px)] w-full"
            : "mx-auto max-w-6xl px-4 w-full"
        }
      >
        {children}
      </div>
    </section>
  );
}

function ShadowCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={"relative " + className}>
      <div className="absolute left-2 top-2 h-full w-full border-4 border-black bg-black/10" />
      <div className="relative bg-white/85 backdrop-blur border-4 border-black p-8 md:p-10">
        {children}
      </div>
    </div>
  );
}

function StatPill({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-black/60">
      <span className={`h-3 w-3 border border-black ${color}`} />
      {label}
    </span>
  );
}

function MiniTaskCard({ label, variant }: { label: string; variant: "done" | "todo" | "reward" }) {
  const left =
    variant === "done" ? "bg-emerald-500" : variant === "todo" ? "bg-sky-400" : "bg-amber-400";
  const icon = variant === "done" ? "✓" : variant === "reward" ? "★" : "•";

  return (
    <div className="flex items-center w-[380px] max-w-full border-2 border-white/30 bg-white/10">
      <div className={`w-12 h-12 flex items-center justify-center text-black font-bold ${left}`}>
        {icon}
      </div>
      <div className="flex-1 px-4 py-3 bg-white/95">
        <div className="text-sm font-medium text-black">{label}</div>
      </div>
      <div className="w-14 h-12 flex items-center justify-center bg-white/80">
        <div className="w-7 h-7 rounded-full bg-black/10" />
      </div>
    </div>
  );
}

function PixelGridPreview({ w = 16, h = 12 }: { w?: number; h?: number }) {
  const total = w * h;
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${w}, minmax(0, 1fr))` }}>
      {Array.from({ length: total }).map((_, i) => {
        const c =
          i % 17 === 0
            ? "bg-emerald-400"
            : i % 23 === 0
            ? "bg-amber-400"
            : i % 29 === 0
            ? "bg-sky-300"
            : "bg-white";
        return <div key={i} className={`h-4 w-4 border border-black/15 ${c}`} />;
      })}
    </div>
  );
}

export default function LandingPage() {
  const { loginWithRedirect, logout } = useAuth0();

  const headerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const update = () => {
      const h = headerRef.current?.offsetHeight ?? 56;
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleRegister = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    setTimeout(() => {
      loginWithRedirect({
        authorizationParams: { screen_hint: "signup" },
        appState: { returnTo: "/onboarding" },
      });
    }, 150);
  };

  const handleLogin = () => {
    loginWithRedirect({ appState: { returnTo: "/dashboard" } });
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-[#CFEFE3] via-[#E2F6EE] to-[#FFE8B0]">
      {/* subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* glow */}
      <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-emerald-300/35 blur-3xl" />
      <div className="absolute -bottom-48 -right-48 h-[620px] w-[620px] rounded-full bg-amber-300/40 blur-3xl" />

      {/* pixel background */}
      <PixelBackground count={260} seed={24} />

      {/* header */}
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b-2 border-black bg-white/70 backdrop-blur"
      >
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#top")?.scrollIntoView({ behavior: "smooth", block: "start" });
              history.replaceState(null, "", "#top");
            }}
            className="flex items-center gap-3"
          >
            <div className="h-5 w-5 bg-emerald-500 border-2 border-black" />
            <span className="text-black text-lg font-semibold">TrainEm</span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="#how">How it works</NavLink>
            <NavLink href="#pixel">Pixel Grid</NavLink>
            <NavLink href="#faq">FAQ</NavLink>
          </nav>
        </div>
      </header>

      {/* Scroll container */}
      <main className="h-[calc(100vh-var(--header-h))] overflow-y-auto scroll-smooth snap-y snap-proximity">
        {/* HERO */}
        <Section id="top" fit>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-black leading-[1.05]">
                Train smart
                <br />
                Stay consistent
              </h1>

              <p className="mt-5 text-black/70 text-lg max-w-xl">
                TrainEm gamifies your training: track workouts & habits, earn XP, and unlock more pixels for your{" "}
                <strong>Pixel Grid</strong>.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-5">
                <StatPill color="bg-emerald-500" label="XP & Levels" />
                <StatPill color="bg-sky-400" label="Streaks & weekly goal" />
                <StatPill color="bg-amber-400" label="Unlock pixels" />
              </div>

              <ScrollArrows downTo="#how" />
            </div>

            <ShadowCard>
              <h2 className="text-2xl font-semibold text-black text-center">Start in 1 minute</h2>
              <p className="mt-2 text-black/60 text-center">Sign up → onboarding → your first workout</p>

              <div className="mt-7 grid gap-3">
                <Button
                  onClick={handleRegister}
                  className="pixel-btn bg-emerald-500 text-white hover:bg-emerald-600 px-10 py-7 border-2 border-black rounded-none"
                >
                  Register
                </Button>
                <Button
                  onClick={handleLogin}
                  variant="outline"
                  className="pixel-btn bg-white text-black hover:bg-black/5 px-10 py-7 border-2 border-black rounded-none"
                >
                  Log in
                </Button>
              </div>
            </ShadowCard>
          </div>
        </Section>

        <PixelDivider />

        {/* HOW */}
        <Section id="how" dark fit>
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-6xl font-semibold">Make your progress visible.</h2>
            <p className="mt-6 max-w-3xl mx-auto text-white/80 leading-relaxed text-lg">
              A simple system: plan → do → earn XP → unlock pixels. No clutter — just motivation that sticks.
            </p>

            <div className="mt-12 flex flex-col items-center gap-4">
              <MiniTaskCard label="Start a workout" variant="todo" />
              <MiniTaskCard label="Check off exercises" variant="done" />
              <MiniTaskCard label="Earn XP and unlock pixels" variant="reward" />
            </div>

            <ScrollArrows upTo="#top" downTo="#pixel" dark />
          </div>
        </Section>

        <PixelDivider />

        {/* PIXEL GRID */}
        <Section id="pixel" fit>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-semibold text-black leading-tight mb-8">
                Your Pixel Grid is your progress.
              </h2>

              <p className="text-black/70 text-lg max-w-xl leading-relaxed">
                Gain XP by completing workouts and habits. More XP means more unlocked pixels you can place in your grid.
                More consistency = more XP = more pixels = more detail.
              </p>

              <ScrollArrows upTo="#how" downTo="#faq" />
            </div>

            <ShadowCard>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-black">Pixel Grid Preview</h3>
                <span className="text-xs text-black/50">Example</span>
              </div>
              <p className="mt-2 text-black/60 text-sm">Level up → more pixels → more possibilities.</p>

              <div className="mt-6">
                <PixelGridPreview w={16} h={12} />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="border-2 border-black p-3 bg-emerald-50">
                  <div className="text-[10px] text-black/60">START</div>
                  <div className="text-xl font-semibold text-black">12</div>
                  <div className="text-[10px] text-black/50">pixels</div>
                </div>
                <div className="border-2 border-black p-3 bg-amber-50">
                  <div className="text-[10px] text-black/60">LEVEL UP</div>
                  <div className="text-xl font-semibold text-black">+12</div>
                  <div className="text-[10px] text-black/50">pixels</div>
                </div>
                <div className="border-2 border-black p-3 bg-sky-50">
                  <div className="text-[10px] text-black/60">CONSISTENCY</div>
                  <div className="text-xl font-semibold text-black">XP</div>
                  <div className="text-[10px] text-black/50">loop</div>
                </div>
              </div>
            </ShadowCard>
          </div>
        </Section>

        <PixelDivider />

        {/* FAQ */}
<Section id="faq" dark fit>
  <div className="text-center text-white">
    <h2 className="text-4xl md:text-5xl font-semibold">FAQ</h2>
    <p className="mt-3 max-w-3xl mx-auto text-white/80 leading-relaxed text-base md:text-lg">
      Quick answers — then just start.
    </p>

    <div className="mt-6 grid md:grid-cols-2 gap-4 text-left">
      {[
        {
          q: "Do I have to create workouts?",
          a: "No. You can start with habits. Workouts are the clearest progress loop though.",
        },
        {
          q: "How do I unlock more pixels?",
          a: "By earning XP and leveling up. More consistency = more XP = more unlocked pixels.",
        },
        {
          q: "Is this only for the gym?",
          a: "No. Works for home workouts, mobility, steps, stretching — anything you want to track.",
        },
        {
          q: "What’s the fastest start?",
          a: "Register → onboarding → create a workout → check off your first exercise.",
        },
      ].map((item) => (
        <div key={item.q} className="border-2 border-white/25 bg-white/10 p-4">
          <div className="text-base font-semibold">{item.q}</div>
          <div className="mt-1 text-white/80 text-sm leading-relaxed">{item.a}</div>
        </div>
      ))}
    </div>

    <div className="mt-6">
      <h3 className="text-2xl md:text-3xl font-semibold">
        Start today — make consistency visible.
      </h3>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          onClick={handleRegister}
          className="pixel-btn bg-amber-400 text-black hover:bg-amber-500 px-10 py-6 border-2 border-black rounded-none"
        >
          Start free
        </Button>
        <Button
          onClick={handleLogin}
          variant="outline"
          className="pixel-btn bg-white text-black hover:bg-black/5 px-10 py-6 border-2 border-black rounded-none"
        >
          Log in
        </Button>
      </div>

      <ScrollArrows upTo="#top" dark />

      <div className="mt-4 text-xs text-white/60">© {new Date().getFullYear()} TrainEm</div>
    </div>
  </div>
</Section>

      </main>
    </div>
  );
}
