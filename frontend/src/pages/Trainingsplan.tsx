
import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; 
import TrainingsplanArea from '../components/TrainingsplanArea';
import FaqPopup from '../components/FaqPopup';

export default function Trainingsplan() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar /> 

      <div className="flex-1 flex flex-col">
         <Header /> 
        <main className="flex-1 pt-0 pl-0 p-5 min-h-0 overflow-y-auto">
        <div className="flex justify-end mb-4 pr-1">
          <FaqPopup
            title="Trainingsplan FAQs"
            items={[
              'Hier kannst du Trainingspläne anlegen und deine Woche strukturieren.',
              'Plane deine Einheiten nach Tagen, um einen klaren Ablauf zu behalten.',
              'Mehr Features folgen – diese FAQs zeigen dir die Basisfunktionen.',
            ]}
          />
        </div>
        <TrainingsplanArea /> 
          
        </main>
      </div>
    </div>
  );
}
