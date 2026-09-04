import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#FFF9F2] border-t border-[#F5E6D3] py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Virtusscholar. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/admin-access" className="text-xs text-gray-400 hover:text-[#0D9488] transition-colors">
            Admin Access
          </Link>
        </div>
      </div>
    </footer>
  );
}
