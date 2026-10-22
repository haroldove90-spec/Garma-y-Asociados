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

// Custom Designed Heavy Machinery Logo (Garma Renta y Mantenimiento de Maquinaria Pesada)
export const HeavyMachineryLogo: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        {/* Outer Heavy Duty Shield */}
        <path
          d="M80 8L146 44V116L80 152L14 116V44L80 8Z"
          fill="#0F172A"
          stroke="#C42326"
          strokeWidth="4"
        />
        {/* Inner Orange Accent Rim */}
        <path
          d="M80 18L136 49V111L80 142L24 111V49L80 18Z"
          stroke="#F07D08"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Industrial Gear Outline in background */}
        <circle cx="80" cy="72" r="34" stroke="#F07D08" strokeWidth="2.5" opacity="0.3" strokeDasharray="6 4" />
        <circle cx="80" cy="72" r="22" stroke="#C42326" strokeWidth="2" opacity="0.3" />

        {/* Heavy Excavator Machine Body (Cabina y Contrapeso) */}
        {/* Counterweight & Engine Hood */}
        <rect x="36" y="66" width="30" height="20" rx="3" fill="#C42326" />
        {/* Operator Cabin */}
        <path d="M54 54H68L72 66H50L54 54Z" fill="#F07D08" />
        <rect x="55" y="56" width="10" height="8" rx="1" fill="#E2E8F0" opacity="0.85" />

        {/* Hydraulic Boom & Arm (Brazo y Pluma Hidráulica de Excavadora) */}
        {/* Main Boom */}
        <path d="M68 66L88 44L104 56" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Hydraulic Cylinder */}
        <line x1="72" y1="68" x2="86" y2="48" stroke="#F07D08" strokeWidth="2.5" />
        {/* Dipper / Arm */}
        <path d="M104 56L122 76" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
        {/* Heavy Excavator Bucket with Teeth (Cucharón con dientes) */}
        <path
          d="M122 76L130 82L124 92L114 88L118 78L122 76Z"
          fill="#F07D08"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        {/* Bucket Teeth */}
        <line x1="124" y1="92" x2="128" y2="95" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <line x1="120" y1="91" x2="124" y2="94" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <line x1="116" y1="89" x2="119" y2="93" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

        {/* Heavy Duty Caterpillar Track Undercarriage (Orugas de Acero) */}
        <rect x="28" y="86" width="70" height="18" rx="9" fill="#1E293B" stroke="#F07D08" strokeWidth="3" />
        {/* Track Wheels / Rollers */}
        <circle cx="37" cy="95" r="5" fill="#C42326" />
        <circle cx="49" cy="95" r="4.5" fill="#94A3B8" />
        <circle cx="61" cy="95" r="4.5" fill="#94A3B8" />
        <circle cx="73" cy="95" r="4.5" fill="#94A3B8" />
        <circle cx="85" cy="95" r="5" fill="#C42326" />
        
        {/* Track Segment Lines */}
        <line x1="30" y1="90" x2="30" y2="100" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />
        <line x1="94" y1="90" x2="94" y2="100" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />

        {/* Quality Banner & Typography */}
        <path
          d="M80 114L83 121H90L84 125L86 132L80 128L74 132L76 125L70 121H77L80 114Z"
          fill="#F07D08"
        />
        <text
          x="80"
          y="140"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="8.5"
          fontWeight="bold"
          letterSpacing="1.2"
        >
          MAQUINARIA PESADA
        </text>
      </svg>
    </div>
  );
};

// Backward-compatible alias
export const MotoWorkshopLogo = HeavyMachineryLogo;

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
