import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, Bookmark, FileText, Settings, LayoutList } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  role: 'student' | 'admin';
}

export default function Sidebar({ role }: SidebarProps) {
  const studentLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Discovery & Matcher' },
    { to: '/profile', icon: User, label: 'My Profile' },
    { to: '/my-scholarships', icon: Bookmark, label: 'Saved Scholarships' },
    { to: '/applications', icon: FileText, label: 'Application Tracker' },
  ];

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Admin Dashboard' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Discovery & Matcher (Student View)' },
    { to: '/profile', icon: User, label: 'My Profile (Student View)' },
    { to: '/my-scholarships', icon: Bookmark, label: 'Saved Scholarships (Student View)' },
    { to: '/applications', icon: FileText, label: 'Application Tracker (Student View)' },
  ];

  const links = role === 'student' ? studentLinks : adminLinks;

  return (
    <aside className="w-64 bg-[#FFF9F2] border-r border-[#F5E6D3] hidden md:flex flex-col">
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
                isActive 
                  ? "bg-[#EC4899]/10 text-[#EC4899]" 
                  : "text-gray-600 hover:bg-[#FFF9F2] hover:text-[#EC4899]"
              )}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
