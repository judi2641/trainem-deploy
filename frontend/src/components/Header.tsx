import { HiOutlineUser, HiOutlineSearch, HiOutlineMail } from "react-icons/hi";
import { useAuth0 } from "@auth0/auth0-react";
export default function Header(){
    const {user} = useAuth0();
    return (
        
        <div className="h-25 bg-white shadow-md p-6 rounded-xl m-5 ml-0 flex items-center justify-between">
            {/* Suchleiste */}
            <div className="h-13 bg-gray-100 rounded-full ml-10 w-100 flex items-center p-5"> 
                <HiOutlineSearch className="w-5 h-5 "></HiOutlineSearch> 
                <input  type="text" name="search" placeholder="Search" className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-textDark placeholder:text-gray-500 focus:outline-none sm:text-sm/6" />
            </div>
            {/* User Icon */}
            <div className="flex items-center">
                <a href="#" className="bg-gray-100 h-15 w-15 rounded-full flex items-center justify-center mr-4 hover:bg-gray-200">
                    <HiOutlineUser className="w-5 h-5 "></HiOutlineUser>
                </a>
                {/* Notification icon */}
                <a href="#" className="bg-gray-100 h-15 w-15 rounded-full flex items-center justify-center mr-4 hover:bg-gray-200">
                    <HiOutlineMail className="w-5 h-5 "></HiOutlineMail>
                </a>
                {/* User Info */}
                <div className= "flex flex-col"> 
                <span className="text-base font-bold text-textDark">{user?.name}</span>
                <span className="text-sm text-textDark/40">{user?.email}</span></div>
                </div>

        </div>

    );
}