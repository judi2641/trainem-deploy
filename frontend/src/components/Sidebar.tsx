// src/components/Sidebar.tsx
import {
  HiOutlineViewGrid,
  HiOutlineCheckCircle,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
  HiOutlineLogout
} from 'react-icons/hi'; // Importiere die Icons

export default function Sidebar() {
  return (
    // Der Haupt-Container der Sidebar
    // flex flex-col: Stellt die Kinder (Logo, Nav, Download-Box) untereinander
    // h-screen: Macht die Sidebar 100% so hoch wie der Bildschirm
    // w-64: Feste Breite von 64 Einheiten (ca. 256px)
    // bg-white: Weißer Hintergrund
    // p-6: 6 Einheiten Padding (Polsterung) innen
    // shadow-md: Ein mittlerer Schatten
    <aside className="w-64 bg-white p-6 shadow-md flex flex-col h-screen">
      
       
      <div className="flex items-center mb-8">
        {/*<img src="/vite.svg" alt="Trainem Logo" className="h-8 w-8" /> */}
        <span className="text-2xl font-bold text-gray-800 ml-2">Trainem</span>
      </div>
        
      {/* 2. Navigations-Menü */}
      <nav className="flex-grow"> {/* flex-grow sorgt dafür, dass dieser Block wächst, aber die Download-Box unten bleibt */}
        {/* MENÜ-Sektion */}
        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Menu</h3>
        <ul className="space-y-2">
          {/* Aktiver Link (Dashboard) */}
          <li>
            <a href="#" className="flex items-center p-2 rounded-lg bg-green-100 text-green-700 font-semibold">
              <HiOutlineViewGrid className="w-5 h-5" />
              <span className="ml-3">Dashboard</span>
            </a>
          </li>
          {/* Inaktiver Link (Tasks) */}
          <li>
            <a href="#" className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <HiOutlineCheckCircle className="w-5 h-5" />
              <span className="ml-3">Tasks</span>
              <span className="ml-auto bg-gray-700 text-white text-xs font-bold px-2 py-0.5 rounded-full"></span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <HiOutlineCalendar className="w-5 h-5" />
              <span className="ml-3">Calendar</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <HiOutlineChartBar className="w-5 h-5" />
              <span className="ml-3">Analytics</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <HiOutlineUserGroup className="w-5 h-5" />
              <span className="ml-3">Gruppe</span>
            </a>
          </li>
        </ul>

        {/* GENERAL-Sektion */}
        <h3 className="text-xs font-semibold text-gray-400 uppercase mt-8 mb-2">General</h3>
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <HiOutlineCog className="w-5 h-5" />
              <span className="ml-3">Settings</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <HiOutlineQuestionMarkCircle className="w-5 h-5" />
              <span className="ml-3">Help</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <HiOutlineLogout className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* 3. Download Box (Ganz unten) */}
      {/* mt-auto: margin-top: auto. Das ist der Magie-Trick! 
          Weil der Parent (aside) flex flex-col ist, schiebt mt-auto 
          diesen Block an das untere Ende. */}
      <div className="mt-auto p-4 bg-gray-900 rounded-lg text-white text-center">
        {/* Ich habe den Hintergrund hier "dumm" als graue Box gemacht, 
            das Bild-Overlay ist für einen Dummy zu viel Aufwand. */}
        
      </div>
    </aside>
  );
}