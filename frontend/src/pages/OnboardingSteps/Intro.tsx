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
        Before you start, here’s how TrainEm works
      </p>

      <div className="grid gap-4 text-left">
        
        {/* Avatar Evolution */}
     <div className="p-4 bg-white shadow rounded-lg">
  <h2 className="text-xl font-semibold mb-4"> Avatar Evolution</h2>

  <div className="flex items-center justify-center gap-6">

    {/* Start: Brokkoli (dick) */}
    <img 
      src="/assets/avatar/abnahme/rotLevel1AbnahmeAbnahm.png"
      className="h-24 w-auto object-contain"
      alt="Start Avatar"
    />

    {/* Pfeil */}
    <span className="text-3xl font-bold">→</span>

    {/* Mittelstufe: Lauch */}
    <img 
      src="/assets/avatar/abnahme/rotLevel7Abnahme.png"
      className="h-24 w-auto object-contain"
      alt="Middle Avatar"
    />

    {/* Pfeil */}
    <span className="text-3xl font-bold">→</span>

    {/* Finale Stufe: Muskel-Maiskolbe */}
    <img 
      src="/assets/avatar/muskelaufbau/rotLevel7Aufbau.png"
      className="h-24 w-auto object-contain"
      alt="Final Avatar"
    />

  </div>
</div>




        {/* Daily Tasks */}
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold"> Daily Tasks</h2>
          <p className="text-gray-600">
            Every day you receive new tasks based on your goals — such as workouts, steps, stretching, or small challenges.
          </p>
      
        </div>

        {/* Points System */}
        <div className="p-4 bg-white shadow rounded-lg">
  <h2 className="text-xl font-semibold">Points & Rewards</h2>

  <p className="text-gray-600">
    Each completed task gives you points. You earn points by checking off the tasks you complete.
  </p>

  <p className="text-gray-600 mt-2 font-semibold">These points allow you to:</p>
  <ul className="list-disc ml-6 text-gray-600 mt-1">
    <li>Level up your profile</li>
    <li>Transform your avatar visually</li>
  </ul>

  <p className="text-gray-600 mt-2">
    It’s simple: <strong>More consistency = more points = stronger evolution!</strong>
  </p>
</div>


        {/* Personal Plan */}
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold"> Personalized Training Plan</h2>
          <p className="text-gray-600">
            Based on your goals and experience, TrainEm generates a training plan designed specifically for you.
          </p>
        </div>




      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6 justify-center">
        <Button
          variant="outline"
          onClick={() => navigate('/onboarding/CharacterColor')}
        >
          Back
        </Button>

        <Button onClick={() => navigate("/dashboard")}>
          Start your journey! 
        </Button>
      </div>
    </div>
  );
}
