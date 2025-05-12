"use client";
import { User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [showLogout, setShowLogout] = useState(false);

  const handleProfileClick = () => {
    if (session) {
      setShowLogout(!showLogout);
    } else {
      signIn();
    }
  };

  return (
    <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md py-4 px-4 md:px-6 flex items-center justify-between rounded-b-2xl relative">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight whitespace-nowrap">
        📝 My To-Do List
      </h1>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={handleProfileClick}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-white text-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-100 transition overflow-hidden">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User className="w-5 h-5" />
            )}
          </button>

          {showLogout && (
            <div
              className="absolute right-0 mt-2 bg-white text-indigo-600 rounded-md px-4 py-2 shadow-md cursor-pointer z-10 text-sm sm:text-base"
              onClick={() => {
                signOut();
                setShowLogout(false);
              }}>
              Logout
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
