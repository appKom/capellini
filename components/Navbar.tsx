import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import LoginIcon from "./icons/icons/LogInIcon";
import LogOutIcon from "./icons/icons/LogOutIcon";
import AdminIcon from "./icons/icons/AdminIcon";
import Button from "./Button";
import ThemeToggle from "./theme/ThemeToggle";
import DropdownMenu from "./DropdownMenu";
import { useTheme } from "../lib/hooks/useTheme";

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const theme = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => signOut();
  const handleLogin = () => signIn("auth0");
  const smallOnlineLogoSrc =
    theme === "dark" ? "/Online_hvit_o.svg" : "/Online_bla_o.svg";
  const onlineLogoSrc =
    theme === "dark" ? "/Online_hvit.svg" : "/Online_bla.svg";

  return (
    <div className="border-b-[1px] border-gray-300 dark:border-0 bg-zinc-50 dark:bg-gray-800">
      <div className="hidden lg:flex justify-between w-full px-5 py-5 sm:items-center">
        <Link href="/" passHref aria-label="Online logo">
          <Image
            src={onlineLogoSrc}
            width={100 * 1.5}
            height={30 * 1.5}
            priority
            alt="Online logo"
            className="transition-all cursor-pointer hover:opacity-60"
          />
        </Link>
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:gap-5 sm:items-center text-online-darkTeal dark:text-white">
          {session ? (
            <>
              <div className="text-right">
                Logget inn som{" "}
                <span className="font-medium">{session.user?.name}</span>
              </div>

              {session.user?.role === "admin" && (
                <Button
                  title="Admin"
                  color="orange"
                  size="small"
                  icon={<AdminIcon className="w-4 h-4" />}
                  href="/admin"
                />
              )}
              {session.user?.isCommittee && (
                <Button
                  title="For komiteer"
                  color="blue"
                  size="small"
                  icon={<UserGroupIcon className="w-5 h-5" />}
                  href="/committee"
                />
              )}
              <Button
                title="Logg ut"
                color="white"
                size="small"
                icon={<LogOutIcon className="w-4 h-4" />}
                onClick={handleLogout}
              />
            </>
          ) : (
            <>
              <Button
                title="Logg inn"
                color="blue"
                size="small"
                icon={<LoginIcon className="w-4 h-4" />}
                onClick={handleLogin}
              />
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
      <div className="relative lg:hidden flex justify-between items-center px-5 py-5">
        <Link href="/" passHref aria-label="Online logo">
          <Image
            src={smallOnlineLogoSrc}
            width={50}
            height={30 * 1.5}
            alt="Online logo"
            className="sm:hidden transition-all cursor-pointer hover:opacity-60"
          />
          <Image
            src={onlineLogoSrc}
            width={100 * 1.5}
            height={30 * 1.5}
            priority
            alt="Online logo"
            className="hidden sm:block transition-all cursor-pointer hover:opacity-60"
          />
        </Link>
        <div className="relative">
          <button onClick={toggleDropdown} className="flex justify-end">
            <Bars3Icon
              className={`w-10 h-10 text-gray-500 transition-transform transform dark:text-white ${
                isDropdownOpen ? "rotate-45 opacity-0" : "rotate-0 opacity-100"
              }`}
            />
            <XMarkIcon
              className={`w-10 h-10 text-gray-500 transition-transform transform dark:text-white absolute top-0 right-0 ${
                isDropdownOpen ? "rotate-0 opacity-100" : "rotate-45 opacity-0"
              }`}
            />
          </button>
          {isDropdownOpen && (
            <DropdownMenu
              session={session}
              handleLogin={handleLogin}
              handleLogout={handleLogout}
              toggleDropdown={toggleDropdown}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
