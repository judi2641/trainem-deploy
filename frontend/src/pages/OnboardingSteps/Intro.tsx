import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function OnboardingSummary() {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome to TrainEm! 
      </h1>

      <p className="text-gray-600">
        Here is a quick overview of your new fitness app.
      </p>

      <div className="grid gap-4 text-left">
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">🏋️ Your Avatar</h2>
          <p className="text-gray-600">
            Your avatar grows with your progress and shows your development over time.
          </p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">📅 Training Plan</h2>
          <p className="text-gray-600">
            Based on your goals, you receive a personalized training plan tailored to you.
          </p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">📊 Statistics</h2>
          <p className="text-gray-600">
            Track your workouts, level-ups, and daily activity.
          </p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">🔥 Tasks & Achievements</h2>
          <p className="text-gray-600">
            Complete challenges and unlock new avatars as you improve.
          </p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">🧭 Navigation</h2>
          <p className="text-gray-600">
            The sidebar helps you navigate quickly through all areas of the app.
          </p>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 mt-6 justify-center">
        <Button
          variant="outline"
          onClick={() => navigate("/onboarding/CharacterColor")}
        >
          Back
        </Button>

        <Button onClick={() => navigate("/dashboard")}>
          Let’s get started! 🚀
        </Button>
      </div>
    </div>
  );
}
