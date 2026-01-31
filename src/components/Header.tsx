import { useEffect, useState } from "react";
import { HiOutlineUser, HiOutlineSearch, HiOutlineMail } from "react-icons/hi";
import { Moon, Sun } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from "react-router-dom";
import { applyInvertTheme, loadStoredInvertTheme } from "../util/theme";
import { Button } from "@/components/ui/button";

export default function Header(){
    const {user} = useAuth0();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(loadStoredInvertTheme());
    }, []);

    function handleThemeToggle() {
        const next = !isDark;
        setIsDark(next);
        applyInvertTheme(next);
    }

    return (
        
        <div className="sticky h-15 bg-white shadow-md p-6 rounded-xl m-5 ml-0 flex items-center justify-between">
            {/* Suchleiste */}
            <div className="h-10 bg-gray-100 rounded-full ml-10 w-100 flex items-center p-5"> 
                <HiOutlineSearch className="w-5 h-5 "></HiOutlineSearch> 
                <input  type="text" name="search" placeholder="Search" className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-textDark placeholder:text-gray-500 focus:outline-none sm:text-sm/6" />
            </div>
            {/* User Icon */}
            <div className="flex items-center">
                <Button
                  variant={isDark ? "default" : "outline"}
                  size="sm"
                  onClick={handleThemeToggle}
                  className="mr-4"
                  aria-pressed={isDark}
                >
                    {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </Button>
                <NavLink to="#" className="bg-gray-100 h-7 w-7 rounded-full flex items-center justify-center mr-4 hover:bg-gray-200">
                    <HiOutlineUser className="w-5 h-5 "></HiOutlineUser>
                </NavLink>
                {/* Notification icon */}
                <NavLink to="#" className="bg-gray-100 h-7 w-7 rounded-full flex items-center justify-center mr-4 hover:bg-gray-200">
                    <HiOutlineMail className="w-5 h-5 "></HiOutlineMail>
                </NavLink>
                {/* User Info */}
                <div className= "flex flex-col"> 
                <span className="text-base font-bold text-textDark">{user?.name}</span>
                <span className="text-sm text-textDark/40">{user?.email}</span></div>
                </div>

        </div>

    );
}
