import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Intro() {
  const navigate = useNavigate();

  return (
    <div className="px-6 max-w-xl mx-auto">

      {/* Titel */}
      <h1 className="text-3xl font-bold text-gray-900 text-center">
        Glückwunsch!
      </h1>

      {/* Beschreibung */}
      <p className="text-gray-700 text-lg leading-relaxed text-center mt-6">
        Du hast alle Schritte erfolgreich abgeschlossen.
        <br /><br />
        TrainEm hat nun alle Informationen, um deinen persönlichen Trainingsplan
        zu erstellen — basierend auf:
      </p>

      {/* Features */}
      <div className="text-gray-800 space-y-2 font-medium text-center mt-4">
        <p>• Deinem Trainingsziel</p>
        <p>• Deiner Erfahrung</p>
        <p>• Deiner Trainingsfrequenz</p>
        <p>• Deinem gewählten Charakter</p>
      </div>

      {/* Abschluss-Text */}
      <p className="text-gray-700 text-lg text-center mt-6">
        Du kannst jetzt loslegen. Viel Spaß beim Trainieren!
      </p>

      {/* Navigation wie auf allen anderen Seiten */}
      <div className="flex justify-between mt-10 w-full">

        {/* Zurück-Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="h-11 w-11 p-0 flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Weiter zum Dashboard */}
        <Button
          onClick={() => navigate("/dashboard")}
          className="h-11 w-11 p-0 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>

      </div>
    </div>
  );
}
