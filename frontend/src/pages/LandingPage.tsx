import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import PixelBackground from "@/components/pixel/PixelBackground";

export default function LandingPage() {
  const { loginWithRedirect, logout } = useAuth0();

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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#CFEFE3] via-[#E2F6EE] to-[#FFE8B0]">
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
      <PixelBackground count={220} seed={24} />

      {/* header */}
      <header className="relative z-10 flex items-center px-10 py-7">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 bg-emerald-500 border-2 border-black" />
          <span className="font-pixel text-black text-3xl">
            TrainEm
          </span>
        </div>
      </header>

      {/* center card */}
      <main className="relative z-10 flex min-h-[calc(100vh-96px)] items-center justify-center px-4">
        <div className="relative">
          {/* shadow layer */}
          <div className="absolute left-3 top-3 h-full w-full border-4 border-black bg-black/10" />

          {/* card */}
          <div className="relative bg-white/85 backdrop-blur border-4 border-black px-16 py-14">
            
            {/* HEADLINE */}
            <div className="flex justify-center">
              <h1
                className="font-pixel text-4xl md:text-5xl leading-none text-black text-left"
                style={{
                  letterSpacing: "0",
                  wordSpacing: "-0.45em",
                }}
              >
                TRAIN SMART
                <br />
                STAY CONSISTENT
              </h1>
            </div>

            {/* buttons */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                onClick={handleRegister}
                className="pixel-btn font-pixel bg-amber-400 text-black hover:bg-amber-500 px-12 py-7"
              >
                REGISTER
              </Button>

              <Button
                onClick={handleLogin}
                variant="outline"
                className="pixel-btn font-pixel bg-white text-black hover:bg-black/5 px-12 py-7 border-2 border-black"
              >
                LOGIN
              </Button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
