import React from 'react';
import { UserRole } from '../types';
import { CobradorLogo, GerenteLogo, AdminLogo, MotoWorkshopLogo } from './Logos';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  const roles: { id: UserRole; name: string; logo: React.ReactNode }[] = [
    {
      id: 'cobrador',
      name: 'Cobrador / Asesor de Sucursal',
      logo: <CobradorLogo className="w-20 h-20 sm:w-28 sm:h-28" />
    },
    {
      id: 'gerente',
      name: 'Gerente de Sucursal',
      logo: <GerenteLogo className="w-20 h-20 sm:w-28 sm:h-28" />
    },
    {
      id: 'admin',
      name: 'Administrador General (Hugo García)',
      logo: <AdminLogo className="w-20 h-20 sm:w-28 sm:h-28" />
    },
    {
      id: 'taller',
      name: 'Taller de Motos y Flotilla',
      logo: <MotoWorkshopLogo className="w-20 h-20 sm:w-28 sm:h-28" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 md:p-10 select-none">
      <div className="w-full max-w-6xl">
        {/* Grid: 2 Columns Mobile / 4 Columns Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className="group relative flex flex-col items-center justify-between p-5 sm:p-8 rounded-2xl bg-white border-2 border-slate-200/80 hover:border-[#C42326] shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-95 text-center aspect-square"
            >
              <div className="flex-1 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                {role.logo}
              </div>

              {/* Solo Nombre del Rol, sin descripciones */}
              <div className="w-full pt-3 border-t border-slate-100">
                <span className="block text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#C42326] transition-colors leading-tight">
                  {role.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
