import { Outlet, useLocation } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const steps = [
	'/onboarding',
	'/onboarding/basic',
	'/onboarding/experience',
	'/onboarding/goals',
	'/onboarding/schedule',
	'/onboarding/CharacterColor',
];

export default function Onboarding() {
	const loc = useLocation();
	const idx = steps.indexOf(loc.pathname);
	const current = idx !== -1 ? idx + 1 : 1;

	return (
    <div
      className="
        min-h-screen 
        bg-gradient-to-br 
        from-[#1FAF66] 
        via-[#0C7F45] 
        to-[#054F2D]
        flex 
        items-center 
        justify-center 
        p-4
      "
    >
      {/* HIER muss das Card-Element hin! */}
      <Card className="w-full max-w-3xl shadow-xl p-5">
        <CardHeader>
          <ProgressBar current={current} total={6} />
        </CardHeader>

        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
}
