import React from 'react';
import { UserRole } from '../types';
import { 
  BadgeDollarSign, 
  Users, 
  Search, 
  Calculator, 
  Scale, 
  PieChart, 
  Building, 
  FileSpreadsheet, 
  History, 
  Wrench, 
  Bike, 
  ShieldAlert, 
  X,
  LogOut,
  Trash2
} from 'lucide-react';

interface SidebarProps {
  activeRole: UserRole;
  activeModule: string;
  onSelectModule: (moduleId: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  onOpenDataModal: () => void;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export function getRoleNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case 'cobrador':
      return [
        { id: 'cobranza', label: 'Cobranza Diaria', icon: BadgeDollarSign, badge: 'Hoy' },
        { id: 'clientes', label: 'Directorio y Registro', icon: Users },
        { id: 'saldos', label: 'Consulta de Saldos', icon: Search },
      ];
    case 'gerente':
      return [
        { id: 'simulador', label: 'Simulador y Créditos', icon: Calculator },
        { id: 'arqueo', label: 'Corte y Arqueo de Caja', icon: Scale },
        { id: 'cartera', label: 'Monitoreo de Cartera', icon: PieChart },
        { id: 'clientes', label: 'Clientes y Avales', icon: Users },
      ];
    case 'admin':
      return [
        { id: 'global', label: 'Tablero Global', icon: PieChart },
        { id: 'sucursales', label: 'Sucursales y Usuarios', icon: Building },
        { id: 'reportes', label: 'Reportes y Auditoría', icon: FileSpreadsheet },
        { id: 'auditoria', label: 'Bitácora de Cobros', icon: History },
      ];
    case 'taller':
      return [
        { id: 'taller', label: 'Mantenimiento Motos', icon: Wrench },
        { id: 'flotilla', label: 'Flotilla de Cobranza', icon: Bike },
        { id: 'auditoria', label: 'Historial de Servicios', icon: History },
      ];
  }
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeRole,
  activeModule,
  onSelectModule,
  isOpenMobile,
  onCloseMobile,
  onLogout,
  onOpenDataModal
}) => {
  const navItems = getRoleNavItems(activeRole);

  const content = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 w-64 select-none">
      {/* Top Sidebar Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#F07D08]">
            Módulos del Sistema
          </span>
          <h2 className="text-sm font-bold text-white mt-0.5">
            {activeRole === 'cobrador' && 'Asesoría y Cobranza'}
            {activeRole === 'gerente' && 'Gerencia de Sucursal'}
            {activeRole === 'admin' && 'Dirección General'}
            {activeRole === 'taller' && 'Taller y Mantenimiento'}
          </h2>
        </div>
        <button
          onClick={onCloseMobile}
          className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Items List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectModule(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-[#C42326] text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#F07D08]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-400 text-slate-950">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <button
          onClick={onOpenDataModal}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
          <span>Gestión de Base de Datos</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Cambiar de Rol / Salir</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 border-r border-slate-200">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
