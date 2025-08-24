'use client'

import { FaHome, FaSearch, FaBook, FaUser, FaUsers, FaBars, FaTimes, FaSun, FaMoon, FaDesktop } from 'react-icons/fa';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopNavbarProps {
  user: User | null;
  profile: { username: string; avatar_url: string } | null;
  onSignOut: () => void;
}

export default function TopNavbar({ user, profile, onSignOut }: TopNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-background text-foreground py-2 px-4 md:px-6 shadow-lg rounded-xl mx-auto mt-4 flex items-center gap-x-8 relative">
      <div className="text-xl font-bold">
        Codex
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex flex-grow space-x-10">
        <Link href="/dashboard" className="flex items-center text-base hover:text-gray-300 transition duration-300">
          <FaHome className="mr-2" /> Dashboard
        </Link>
        <Link href="/discover" className="flex items-center text-base hover:text-gray-300 transition duration-300">
          <FaSearch className="mr-2" /> Découvrir
        </Link>
        <Link href="/library" className="flex items-center text-base hover:text-gray-300 transition duration-300">
          <FaBook className="mr-2" /> Mes Livres
        </Link>
        <Link href="/groups" className="flex items-center text-base hover:text-gray-300 transition duration-300">
          <FaUsers className="mr-2" /> Groupes de Lecture
        </Link>
        <Link href="/profile" className="flex items-center text-base hover:text-gray-300 transition duration-300">
          <FaUser className="mr-2" /> Mon Profil
        </Link>
      </div>

      {/* Desktop Sign Out Button and Theme Toggle */}
      <div className="hidden md:flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
              {theme === 'light' && <FaSun className="h-5 w-5" />}
              {theme === 'dark' && <FaMoon className="h-5 w-5" />}
              {theme === 'system' && <FaDesktop className="h-5 w-5" />}
              {!theme && <FaDesktop className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <FaSun className="mr-2 h-4 w-4" />
              Clair
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <FaMoon className="mr-2 h-4 w-4" />
              Sombre
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <FaDesktop className="mr-2 h-4 w-4" />
              Système
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {user && (
          <Button onClick={onSignOut} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold py-2 px-4 rounded-md transition duration-300">
            Déconnexion
          </Button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center ml-auto">
        <button onClick={toggleMenu} className="text-foreground focus:outline-none">
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-800 shadow-lg rounded-b-xl py-4 z-50">
          <div className="flex flex-col items-center space-y-4">
            <Link href="/dashboard" className="flex items-center text-lg hover:text-gray-300 transition duration-300" onClick={toggleMenu}>
              <FaHome className="mr-2" /> Dashboard
            </Link>
            <Link href="/discover" className="flex items-center text-lg hover:text-gray-300 transition duration-300" onClick={toggleMenu}>
              <FaSearch className="mr-2" /> Découvrir
            </Link>
            <Link href="/library" className="flex items-center text-lg hover:text-gray-300 transition duration-300" onClick={toggleMenu}>
              <FaBook className="mr-2" /> Mes Livres
            </Link>
            <Link href="/groups" className="flex items-center text-lg hover:text-gray-300 transition duration-300" onClick={toggleMenu}>
              <FaUsers className="mr-2" /> Groupes de Lecture
            </Link>
            <Link href="/profile" className="flex items-center text-lg hover:text-gray-300 transition duration-300" onClick={toggleMenu}>
              <FaUser className="mr-2" /> Mon Profil
            </Link>
            {/* Mobile Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="lg" className="text-foreground hover:bg-muted w-full">
                  {theme === 'light' && <FaSun className="mr-2 h-5 w-5" />}
                  {theme === 'dark' && <FaMoon className="mr-2 h-5 w-5" />}
                  {theme === 'system' && <FaDesktop className="mr-2 h-5 w-5" />}
                  {!theme && <FaDesktop className="mr-2 h-5 w-5" />}
                  <span>Changer de thème</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <FaSun className="mr-2 h-4 w-4" />
                  Clair
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <FaMoon className="mr-2 h-4 w-4" />
                  Sombre
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <FaDesktop className="mr-2 h-4 w-4" />
                  Système
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {user && (
              <Button onClick={() => { onSignOut(); toggleMenu(); }} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold py-2 px-4 rounded-md transition duration-300 w-auto">
                Déconnexion
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}