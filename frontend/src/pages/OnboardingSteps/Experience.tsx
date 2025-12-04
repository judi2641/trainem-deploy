import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../context/OnboardingContext";
import type { TrainingsExperience } from "../../../../shared/types/other/TrainingsExperience";
import avatar from "/assets/avatar/onboarding/AvatarExperienceOnboarding.png";
import AvatarExperience from "/assets/avatar/onboarding/AvatarExperienceOnboarding.png";



import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Experience() {
  const navigate = useNavigate();
  const { planData, updatePlanData } = useOnboarding();

  const [selectedExperience, setSelectedExperience] =
    useState<TrainingsExperience | null>(planData.experience ?? null);

  const [weight, setWeight] = useState(planData.weight ?? "");
  const [height, setHeight] = useState(planData.height ?? "");

  const handleNext = () => {
    if (!selectedExperience) {
      alert("Bitte wähle ein Erfahrungslevel aus.");
      return;
    }

    updatePlanData({
      experience: selectedExperience,
      weight: weight ? Number(weight) : undefined,
      height: height ? Number(height) : undefined,
    });

    navigate("/onboarding/goals");
  };

  const levels = [
    { key: "starter", label: "Starter" },
    { key: "intermediate", label: "Intermediate" },
    { key: "pro", label: "Pro" },
  ];

  return (
  <div className="space-y-8">

    {/* Bodytype Info */}
    <div>
      <h2 className="text-xl font-bold mb-4">Bodytype Info</h2>

      {/* Weight */}
      <div className="mb-4">
        <Label htmlFor="weight">Weight (kg)</Label>
        <Input
          id="weight"
          type="number"
          placeholder="..."
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Height */}
      <div className="mb-2">
        <Label htmlFor="height">Height (cm)</Label>
        <Input
          id="height"
          type="number"
          placeholder="..."
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="mt-1"
        />
      </div>
    </div>

    {/* Experience */}
    <div>
      <h2 className="text-xl font-bold mb-2">Your Experience</h2>
      <p className="text-gray-600 mb-10">
        How much training experience do you have?
      </p>

      <div className="flex gap-4 justify-center mt-4">
        {levels.map((lvl) => (
          <Button
            key={lvl.key}
            variant={selectedExperience === lvl.key ? "default" : "outline"}
            onClick={() => setSelectedExperience(lvl.key as TrainingsExperience)}
            className={`
              px-8 py-3 text-lg rounded-lg transition
              ${
                selectedExperience === lvl.key
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-gray-300"
              }
            `}
          >
            {lvl.label}
          </Button>
        ))}
      </div>
    </div>

    {/* Avatar unten zentriert */}
    <div className="flex justify-center mt-6">
      <img
        src={AvatarExperience}
        alt="Avatar"
        className="w-20 h-auto select-none"
      />
    </div>

    {/* Navigation */}
    <div className="flex justify-between mt-10">
      <Button
        onClick={() => navigate("/onboarding")}
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
