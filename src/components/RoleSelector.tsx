import React from 'react';
import { UserRole } from '../types';
import { GarmaLogo, CobradorLogo, GerenteLogo, AdminLogo, HeavyMachineryLogo } from './Logos';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  const roles: { id: UserRole; name: string; logo: React.ReactNode }[] = [
    {
      id: 'cobrador',
      name: 'Cobrador / Asesor de Sucursal',
      logo: <CobradorLogo className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" />
    },
    {
      id: 'gerente',
      name: 'Gerente de Sucursal',
      logo: <GerenteLogo className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" />
    },
    {
      id: 'admin',
      name: 'Administrador General (Hugo García)',
      logo: <AdminLogo className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" />
    },
    {
      id: 'taller',
      name: 'Taller y Maquinaria Pesada',
      logo: <HeavyMachineryLogo className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" />
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 flex flex-col justify-center items-center p-3.5 sm:p-6 md:p-10 overflow-y-auto select-none">
      <div className="w-full max-w-5xl my-auto flex flex-col items-center">
        {/* Logo del Sistema colocado en el Home arriba de los accesos a los roles (Completamente libre, sin encapsular, sin fondo, sin marcos ni recortes) */}
        <div className="mb-8 sm:mb-12 w-full flex justify-center items-center shrink-0">
          <GarmaLogo className="w-56 sm:w-72 md:w-84 max-w-[85vw] h-auto object-contain mx-auto" />
        </div>

        {/* Cuadrícula: 2 Columnas en Móvil / 4 Columnas en Escritorio */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className="group relative flex flex-col items-center justify-between p-3.5 sm:p-6 rounded-2xl bg-white border-2 border-slate-200/90 hover:border-[#C42326] shadow-xs hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-95 text-center min-h-[165px] sm:min-h-[220px]"
            >
              <div className="flex-1 flex items-center justify-center py-2 transform group-hover:scale-105 transition-transform duration-200">
                {role.logo}
              </div>

              {/* Solo Nombre del Rol, sin descripciones */}
              <div className="w-full pt-2 sm:pt-3 border-t border-slate-100">
                <span className="block text-xs sm:text-sm md:text-base font-bold text-slate-900 group-hover:text-[#C42326] transition-colors leading-tight">
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
