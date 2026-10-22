import { 
  Client, 
  LoanContract, 
  PaymentTransaction, 
  CashRegisterCut, 
  Branch, 
  UserAccount, 
  AuditLog, 
  MachineryOrder,
  MotorcycleOrder 
} from '../types';

const STORAGE_KEYS = {
  CLIENTS: 'garma_clients_v1',
  CONTRACTS: 'garma_contracts_v1',
  TRANSACTIONS: 'garma_transactions_v1',
  CASH_CUTS: 'garma_cash_cuts_v1',
  BRANCHES: 'garma_branches_v1',
  USERS: 'garma_users_v1',
  AUDIT_LOGS: 'garma_audit_logs_v1',
  MOTO_ORDERS: 'garma_moto_orders_v1',
  SUPPRESS_DEMO: 'garma_suppress_demo_data',
  ACTIVE_ROLE: 'garma_active_role',
  ACTIVE_BRANCH: 'garma_active_branch',
  SUPABASE_CONFIG: 'garma_supabase_config'
};

// Initial default branches
export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'suc-centro',
    nombre: 'Sucursal Centro (Matriz)',
    ciudad: 'Ciudad de México',
    direccion: 'Av. Juárez #450, Col. Centro',
    telefono: '55-5234-8901',
    gerenteEncargado: 'Lic. Roberto Morales',
    activa: true
  },
  {
    id: 'suc-norte',
    nombre: 'Sucursal Norte',
    ciudad: 'Tlalnepantla',
    direccion: 'Calz. Vallejo #1120, Col. Industrial',
    telefono: '55-5872-3344',
    gerenteEncargado: 'Ing. Carmen Salazar',
    activa: true
  },
  {
    id: 'suc-oriente',
    nombre: 'Sucursal Oriente',
    ciudad: 'Iztapalapa',
    direccion: 'Av. Ermita Iztapalapa #890',
    telefono: '55-5931-7711',
    gerenteEncargado: 'Lic. Fernando Domínguez',
    activa: true
  }
];

// Initial default users
export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-1',
    nombre: 'Hugo García',
    email: 'hugo.garcia@garmayasociados.com',
    rol: 'admin',
    sucursalId: 'suc-centro',
    telefono: '55-1100-2200',
    activo: true
  },
  {
    id: 'usr-2',
    nombre: 'Lic. Roberto Morales',
    email: 'roberto.morales@garmayasociados.com',
    rol: 'gerente',
    sucursalId: 'suc-centro',
    telefono: '55-2233-4455',
    activo: true
  },
  {
    id: 'usr-3',
    nombre: 'Ing. Carmen Salazar',
    email: 'carmen.salazar@garmayasociados.com',
    rol: 'gerente',
    sucursalId: 'suc-norte',
    telefono: '55-3344-5566',
    activo: true
  },
  {
    id: 'usr-4',
    nombre: 'Alejandro Ruiz (Cobrador Campo)',
    email: 'alejandro.ruiz@garmayasociados.com',
    rol: 'cobrador',
    sucursalId: 'suc-centro',
    telefono: '55-7788-9900',
    activo: true
  },
  {
    id: 'usr-5',
    nombre: 'Víctor Peñaloza (Cobrador Ventanilla)',
    email: 'victor.penaloza@garmayasociados.com',
    rol: 'cobrador',
    sucursalId: 'suc-norte',
    telefono: '55-6677-8899',
    activo: true
  },
  {
    id: 'usr-6',
    nombre: 'Taller Central de Maquinaria - Ing. Javier Peña',
    email: 'taller.maquinaria@garmayasociados.com',
    rol: 'taller',
    sucursalId: 'suc-centro',
    telefono: '55-4455-6677',
    activo: true
  }
];

// Sample Clients with Aval (Contratistas, Constructoras y Desarrolladores de Obra)
export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-001',
    nombreCompleto: 'Constructora e Infraestructura del Valle (Ing. María Elena Sánchez)',
    telefono: '55-4123-9876',
    direccion: 'Parque Industrial Poniente Lote 14, Obra Libramiento Sur',
    giroNegocio: 'Cimentaciones Profundas y Terracerías',
    diaAsignadoPago: 'Miércoles',
    sucursalId: 'suc-centro',
    fechaRegistro: '2026-09-01',
    aval: {
      id: 'ava-001',
      nombreCompleto: 'Ing. José Luis Sánchez Torres',
      telefono: '55-7890-1234',
      direccion: 'Av. Las Palmas #204, Col. Del Valle',
      parentesco: 'Socio Comercial / Garante Solidario'
    }
  },
  {
    id: 'cli-002',
    nombreCompleto: 'Terracerías y Pavimentos del Centro (Ing. Carlos Eduardo Ramírez)',
    telefono: '55-6234-8765',
    direccion: 'Carretera Federal Km 8.5, Frente de Obra Palmas 3',
    giroNegocio: 'Movimiento de Tierras y Pavimentación Asfáltica',
    diaAsignadoPago: 'Miércoles',
    sucursalId: 'suc-centro',
    fechaRegistro: '2026-09-10',
    aval: {
      id: 'ava-002',
      nombreCompleto: 'Arq. Guadalupe Nava Ramos',
      telefono: '55-8901-2345',
      direccion: 'Av. Industria #47, Col. Centro',
      parentesco: 'Directora de Operaciones / Aval'
    }
  },
  {
    id: 'cli-003',
    nombreCompleto: 'Edificaciones Civiles y Mineras del Altiplano (Lucía Méndez Cruz)',
    telefono: '55-7345-7654',
    direccion: 'Camino a Mina San Jerónimo Km 3, Frente de Trituración',
    giroNegocio: 'Extracción de Agregados y Obra Civil Pesada',
    diaAsignadoPago: 'Miércoles',
    sucursalId: 'suc-centro',
    fechaRegistro: '2026-08-15',
    aval: {
      id: 'ava-003',
      nombreCompleto: 'Lic. Miguel Mendoza Ruiz',
      telefono: '55-9012-3456',
      direccion: 'Privada Rosas #14, Col. Álamos',
      parentesco: 'Representante Legal / Aval'
    }
  },
  {
    id: 'cli-004',
    nombreCompleto: 'Desarrollos Urbanos y Drenajes del Río (Rodrigo Alberto Herrera)',
    telefono: '55-8456-6543',
    direccion: 'Prolongación 5 de Mayo #88, Obra Colector Poniente',
    giroNegocio: 'Zanjado, Canalización y Drenaje Pluvial Profundo',
    diaAsignadoPago: 'Jueves',
    sucursalId: 'suc-centro',
    fechaRegistro: '2026-09-20',
    aval: {
      id: 'ava-004',
      nombreCompleto: 'Ing. Patricia Gómez Lara',
      telefono: '55-1122-3344',
      direccion: 'Calle 5 de Mayo #90, Col. Santa Cruz',
      parentesco: 'Socia Administradora'
    }
  },
  {
    id: 'cli-005',
    nombreCompleto: 'Urbanizadora y Terracerías del Norte (Esperanza Morales Castro)',
    telefono: '55-9567-5432',
    direccion: 'Av. Insurgentes Norte #210, Obra Parque Industrial Tlalnepantla',
    giroNegocio: 'Plataformas Industriales y Vialidades',
    diaAsignadoPago: 'Miércoles',
    sucursalId: 'suc-norte',
    fechaRegistro: '2026-08-05',
    aval: {
      id: 'ava-005',
      nombreCompleto: 'Ing. Daniel Morales Castro',
      telefono: '55-2233-4455',
      direccion: 'Av. Insurgentes Norte #212, Tlalnepantla',
      parentesco: 'Gerente Técnico / Aval'
    }
  },
  {
    id: 'cli-006',
    nombreCompleto: 'Demoliciones y Estructuras Metropolitanas (Fernando Ortiz)',
    telefono: '55-3344-9988',
    direccion: 'Av. Reforma #401, Obra Puente Vehicular Oriente',
    giroNegocio: 'Demolición Pesada con Martillo Hidráulico',
    diaAsignadoPago: 'Viernes',
    sucursalId: 'suc-oriente',
    fechaRegistro: '2026-09-12',
    aval: {
      id: 'ava-006',
      nombreCompleto: 'Ing. Teresa Valenzuela Solís',
      telefono: '55-4455-8899',
      direccion: 'Calle Reforma #403, Col. San Andrés',
      parentesco: 'Contratista Asociada'
    }
  }
];

// Helper to generate amortization rows
function generateSampleAmortization(monto: number, semanas: number, cuota: number, capSem: number, intSem: number, ivaSem: number, segSem: number, ahoSem: number, semanasPagadas: number): any[] {
  const rows = [];
  let saldo = monto + (intSem + ivaSem + segSem + ahoSem) * semanas;
  const hoy = new Date('2026-10-21');

  for (let i = 1; i <= semanas; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - (semanasPagadas - i) * 7);
    const fechaStr = fecha.toISOString().split('T')[0];

    const pagado = i <= semanasPagadas;
    saldo -= cuota;

    rows.push({
      numeroCuota: i,
      fechaVencimiento: fechaStr,
      cuotaTotal: cuota,
      capital: capSem,
      interes: intSem,
      iva: ivaSem,
      seguro: segSem,
      ahorro: ahoSem,
      saldoRestante: Math.max(0, saldo),
      estado: pagado ? 'Pagado' : (i === semanasPagadas + 1 ? 'Pendiente' : (i < semanasPagadas ? 'Pagado' : 'Pendiente')),
      montoPagado: pagado ? cuota : 0
    });
  }
  return rows;
}

// Sample Loan Contracts (Contratos de Renta de Maquinaria Pesada)
export const INITIAL_CONTRACTS: LoanContract[] = [
  {
    id: 'con-1001',
    folio: 'GAR-2026-081',
    clienteId: 'cli-001',
    sucursalId: 'suc-centro',
    montoSolicitado: 36000,
    plazoSemanas: 16,
    frecuencia: 'semanal',
    diaPago: 'Miércoles',
    tasaInteresPorcentaje: 12,
    interesTotal: 4320,
    ivaTotal: 691.2,
    seguroVidaTotal: 2400,
    ahorroTotal: 2400,
    montoTotalAdeudo: 45811.2,
    cuotaPeriodica: 2863.2,
    saldoPendiente: 20042.4,
    saldoVencido: 0,
    estatus: 'Activo',
    fechaAprobacion: '2026-08-20',
    fechaPrimerPago: '2026-08-27',
    aprobadoPor: 'Lic. Roberto Morales',
    totalPagado: 25768.8,
    equipoRenta: 'Excavadora de Orugas CAT 320D (20 Toneladas)',
    numeroEconomico: 'MQ-EX01',
    horometroInicial: 1480,
    ubicacionObra: 'Tramo Carretero Libramiento Sur Km 14',
    depositoGarantia: 15000,
    costoFleteTraslado: 4500,
    tablaAmortizacion: generateSampleAmortization(36000, 16, 2863.2, 2250, 270, 43.2, 150, 150, 9)
  },
  {
    id: 'con-1002',
    folio: 'GAR-2026-092',
    clienteId: 'cli-002',
    sucursalId: 'suc-centro',
    montoSolicitado: 48000,
    plazoSemanas: 24,
    frecuencia: 'semanal',
    diaPago: 'Miércoles',
    tasaInteresPorcentaje: 15,
    interesTotal: 7200,
    ivaTotal: 1152,
    seguroVidaTotal: 3600,
    ahorroTotal: 3600,
    montoTotalAdeudo: 63552,
    cuotaPeriodica: 2648,
    saldoPendiente: 37072,
    saldoVencido: 5296, // 2 semanas de renta en atraso en frente de obra
    estatus: 'En Mora',
    fechaAprobacion: '2026-07-15',
    fechaPrimerPago: '2026-07-22',
    aprobadoPor: 'Lic. Roberto Morales',
    totalPagado: 26480,
    equipoRenta: 'Retroexcavadora 4x4 John Deere 310L con Brazo Extensible',
    numeroEconomico: 'MQ-RT04',
    horometroInicial: 2190,
    ubicacionObra: 'Fraccionamiento Residencial Las Palmas Frente 3',
    depositoGarantia: 12000,
    costoFleteTraslado: 3200,
    tablaAmortizacion: generateSampleAmortization(48000, 24, 2648, 2000, 300, 48, 150, 150, 8)
  },
  {
    id: 'con-1003',
    folio: 'GAR-2026-098',
    clienteId: 'cli-003',
    sucursalId: 'suc-centro',
    montoSolicitado: 28000,
    plazoSemanas: 12,
    frecuencia: 'semanal',
    diaPago: 'Miércoles',
    tasaInteresPorcentaje: 10,
    interesTotal: 2800,
    ivaTotal: 448,
    seguroVidaTotal: 1800,
    ahorroTotal: 1800,
    montoTotalAdeudo: 34848,
    cuotaPeriodica: 2904,
    saldoPendiente: 8712,
    saldoVencido: 0,
    estatus: 'Activo',
    fechaAprobacion: '2026-08-30',
    fechaPrimerPago: '2026-09-06',
    aprobadoPor: 'Lic. Roberto Morales',
    totalPagado: 26136,
    equipoRenta: 'Rodillo Compactador Vibratorio Dynapac CA250 (12T)',
    numeroEconomico: 'MQ-VC02',
    horometroInicial: 890,
    ubicacionObra: 'Plataforma Industrial Norte Nave 4',
    depositoGarantia: 10000,
    costoFleteTraslado: 2800,
    tablaAmortizacion: generateSampleAmortization(28000, 12, 2904, 2333.3, 233.3, 37.3, 150, 150, 9)
  },
  {
    id: 'con-1004',
    folio: 'GAR-2026-104',
    clienteId: 'cli-004',
    sucursalId: 'suc-centro',
    montoSolicitado: 55000,
    plazoSemanas: 16,
    frecuencia: 'semanal',
    diaPago: 'Jueves',
    tasaInteresPorcentaje: 12,
    interesTotal: 6600,
    ivaTotal: 1056,
    seguroVidaTotal: 2400,
    ahorroTotal: 2400,
    montoTotalAdeudo: 67456,
    cuotaPeriodica: 4216,
    saldoPendiente: 50592,
    saldoVencido: 0,
    estatus: 'Activo',
    fechaAprobacion: '2026-09-22',
    fechaPrimerPago: '2026-09-29',
    aprobadoPor: 'Lic. Roberto Morales',
    totalPagado: 16864,
    equipoRenta: 'Motoniveladora Caterpillar 120M con Ripper y Cuchilla 14ft',
    numeroEconomico: 'MQ-MN02',
    horometroInicial: 1650,
    ubicacionObra: 'Obra Colector Poniente y Terracerías',
    depositoGarantia: 18000,
    costoFleteTraslado: 5000,
    tablaAmortizacion: generateSampleAmortization(55000, 16, 4216, 3437.5, 412.5, 66, 150, 150, 4)
  },
  {
    id: 'con-1005',
    folio: 'GAR-2026-077',
    clienteId: 'cli-005',
    sucursalId: 'suc-norte',
    montoSolicitado: 42000,
    plazoSemanas: 20,
    frecuencia: 'semanal',
    diaPago: 'Miércoles',
    tasaInteresPorcentaje: 14,
    interesTotal: 5880,
    ivaTotal: 940.8,
    seguroVidaTotal: 3000,
    ahorroTotal: 3000,
    montoTotalAdeudo: 54820.8,
    cuotaPeriodica: 2741,
    saldoPendiente: 19187,
    saldoVencido: 0,
    estatus: 'Activo',
    fechaAprobacion: '2026-08-10',
    fechaPrimerPago: '2026-08-17',
    aprobadoPor: 'Ing. Carmen Salazar',
    totalPagado: 35633.8,
    equipoRenta: 'Cargador Frontal de Ruedas CAT 938K (Cucharón 3.0 m³)',
    numeroEconomico: 'MQ-CF01',
    horometroInicial: 3100,
    ubicacionObra: 'Parque Industrial Tlalnepantla Nave A',
    depositoGarantia: 14000,
    costoFleteTraslado: 3800,
    tablaAmortizacion: generateSampleAmortization(42000, 20, 2741, 2100, 294, 47, 150, 150, 13)
  }
];

// Sample Today Transactions
export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'pay-001',
    folio: 'REC-2026-0042',
    contratoId: 'con-1001',
    clienteId: 'cli-001',
    clienteNombre: 'María Elena Sánchez Torres',
    montoPagado: 954.4,
    fecha: '2026-10-21 10:15',
    metodoPago: 'Efectivo',
    sucursalId: 'suc-centro',
    cobradorNombre: 'Alejandro Ruiz',
    desglose: {
      moraCuotaVencida: 0,
      seguro: 50,
      interes: 90,
      capital: 750,
      ahorro: 50
    },
    saldoAnterior: 7635.2,
    nuevoSaldo: 6680.8,
    notas: 'Pago puntual semana 9 en sucursal'
  },
  {
    id: 'pay-002',
    folio: 'REC-2026-0043',
    contratoId: 'con-1003',
    clienteId: 'cli-003',
    clienteNombre: 'Beatriz Adriana Mendoza Ruiz',
    montoPagado: 844,
    fecha: '2026-10-21 11:40',
    metodoPago: 'Efectivo',
    sucursalId: 'suc-centro',
    cobradorNombre: 'Alejandro Ruiz',
    desglose: {
      moraCuotaVencida: 0,
      seguro: 50,
      interes: 66.6,
      capital: 666.6,
      ahorro: 50
    },
    saldoAnterior: 3376,
    nuevoSaldo: 2532,
    notas: 'Cobro en negocio estética Álamos'
  }
];

// Sample Cash Cuts
export const INITIAL_CASH_CUTS: CashRegisterCut[] = [
  {
    id: 'cut-2026-10-20',
    folio: 'ARQ-CENTRO-1020',
    fecha: '2026-10-20',
    sucursalId: 'suc-centro',
    gerenteNombre: 'Lic. Roberto Morales',
    cobrosEsperados: 4800,
    cobrosIngresados: 4800,
    totalEfectivoReportado: 4800,
    diferencia: 0,
    clientesProgramados: 5,
    clientesPagaron: 5,
    clientesFaltantes: 0,
    cerrado: true,
    observaciones: 'Arqueo cuadrado sin diferencias. Caja entregada a bóveda.'
  }
];

// Sample Audit Log
export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-001',
    timestamp: '2026-10-21 10:15:22',
    usuario: 'Alejandro Ruiz',
    rol: 'Cobrador / Asesor',
    accion: 'Captura de Cobro',
    modulo: 'Cobranza Diaria',
    detalles: 'Cobro de $954.40 registrado con Folio REC-2026-0042 para contrato GAR-2026-081',
    sucursalId: 'suc-centro'
  },
  {
    id: 'aud-002',
    timestamp: '2026-10-21 11:40:05',
    usuario: 'Alejandro Ruiz',
    rol: 'Cobrador / Asesor',
    accion: 'Captura de Cobro',
    modulo: 'Cobranza Diaria',
    detalles: 'Cobro de $844.00 registrado con Folio REC-2026-0043 para contrato GAR-2026-098',
    sucursalId: 'suc-centro'
  },
  {
    id: 'aud-003',
    timestamp: '2026-10-21 08:30:00',
    usuario: 'Hugo García',
    rol: 'Administrador General',
    accion: 'Inicio de Sistema',
    modulo: 'Consolidación Global',
    detalles: 'Supervisión de cartera global iniciada exitosamente',
    sucursalId: 'suc-centro'
  }
];

// Heavy Machinery Orders / Parque de Maquinaria Pesada
export const INITIAL_MACHINERY_ORDERS: MachineryOrder[] = [
  {
    id: 'maq-001',
    folio: 'MAQ-2026-024',
    numeroEconomico: 'MQ-EX01',
    tipoEquipo: 'Excavadora de Orugas (20 Ton)',
    modelo: 'Caterpillar 320D',
    serie: 'CAT0320DPG9921',
    operadorAsignado: 'Ing. María Elena Sánchez (Obra Libramiento)',
    sucursalId: 'suc-centro',
    servicioSolicitado: 'Mantenimiento preventivo 2,500 hrs: Kit de filtros de motor diesel, aceite hidráulico ISO 46 y ajuste de tensión en zapatas de oruga',
    fechaIngreso: '2026-10-18',
    horometro: 2450,
    costoEstimado: 8400,
    estatus: 'En Renta en Obra',
    mecanicoResponsable: 'Ing. Javier Peña (Jefe de Taller)',
    ubicacionObra: 'Tramo Carretero Libramiento Sur Km 14'
  },
  {
    id: 'maq-002',
    folio: 'MAQ-2026-025',
    numeroEconomico: 'MQ-RT04',
    tipoEquipo: 'Retroexcavadora 4x4',
    modelo: 'John Deere 310L con Brazo Extensible',
    serie: 'JD310L-582910',
    operadorAsignado: 'Terracerías y Pavimentos del Centro',
    sucursalId: 'suc-centro',
    servicioSolicitado: 'Mantenimiento correctivo hidráulico: Reempaque de sellos en cilindro de levante y cambio de mangueras de alta presión',
    fechaIngreso: '2026-10-21',
    horometro: 3180,
    costoEstimado: 5200,
    estatus: 'En Mantenimiento',
    mecanicoResponsable: 'Ing. Javier Peña (Jefe de Taller)',
    ubicacionObra: 'Patio Central Garma - Bahía 2'
  },
  {
    id: 'maq-003',
    folio: 'MAQ-2026-026',
    numeroEconomico: 'MQ-MN02',
    tipoEquipo: 'Motoniveladora Articulada',
    modelo: 'Caterpillar 120M (Vertedera 14ft)',
    serie: 'CAT0120M44819',
    operadorAsignado: 'Desarrollos Urbanos y Drenajes',
    sucursalId: 'suc-centro',
    servicioSolicitado: 'Inspección de desgaste en gavilanes y cuchillas de corte, engrase general de tornamesa y calibración de tándems',
    fechaIngreso: '2026-10-19',
    horometro: 1650,
    costoEstimado: 3800,
    estatus: 'En Patio',
    mecanicoResponsable: 'Téc. Marco Aurelio Vargas',
    ubicacionObra: 'Patio Matriz Garma - Lista para renta'
  },
  {
    id: 'maq-004',
    folio: 'MAQ-2026-027',
    numeroEconomico: 'MQ-VC02',
    tipoEquipo: 'Rodillo Vibrocompactador (12 Ton)',
    modelo: 'Dynapac CA250 Monocilíndrico',
    serie: 'DYN-CA250-9901',
    operadorAsignado: 'Edificaciones Civiles y Mineras',
    sucursalId: 'suc-centro',
    servicioSolicitado: 'Revisión y cambio de amortiguadores de tambor vibratorio, afinación de motor Cummins diesel',
    fechaIngreso: '2026-10-15',
    horometro: 890,
    costoEstimado: 4600,
    estatus: 'En Renta en Obra',
    mecanicoResponsable: 'Téc. Marco Aurelio Vargas',
    ubicacionObra: 'Plataforma Industrial Norte Nave 4'
  }
];

export const INITIAL_MOTO_ORDERS: MotorcycleOrder[] = INITIAL_MACHINERY_ORDERS;

// Storage Helper Functions
export const storageService = {
  // Check if user has explicitly suppressed demo data
  isDemoSuppressed(): boolean {
    return localStorage.getItem(STORAGE_KEYS.SUPPRESS_DEMO) === 'true';
  },

  setDemoSuppressed(suppress: boolean): void {
    if (suppress) {
      localStorage.setItem(STORAGE_KEYS.SUPPRESS_DEMO, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.SUPPRESS_DEMO);
    }
  },

  // Clear all system sample data completely
  clearAllSystemData(): void {
    localStorage.setItem(STORAGE_KEYS.SUPPRESS_DEMO, 'true');
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CASH_CUTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([{
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      usuario: 'Sistema',
      rol: 'Administrador',
      accion: 'Vaciado de Datos de Muestra',
      modulo: 'Base de Datos',
      detalles: 'Se han eliminado los registros de muestra del sistema. Modo limpio activado.',
      sucursalId: 'suc-centro'
    }]));
    localStorage.setItem(STORAGE_KEYS.MOTO_ORDERS, JSON.stringify([]));
    // Keep branches and users intact for operations
  },

  // Restore sample demo data
  restoreSampleData(): void {
    localStorage.removeItem(STORAGE_KEYS.SUPPRESS_DEMO);
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
    localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(INITIAL_CONTRACTS));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.CASH_CUTS, JSON.stringify(INITIAL_CASH_CUTS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.MOTO_ORDERS, JSON.stringify(INITIAL_MOTO_ORDERS));
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(INITIAL_BRANCHES));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  },

  // Clients
  getClients(): Client[] {
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!data) {
      if (this.isDemoSuppressed()) return [];
      this.saveClients(INITIAL_CLIENTS);
      return INITIAL_CLIENTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveClients(clients: Client[]): void {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  },

  addClient(client: Client, user: string = 'Usuario'): void {
    const clients = this.getClients();
    clients.unshift(client);
    this.saveClients(clients);
    this.addAuditLog({
      usuario: user,
      rol: 'Cobrador / Asesor',
      accion: 'Alta de Cliente y Aval',
      modulo: 'Directorio',
      detalles: `Registro de cliente titular: ${client.nombreCompleto} y aval: ${client.aval.nombreCompleto}`,
      sucursalId: client.sucursalId
    });
  },

  // Contracts
  getContracts(): LoanContract[] {
    const data = localStorage.getItem(STORAGE_KEYS.CONTRACTS);
    if (!data) {
      if (this.isDemoSuppressed()) return [];
      this.saveContracts(INITIAL_CONTRACTS);
      return INITIAL_CONTRACTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveContracts(contracts: LoanContract[]): void {
    localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(contracts));
  },

  addContract(contract: LoanContract, user: string = 'Gerente'): void {
    const contracts = this.getContracts();
    contracts.unshift(contract);
    this.saveContracts(contracts);
    this.addAuditLog({
      usuario: user,
      rol: 'Gerente de Sucursal',
      accion: 'Otorgamiento de Crédito',
      modulo: 'Simulador / Apertura',
      detalles: `Crédito ${contract.folio} aprobado por $${contract.montoSolicitado.toLocaleString('es-MX')} a ${contract.plazoSemanas} semanas`,
      sucursalId: contract.sucursalId
    });
  },

  updateContract(updated: LoanContract): void {
    const contracts = this.getContracts().map(c => c.id === updated.id ? updated : c);
    this.saveContracts(contracts);
  },

  // Transactions / Payments
  getTransactions(): PaymentTransaction[] {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!data) {
      if (this.isDemoSuppressed()) return [];
      this.saveTransactions(INITIAL_TRANSACTIONS);
      return INITIAL_TRANSACTIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveTransactions(transactions: PaymentTransaction[]): void {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  registerPayment(payment: PaymentTransaction): void {
    const transactions = this.getTransactions();
    transactions.unshift(payment);
    this.saveTransactions(transactions);

    // Apply payment to corresponding contract
    const contracts = this.getContracts();
    const contractIndex = contracts.findIndex(c => c.id === payment.contratoId);
    if (contractIndex >= 0) {
      const contract = contracts[contractIndex];
      const newBalance = Math.max(0, contract.saldoPendiente - payment.montoPagado);
      const newPaid = contract.totalPagado + payment.montoPagado;

      // Update amortization row if applicable
      const table = [...contract.tablaAmortizacion];
      let remainingMoney = payment.montoPagado;

      for (let i = 0; i < table.length; i++) {
        if (remainingMoney <= 0) break;
        if (table[i].estado !== 'Pagado') {
          const needed = table[i].cuotaTotal - table[i].montoPagado;
          if (remainingMoney >= needed) {
            table[i].montoPagado = table[i].cuotaTotal;
            table[i].estado = 'Pagado';
            remainingMoney -= needed;
          } else {
            table[i].montoPagado += remainingMoney;
            remainingMoney = 0;
          }
        }
      }

      // Check if fully paid (Liquidado) -> Release Aval and mark ready for re-loan
      const isFullyPaid = newBalance <= 1; // minor float tolerance
      const newStatus = isFullyPaid ? 'Liquidado' : (contract.saldoVencido > 0 ? 'En Mora' : 'Activo');

      contracts[contractIndex] = {
        ...contract,
        saldoPendiente: newBalance,
        totalPagado: newPaid,
        estatus: newStatus,
        tablaAmortizacion: table
      };
      this.saveContracts(contracts);
    }

    this.addAuditLog({
      usuario: payment.cobradorNombre,
      rol: 'Cobrador / Asesor',
      accion: 'Aplicación de Pago',
      modulo: 'Cobranza Diaria',
      detalles: `Cobro de $${payment.montoPagado.toFixed(2)} registrado con Folio ${payment.folio} para cliente ${payment.clienteNombre}`,
      sucursalId: payment.sucursalId
    });
  },

  // Cash Register Cuts
  getCashCuts(): CashRegisterCut[] {
    const data = localStorage.getItem(STORAGE_KEYS.CASH_CUTS);
    if (!data) {
      if (this.isDemoSuppressed()) return [];
      this.saveCashCuts(INITIAL_CASH_CUTS);
      return INITIAL_CASH_CUTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveCashCuts(cuts: CashRegisterCut[]): void {
    localStorage.setItem(STORAGE_KEYS.CASH_CUTS, JSON.stringify(cuts));
  },

  addCashCut(cut: CashRegisterCut): void {
    const cuts = this.getCashCuts();
    cuts.unshift(cut);
    this.saveCashCuts(cuts);
    this.addAuditLog({
      usuario: cut.gerenteNombre,
      rol: 'Gerente de Sucursal',
      accion: 'Cierre y Arqueo de Caja',
      modulo: 'Corte Diario',
      detalles: `Arqueo oficial cerrado Folio ${cut.folio}. Total recaudado: $${cut.cobrosIngresados.toFixed(2)}, Diferencia: $${cut.diferencia.toFixed(2)}`,
      sucursalId: cut.sucursalId
    });
  },

  // Branches
  getBranches(): Branch[] {
    const data = localStorage.getItem(STORAGE_KEYS.BRANCHES);
    if (!data) {
      this.saveBranches(INITIAL_BRANCHES);
      return INITIAL_BRANCHES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_BRANCHES;
    }
  },

  saveBranches(branches: Branch[]): void {
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(branches));
  },

  addBranch(branch: Branch): void {
    const branches = this.getBranches();
    branches.push(branch);
    this.saveBranches(branches);
  },

  // Users
  getUsers(): UserAccount[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      this.saveUsers(INITIAL_USERS);
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_USERS;
    }
  },

  saveUsers(users: UserAccount[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  addUser(user: UserAccount): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!data) {
      if (this.isDemoSuppressed()) return [];
      this.saveAuditLogs(INITIAL_AUDIT_LOGS);
      return INITIAL_AUDIT_LOGS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveAuditLogs(logs: AuditLog[]): void {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
  },

  addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    const newEntry: AuditLog = {
      ...entry,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    logs.unshift(newEntry);
    this.saveAuditLogs(logs);
  },

  // Heavy Machinery Orders (Parque y Mantenimiento de Maquinaria Pesada)
  getMachineryOrders(): MachineryOrder[] {
    const data = localStorage.getItem(STORAGE_KEYS.MOTO_ORDERS);
    if (!data) {
      if (this.isDemoSuppressed()) return [];
      this.saveMachineryOrders(INITIAL_MACHINERY_ORDERS);
      return INITIAL_MACHINERY_ORDERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveMachineryOrders(orders: MachineryOrder[]): void {
    localStorage.setItem(STORAGE_KEYS.MOTO_ORDERS, JSON.stringify(orders));
  },

  addMachineryOrder(order: MachineryOrder): void {
    const orders = this.getMachineryOrders();
    orders.unshift(order);
    this.saveMachineryOrders(orders);
  },

  // Backward-compatible methods
  getMotoOrders(): MotorcycleOrder[] {
    return this.getMachineryOrders();
  },

  saveMotoOrders(orders: MotorcycleOrder[]): void {
    this.saveMachineryOrders(orders);
  },

  addMotoOrder(order: MotorcycleOrder): void {
    this.addMachineryOrder(order);
  },

  // Supabase Configuration
  getSupabaseConfig(): { url: string; anonKey: string } | null {
    const data = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  saveSupabaseConfig(config: { url: string; anonKey: string }): void {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(config));
  },

  // Export to CSV utility
  exportToCSV(filename: string, rows: object[]): void {
    if (!rows || !rows.length) {
      alert('No hay registros para exportar.');
      return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows
        .map(row => {
          return keys
            .map(k => {
              let cell = (row as any)[k] === null || (row as any)[k] === undefined ? '' : (row as any)[k];
              if (typeof cell === 'object') {
                cell = JSON.stringify(cell);
              }
              cell = cell.toString().replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
              }
              return cell;
            })
            .join(separator);
        })
        .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
