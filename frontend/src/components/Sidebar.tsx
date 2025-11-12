import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
  HiOutlineViewGrid,
  HiOutlineCheckCircle,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
  HiOutlineLogout
} from 'react-icons/hi'; 


export default function Sidebar() {
  const {logout} = useAuth0();
  const activeVisuals: string = "flex items-center p-2 rounded-lg bg-primary/15 text-primary font-semibold";
  const nonActiveVisuals: string = "flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100";
  return (
    // Der Haupt-Container der Sidebar
    // flex flex-col: Stellt die Kinder (Logo, Nav, Download-Box) untereinander
    // h-screen: Macht die Sidebar 100% so hoch wie der Bildschirm
    // w-64: Feste Breite von 64 Einheiten (ca. 256px)
    // bg-white: Weißer Hintergrund
    // p-6: 6 Einheiten Padding (Polsterung) innen
    // shadow-md: Ein mittlerer Schatten
    <div className="w-64 bg-white p-6 shadow-md flex rounded-xl m-5 flex-col ">
      
       
      <div className="flex items-center mb-8">
        {/*<img src="/vite.svg" alt="Trainem Logo" className="h-8 w-8" /> */}
        <NavLink to= "/"className="text-2xl font-bold text-gray-800 ml-2">Trainem</NavLink>
      </div>
        
      {/* 2. Navigations-Menü */}
      <nav className="grow"> 
        {/* MENÜ-Sektion */}
        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Menu</h3>
        <ul className="space-y-2">
          {/* Aktiver NavLink (Dashboard) */}
          <li>
            <NavLink to="/dashboard" className={({isActive}) => (
                isActive
                ? activeVisuals
                : nonActiveVisuals
              )}>
              <HiOutlineViewGrid className="w-5 h-5" />
              <span className="ml-3">Dashboard</span>
            </NavLink>
          </li>
          {/* Inaktiver NavLink (Tasks) */}
          <li>
            <NavLink to="/tasks" className={({isActive}) => (
                isActive
                ? activeVisuals
                : nonActiveVisuals
              )}>
              <HiOutlineCheckCircle className="w-5 h-5" />
              <span className="ml-3">Tasks</span>
              
            </NavLink>
          </li>
          <li>
            <NavLink to="/trainingsplan" className={({isActive}) => (
                isActive
                ? activeVisuals
                : nonActiveVisuals
              )}>
              <HiOutlineCalendar className="w-5 h-5" />
              <span className="ml-3">Trainingsplan</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/statistiken" className={({isActive}) => (
                isActive
                ? activeVisuals
                : nonActiveVisuals
              )}>
              <HiOutlineChartBar className="w-5 h-5" />
              <span className="ml-3">Statistiken</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/gruppe" className={({isActive}) => (
                isActive
                ? activeVisuals
                : nonActiveVisuals
              )}>
              <HiOutlineUserGroup className="w-5 h-5" />
              <span className="ml-3">Gruppe</span>
            </NavLink>
          </li>
        </ul>

        {/* GENERAL-Sektion */}
        <h3 className="text-xs font-semibold text-gray-400 uppercase mt-8 mb-2">General</h3>
        <ul className="space-y-2">
          <li>
            <NavLink to="" className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <HiOutlineCog className="w-5 h-5" />
              <span className="ml-3">Settings</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="" className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <HiOutlineQuestionMarkCircle className="w-5 h-5" />
              <span className="ml-3">Help</span>
            </NavLink>
          </li>
          <li>
            <button onClick={() => logout()} className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <HiOutlineLogout className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </button>
          </li>
        </ul>
      </nav>

      
    </div>
  );
}