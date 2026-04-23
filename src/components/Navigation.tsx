import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Settings } from 'lucide-react';

export default function Navigation() {
  const navItems = [
    { icon: Home, label: '홈', path: '/' },
    { icon: Search, label: '탐색', path: '/explore' },
    { icon: Library, label: '내 서재', path: '/library' },
    { icon: Settings, label: '설정', path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#FFFDFB]/80 backdrop-blur-md border-t border-[#E6D5C3] px-6 py-3 flex justify-around items-center z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-[#8B5E3C]' : 'text-[#AFAFA8] hover:text-[#8B5E3C]'
            }`
          }
        >
          <item.icon size={24} />
          <span className="text-xs font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
