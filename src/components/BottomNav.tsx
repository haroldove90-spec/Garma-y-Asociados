import React from 'react';
import { UserRole } from '../types';
import { getRoleNavItems } from './Sidebar';

interface BottomNavProps {
  activeRole: UserRole;
  activeModule: string;
  onSelectModule: (moduleId: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeRole,
  activeModule,
  onSelectModule
}) => {
  const items = getRoleNavItems(activeRole);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-1 py-1 safe-area-bottom">
      <div className={`grid ${items.length === 4 ? 'grid-cols-4' : 'grid-cols-3'} max-w-md mx-auto items-center`}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 relative cursor-pointer active:scale-95 ${
                isActive
                  ? 'text-[#C42326]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px] scale-110 text-[#C42326]' : 'text-slate-500'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#F07D08]" />
                )}
              </div>
              <span className={`text-[10px] sm:text-[11px] mt-0.5 tracking-tight truncate max-w-full font-medium ${isActive ? 'font-bold text-[#C42326]' : 'text-slate-600'}`}>
                {item.shortLabel}
              </span>
              {isActive && (
                <span className="w-4 h-0.5 bg-[#C42326] rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
