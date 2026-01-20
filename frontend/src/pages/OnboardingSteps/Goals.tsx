import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import type { TrainingsGoals } from '../../../../shared/types/other/TrainingsGoal';
import AvatarGoals from "/assets/avatar/onboarding/AvatarGoalsOnboarding.png";


import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function Goals() {
  const navigate = useNavigate();
  const { planData, updatePlanData } = useOnboarding();

  const [selected, setSelected] = useState<TrainingsGoals | null>(planData.goal || null);

  const options: { key: TrainingsGoals; label: string; desc: string }[] = [
    {
      key: 'Muskelaufbau: Gewicht senken',
      label: 'Lose Weight',
      desc: 'Reduce your body weight sustainably.',
    },
    {
      key: 'Muskelaufbau: Gewicht halten',
      label: 'Maintain Weight',
      desc: 'Stay balanced and maintain your progress.',
    },
    {
      key: 'Muskelaufbau: Gewicht erhöhen',
      label: 'Build Muscle',
      desc: 'Increase strength and gain muscle mass.',
    },
  ];

  const handleNext = () => {
    if (!selected) return;
    updatePlanData({ goal: selected });
    navigate('/onboarding/schedule');
  };

  return (
  <div>

    {/* TITLE */}
    <h2 className="text-lg font-semibold mb-2">What is your main goal?</h2>
    <p className="text-sm text-gray-600 mb-4">Select one primary fitness goal.</p>

    {/* GOAL BUTTONS */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((o, index) => {
        const isSelected = o.key === selected;

        return (
          <Button
            key={o.key}
            variant="outline"
            onClick={() => {
              setSelected(o.key);
              updatePlanData({ goal: o.key });
            }}
            className={`
              p-4 rounded-xl text-left flex flex-col gap-1
              border h-auto
              ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-300 hover:bg-gray-50"
              }
              ${
                index === 2 
                  ? "md:col-span-2 md:mx-auto md:w-1/2"
                  : ""
              }
            `}
          >
            <span className="font-semibold text-gray-900">{o.label}</span>
          </Button>
        );
      })}
    </div>

    {/* ⭐ AVATAR UNTER BUILD MUSCLE (zentriert) */}
    <div className="w-full flex justify-center mt-6">
      <img
        src={AvatarGoals}
        alt="Avatar"
        className="w-24 h-auto"
      />
    </div>

    {/* NAVIGATION */}
    <div className="flex justify-between mt-6">
      <Button
        onClick={() => navigate('/onboarding/experience')}
        variant="outline"
        className="h-11 w-11 p-0 flex items-center justify-center"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <Button
        onClick={handleNext}
        className="h-11 w-11 p-0 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white"
      >
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>

  </div>
)};
