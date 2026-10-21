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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg px-2 py-1 safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-150 relative min-w-[64px] ${
                isActive
                  ? 'text-[#C42326]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] scale-110 text-[#C42326]' : 'text-slate-500'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-[#F07D08]" />
                )}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight font-medium ${isActive ? 'font-bold text-[#C42326]' : 'text-slate-600'}`}>
                {item.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
