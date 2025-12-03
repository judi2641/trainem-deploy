import { Outlet, useLocation } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar.tsx';
import { Card, CardHeader, CardContent } from "@/components/ui/card";


const steps = [
	'/onboarding',
	'/onboarding/basic',
	'/onboarding/experience',
	'/onboarding/goals',
	'/onboarding/schedule',
];

export default function Onboarding() {
	const loc = useLocation();
	const idx =
		steps.findIndex((s) => s === loc.pathname) !== -1
			? steps.findIndex((s) => s === loc.pathname)
			: 0;
	const current = Math.max(1, idx + 1);

	 return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-500 flex items-center justify-center">
      <Card className="w-full max-w-3xl p-8 shadow-xl backdrop-blur-md">
        <CardHeader>
          <ProgressBar current={current} total={5} />
        </CardHeader>

        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
}