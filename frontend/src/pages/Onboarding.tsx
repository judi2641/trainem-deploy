import { Outlet, useLocation } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
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
  const idx = steps.indexOf(loc.pathname);
  const current = idx !== -1 ? idx + 1 : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-300 to-green-500 flex items-center justify-center p-4">



   
      <Card className="w-full max-w-3xl shadow-xl p-5">

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
