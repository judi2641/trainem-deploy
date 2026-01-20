import { Outlet, useLocation } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import PixelBackground from '@/components/pixel/PixelBackground';

const steps = [
  '/onboarding',
  '/onboarding/basic',
  '/onboarding/experience',
  '/onboarding/goals',
  '/onboarding/schedule',
  '/onboarding/CharacterColor',
  '/onboarding/intro',
];

export default function Onboarding() {
  const loc = useLocation();
  const idx = steps.indexOf(loc.pathname);
  const current = idx !== -1 ? idx + 1 : 1;

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        flex
        items-center
        justify-center
        p-4
        bg-gradient-to-br
        from-[#CFEFE3]
        via-[#E2F6EE]
        to-[#FFE8B0]
      "
    >
      {/* subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-18 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* subtle colored pixels like landingpage */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <PixelBackground count={90} seed={11} />
      </div>

      {/* Card stays on top */}
      <Card className="relative z-10 w-full max-w-3xl shadow-xl p-5">
        <CardHeader>
          <ProgressBar current={current} total={7} />
        </CardHeader>

        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
}
