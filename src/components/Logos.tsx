import React from 'react';

// Unencapsulated Official Garma Logo
export const GarmaLogo: React.FC<{ className?: string }> = ({ className = 'h-10 w-auto' }) => {
  return (
    <img
      src="https://appdesignproyectos.com/garmalogo.png"
      alt="Garma y Asociados"
      className={`object-contain block ${className}`}
      loading="eager"
    />
  );
};

// Official Garma App Icon
export const GarmaIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => {
  return (
    <img
      src="https://appdesignproyectos.com/garmaicono.png"
      alt="Icono Garma"
      className={`object-contain block ${className}`}
      loading="eager"
    />
  );
};

// Custom Designed Motorcycle Workshop Logo (Garma Taller de Motos)
export const MotoWorkshopLogo: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        {/* Outer Hexagonal Shield */}
        <path
          d="M80 8L144 44V116L80 152L16 116V44L80 8Z"
          fill="#111827"
          stroke="#C42326"
          strokeWidth="4"
        />
        {/* Inner Orange Accent Rim */}
        <path
          d="M80 18L134 49V111L80 142L26 111V49L80 18Z"
          stroke="#F07D08"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Crossed Wrenches & Gear behind moto */}
        <g opacity="0.4" stroke="#F07D08" strokeWidth="3" strokeLinecap="round">
          <line x1="42" y1="42" x2="118" y2="118" />
          <line x1="118" y1="42" x2="42" y2="118" />
        </g>
        <circle cx="80" cy="80" r="30" stroke="#C42326" strokeWidth="3" opacity="0.3" strokeDasharray="6 6" />

        {/* Dynamic Sport Motorcycle Silhouette */}
        {/* Rear Wheel */}
        <circle cx="46" cy="98" r="18" stroke="#F07D08" strokeWidth="5" fill="#1F2937" />
        <circle cx="46" cy="98" r="8" fill="#C42326" />
        
        {/* Front Wheel */}
        <circle cx="114" cy="98" r="18" stroke="#F07D08" strokeWidth="5" fill="#1F2937" />
        <circle cx="114" cy="98" r="8" fill="#C42326" />

        {/* Chassis & Body Frame */}
        <path
          d="M46 98L62 72H82L98 64H110L114 98M82 72L96 98M46 98L74 98"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Tank & Cowling in Garma Red */}
        <path
          d="M66 68L84 64C90 64 96 66 102 60L108 56L102 52L86 54L68 62L66 68Z"
          fill="#C42326"
        />

        {/* Handlebars & Fork */}
        <path
          d="M102 54L114 98M98 50L106 52"
          stroke="#F07D08"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Exhaust Pipe */}
        <path
          d="M60 92L78 92L92 84"
          stroke="#E5E7EB"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Workshop Star Badge & Typography */}
        <path
          d="M80 114L83 121H90L84 125L86 132L80 128L74 132L76 125L70 121H77L80 114Z"
          fill="#F07D08"
        />
        <text
          x="80"
          y="140"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="9"
          fontWeight="bold"
          letterSpacing="1.5"
        >
          GARMA MOTO
        </text>
      </svg>
    </div>
  );
};

// Cobrador Role Logo
export const CobradorLogo: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        <rect width="140" height="140" rx="24" fill="#0F172A" />
        <circle cx="70" cy="70" r="54" stroke="#C42326" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.6" />
        
        {/* Field Tablet / Clipboard */}
        <rect x="38" y="28" width="64" height="84" rx="8" fill="#1E293B" stroke="#F07D08" strokeWidth="3" />
        <rect x="52" y="24" width="36" height="8" rx="4" fill="#C42326" />
        
        {/* Receipt / Check rows */}
        <line x1="50" y1="46" x2="90" y2="46" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="58" x2="82" y2="58" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="70" x2="86" y2="70" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Currency Stamp */}
        <circle cx="70" cy="90" r="12" fill="#C42326" />
        <text x="70" y="95" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold">$</text>
        
        {/* Dynamic Route Indicator */}
        <path d="M26 102C32 94 40 108 50 100" stroke="#F07D08" strokeWidth="3" strokeLinecap="round" />
        <circle cx="26" cy="102" r="4" fill="#F07D08" />
        <circle cx="50" cy="100" r="4" fill="#C42326" />
      </svg>
    </div>
  );
};

// Gerente Role Logo
export const GerenteLogo: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        <rect width="140" height="140" rx="24" fill="#0F172A" />
        <circle cx="70" cy="70" r="54" stroke="#F07D08" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.6" />
        
        {/* Credit Approval Shield */}
        <path
          d="M70 24L104 38V70C104 92 89 110 70 118C51 110 36 92 36 70V38L70 24Z"
          fill="#1E293B"
          stroke="#C42326"
          strokeWidth="3.5"
        />

        {/* Checkmark of Authorized Credit */}
        <path
          d="M54 68L65 79L86 54"
          stroke="#F07D08"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Branch Pillars */}
        <line x1="48" y1="104" x2="92" y2="104" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// Administrador General (Hugo García) Logo
export const AdminLogo: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        <rect width="140" height="140" rx="24" fill="#0F172A" />
        <circle cx="70" cy="70" r="54" stroke="#C42326" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.6" />
        
        {/* Executive Headquarters & Global Shield */}
        <polygon points="70,22 108,44 108,96 70,118 32,96 32,44" fill="#1E293B" stroke="#F07D08" strokeWidth="3" />
        
        {/* Global Multi-branch Network & Bar Chart */}
        <rect x="48" y="70" width="8" height="24" rx="2" fill="#94A3B8" />
        <rect x="62" y="56" width="8" height="38" rx="2" fill="#F07D08" />
        <rect x="76" y="44" width="8" height="50" rx="2" fill="#C42326" />
        
        {/* Star of Governance */}
        <circle cx="70" cy="38" r="5" fill="#FFFFFF" />
      </svg>
    </div>
  );
};
