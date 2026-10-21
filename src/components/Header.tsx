import React from 'react';
import { UserRole, Branch } from '../types';
import { GarmaLogo, GarmaIcon } from './Logos';
import { 
  LogOut, 
  Download, 
  Trash2, 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Wrench, 
  CheckCircle2, 
  Menu
} from 'lucide-react';

interface HeaderProps {
  activeRole: UserRole;
  branches: Branch[];
  activeBranchId: string;
  onBranchChange: (branchId: string) => void;
  onLogout: () => void;
  onOpenInstallModal: () => void;
  onOpenDataModal: () => void;
  onToggleSidebar?: () => void;
  isInstallable?: boolean;
  isDemoSuppressed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  branches,
  activeBranchId,
  onBranchChange,
  onLogout,
  onOpenInstallModal,
  onOpenDataModal,
  onToggleSidebar,
  isInstallable,
  isDemoSuppressed
}) => {
  const getRoleBadge = () => {
    switch (activeRole) {
      case 'cobrador':
        return {
          title: 'Cobrador / Asesor',
          color: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: <UserCheck className="w-3.5 h-3.5 text-[#F07D08]" />
        };
      case 'gerente':
        return {
          title: 'Gerente de Sucursal',
          color: 'bg-red-100 text-red-900 border-red-300',
          icon: <Building2 className="w-3.5 h-3.5 text-[#C42326]" />
        };
      case 'admin':
        return {
          title: 'Administrador (Hugo García)',
          color: 'bg-slate-900 text-white border-slate-700',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-[#F07D08]" />
        };
      case 'taller':
        return {
          title: 'Taller de Motos',
          color: 'bg-zinc-800 text-amber-300 border-zinc-700',
          icon: <Wrench className="w-3.5 h-3.5 text-amber-400" />
        };
    }
  };

  const roleInfo = getRoleBadge();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Sidebar Menu Toggle + Unencapsulated Full System Logo */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden"
              aria-label="Abrir Menú"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          {/* Logotipo del Sistema (Sin encapsular, completo y sin recortes) */}
          <div className="flex items-center">
            <GarmaLogo className="h-9 sm:h-12 w-auto max-w-[170px] sm:max-w-[260px] object-contain" />
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Active Branch Selector (when role allows multi-branch or branch context) */}
          {activeRole === 'admin' ? (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={activeBranchId}
                onChange={(e) => onBranchChange(e.target.value)}
                className="bg-transparent text-slate-900 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="todas">🏢 Todas las Sucursales (Consolidado)</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nombre}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate max-w-[150px]">
                {branches.find(b => b.id === activeBranchId)?.nombre || 'Sucursal Matriz'}
              </span>
            </div>
          )}

          {/* Active Role Indicator */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${roleInfo.color} shrink-0`}>
            {roleInfo.icon}
            <span className="hidden xs:inline">{roleInfo.title}</span>
          </div>

          {/* Database / Sample Data Manager Button */}
          <button
            onClick={onOpenDataModal}
            title={isDemoSuppressed ? "Base de datos limpia (Modo Real)" : "Gestionar datos de muestra y Supabase"}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer text-slate-700 bg-slate-50 hover:bg-slate-100 border-slate-300"
          >
            <Trash2 className="w-3.5 h-3.5 text-[#C42326]" />
            <span className="hidden lg:inline">
              {isDemoSuppressed ? "Base Limpia" : "Borrar Muestra"}
            </span>
          </button>

          {/* PWA Quick Install Button */}
          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#000000] text-white hover:bg-zinc-800 text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
            title="Instalar Garma y Asociados en su dispositivo"
          >
            <Download className="w-3.5 h-3.5 text-[#F07D08]" />
            <span>Instalar</span>
          </button>

          {/* Logout / Switch Role Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 text-[#C42326] hover:bg-red-100 text-xs font-semibold transition active:scale-95 cursor-pointer"
            title="Cerrar sesión y volver al inicio"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
