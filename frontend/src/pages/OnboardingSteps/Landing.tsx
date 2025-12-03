import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import avatar from "/assets/avatar/muskelaufbau/blauLevel4Aufbau.png";


export default function Landing() {
	const navigate = useNavigate();

	const handleStart = () => {
		// Wir speichern hier NICHTS — Onboarding beginnt erst bei BasicInfo
		navigate('/onboarding/basic');
	};

	return (
    <div className="flex flex-col items-center text-center p-15">
      <h1 className="text-5xl font-bold mb-11">
        Welcome to TrainEm!
      </h1>

      <p className="text-black-600 text-xl mb-15 max-w-md">
        Let’s set up your profile.
      </p>

      <Button
  onClick={() => navigate("/onboarding/basic")}
  size="lg"
  variant="default"
  className="px-20 py-8 text-lg bg-green-600 hover:gb-green-700 text-white"
>
  Start now
</Button>

 {/* Avatar unten rechts in der Landing-Card */}
      <img
        src={avatar}
        alt="Avatar"
        className="absolute bottom-8 right-9 w-30 opacity-100"
      />
    </div>
  );
}
