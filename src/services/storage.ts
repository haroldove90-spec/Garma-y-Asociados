import { 
  Client, 
  LoanContract, 
  PaymentTransaction, 
  CashRegisterCut, 
  Branch, 
  UserAccount, 
  AuditLog, 
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
    nombre: 'Taller Central de Motos - Mtro. Javier Peña',
    email: 'taller@garmayasociados.com',
    rol: 'taller',
    sucursalId: 'suc-centro',
    telefono: '55-4455-6677',
    activo: true
  }
];

// Sample Clients with Aval
export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-001',
    nombreCompleto: 'María Elena Sánchez Torres',
    telefono: '55-4123-9876',
    direccion: 'Calle Morelos #102, Col. San Juan',
    giroNegocio: 'Abarrotes y Cremería "La Guadalupana"',
    diaAsignadoPago: 'Miércoles',
    sucursalId: 'suc-centro',
    fechaRegistro: '2026-09-01',
    aval: {
      id: 'ava-001',
      nombreCompleto: 'José Luis Sánchez Torres',
      telefono: '55-7890-1234',
      direccion: 'Calle Morelos #104, Col. San Juan',
      parentesco: 'Hermano'
    }
  },
  {
    id: 'cli-002',
    nombreCompleto: 'Carlos Eduardo Ramírez Nava',
    telefono: '55-6234-8765',
    direccion: 'Av. Hidalgo #45, Col. Centro',
    giroNegocio: 'Taller de Hojalatería y Pintura',
    diaAsignadoPago: 'Miércoles',
    sucursalId: 'suc-centro',
    fechaRegistro: '2026-09-10',
    aval: {
      id: 'ava-002',
      nombreCompleto: 'Guadalupe Nava Ramos',
      telefono: '55-8901-2345',
      direccion: 'Av. Hidalgo #47, Col. Centro',
      parentesco: 'Madre'
    }
  },
  {
    id: 'cli-003',
    nombreCompleto: 'Beatriz Adriana Mendoza Ruiz',
    telefono: '55-7345-7654',
    direccion: 'Privada Rosas #12, Col. Álamos',
    giroNegocio: 'Estética y Barbería "Glamour"',
    diaAsignadoPago: 'Miércoles',
    sucursalId: 'suc-centro',
    fechaRegistro: '2026-08-15',
    aval: {
      id: 'ava-003',
      nombreCompleto: 'Miguel Mendoza Ruiz',
      telefono: '55-9012-3456',
      direccion: 'Privada Rosas #14, Col. Álamos',
      parentesco: 'Hermano'
    }
  },
  {
    id: 'cli-004',
    nombreCompleto: 'Rodrigo Alberto Herrera Gómez',
    telefono: '55-8456-6543',
    direccion: 'Calle 5 de Mayo #88, Col. Santa Cruz',
    giroNegocio: 'Taquería "Los Tres Reyes"',
    diaAsignadoPago: 'Jueves',
    sucursalId: 'suc-centro',
    fechaRegistro: '2026-09-20',
    aval: {
      id: 'ava-004',
      nombreCompleto: 'Patricia Gómez Lara',
      telefono: '55-1122-3344',
      direccion: 'Calle 5 de Mayo #90, Col. Santa Cruz',
      parentesco: 'Esposa'
    }
  },
  {
    id: 'cli-005',
    nombreCompleto: 'Esperanza Morales Castro',
    telefono: '55-9567-5432',
    direccion: 'Av. Insurgentes Norte #210, Tlalnepantla',
    giroNegocio: 'Venta de Ropa y Calzado por Catálogo',
    diaAsignadoPago: 'Miércoles',
    sucursalId: 'suc-norte',
    fechaRegistro: '2026-08-05',
    aval: {
      id: 'ava-005',
      nombreCompleto: 'Daniel Morales Castro',
      telefono: '55-2233-4455',
      direccion: 'Av. Insurgentes Norte #212, Tlalnepantla',
      parentesco: 'Hijo'
    }
  },
  {
    id: 'cli-006',
    nombreCompleto: 'Fernando Ortiz Valenzuela',
    telefono: '55-3344-9988',
    direccion: 'Calle Reforma #401, Col. San Andrés',
    giroNegocio: 'Distribuidora de Frutas y Verduras',
    diaAsignadoPago: 'Viernes',
    sucursalId: 'suc-oriente',
    fechaRegistro: '2026-09-12',
    aval: {
      id: 'ava-006',
      nombreCompleto: 'Teresa Valenzuela Solís',
      telefono: '55-4455-8899',
      direccion: 'Calle Reforma #403, Col. San Andrés',
      parentesco: 'Tía'
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

// Sample Loan Contracts
export const INITIAL_CONTRACTS: LoanContract[] = [
  {
    id: 'con-1001',
    folio: 'GAR-2026-081',
    clienteId: 'cli-001',
    sucursalId: 'suc-centro',
    montoSolicitado: 12000,
    plazoSemanas: 16,
    frecuencia: 'semanal',
    diaPago: 'Miércoles',
    tasaInteresPorcentaje: 12,
    interesTotal: 1440,
    ivaTotal: 230.4,
    seguroVidaTotal: 800,
    ahorroTotal: 800,
    montoTotalAdeudo: 15270.4,
    cuotaPeriodica: 954.4,
    saldoPendiente: 6680.8,
    saldoVencido: 0,
    estatus: 'Activo',
    fechaAprobacion: '2026-08-20',
    fechaPrimerPago: '2026-08-27',
    aprobadoPor: 'Lic. Roberto Morales',
    totalPagado: 8589.6,
    tablaAmortizacion: generateSampleAmortization(12000, 16, 954.4, 750, 90, 14.4, 50, 50, 9)
  },
  {
    id: 'con-1002',
    folio: 'GAR-2026-092',
    clienteId: 'cli-002',
    sucursalId: 'suc-centro',
    montoSolicitado: 25000,
    plazoSemanas: 24,
    frecuencia: 'semanal',
    diaPago: 'Miércoles',
    tasaInteresPorcentaje: 15,
    interesTotal: 3750,
    ivaTotal: 600,
    seguroVidaTotal: 1200,
    ahorroTotal: 1200,
    montoTotalAdeudo: 31750,
    cuotaPeriodica: 1322.9,
    saldoPendiente: 18520.6,
    saldoVencido: 2645.8, // 2 pagos en atraso (Mora)
    estatus: 'En Mora',
    fechaAprobacion: '2026-07-15',
    fechaPrimerPago: '2026-07-22',
    aprobadoPor: 'Lic. Roberto Morales',
    totalPagado: 13229.4,
    tablaAmortizacion: generateSampleAmortization(25000, 24, 1322.9, 1041.6, 156.25, 25, 50, 50, 8)
  },
  {
    id: 'con-1003',
    folio: 'GAR-2026-098',
    clienteId: 'cli-003',
    sucursalId: 'suc-centro',
    montoSolicitado: 8000,
    plazoSemanas: 12,
    frecuencia: 'semanal',
    diaPago: 'Miércoles',
    tasaInteresPorcentaje: 10,
    interesTotal: 800,
    ivaTotal: 128,
    seguroVidaTotal: 600,
    ahorroTotal: 600,
    montoTotalAdeudo: 10128,
    cuotaPeriodica: 844,
    saldoPendiente: 2532,
    saldoVencido: 0,
    estatus: 'Activo',
    fechaAprobacion: '2026-08-30',
    fechaPrimerPago: '2026-09-06',
    aprobadoPor: 'Lic. Roberto Morales',
    totalPagado: 7596,
    tablaAmortizacion: generateSampleAmortization(8000, 12, 844, 666.6, 66.6, 10.6, 50, 50, 9)
  },
  {
    id: 'con-1004',
    folio: 'GAR-2026-104',
    clienteId: 'cli-004',
    sucursalId: 'suc-centro',
    montoSolicitado: 15000,
    plazoSemanas: 16,
    frecuencia: 'semanal',
    diaPago: 'Jueves',
    tasaInteresPorcentaje: 12,
    interesTotal: 1800,
    ivaTotal: 288,
    seguroVidaTotal: 800,
    ahorroTotal: 800,
    montoTotalAdeudo: 18688,
    cuotaPeriodica: 1168,
    saldoPendiente: 14016,
    saldoVencido: 0,
    estatus: 'Activo',
    fechaAprobacion: '2026-09-22',
    fechaPrimerPago: '2026-09-29',
    aprobadoPor: 'Lic. Roberto Morales',
    totalPagado: 4672,
    tablaAmortizacion: generateSampleAmortization(15000, 16, 1168, 937.5, 112.5, 18, 50, 50, 4)
  },
  {
    id: 'con-1005',
    folio: 'GAR-2026-077',
    clienteId: 'cli-005',
    sucursalId: 'suc-norte',
    montoSolicitado: 20000,
    plazoSemanas: 20,
    frecuencia: 'semanal',
    diaPago: 'Miércoles',
    tasaInteresPorcentaje: 14,
    interesTotal: 2800,
    ivaTotal: 448,
    seguroVidaTotal: 1000,
    ahorroTotal: 1000,
    montoTotalAdeudo: 25248,
    cuotaPeriodica: 1262.4,
    saldoPendiente: 8836.8,
    saldoVencido: 0,
    estatus: 'Activo',
    fechaAprobacion: '2026-08-10',
    fechaPrimerPago: '2026-08-17',
    aprobadoPor: 'Ing. Carmen Salazar',
    totalPagado: 16411.2,
    tablaAmortizacion: generateSampleAmortization(20000, 20, 1262.4, 1000, 140, 22.4, 50, 50, 13)
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

// Motorcycle Fleet / Workshop Orders
export const INITIAL_MOTO_ORDERS: MotorcycleOrder[] = [
  {
    id: 'mot-001',
    folio: 'TALL-2026-014',
    placa: 'CDMX-98A7',
    modelo: 'Honda Cargo 150cc (Ruta Centro)',
    cobradorAsignado: 'Alejandro Ruiz',
    sucursalId: 'suc-centro',
    servicioSolicitado: 'Cambio de balatas traseras, afinación y cambio de aceite sintético',
    fechaIngreso: '2026-10-20',
    kilometraje: 32450,
    costoEstimado: 680,
    estatus: 'Reparada',
    mecanicoResponsable: 'Mtro. Javier Peña'
  },
  {
    id: 'mot-002',
    folio: 'TALL-2026-015',
    placa: 'MEX-44K1',
    modelo: 'Italika FT150 (Ruta Tlalnepantla)',
    cobradorAsignado: 'Víctor Peñaloza',
    sucursalId: 'suc-norte',
    servicioSolicitado: 'Reemplazo de cadena de arrastre y ajuste de carburador',
    fechaIngreso: '2026-10-21',
    kilometraje: 41800,
    costoEstimado: 950,
    estatus: 'En Taller',
    mecanicoResponsable: 'Mtro. Javier Peña'
  }
];

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

  // Motorcycle Orders
  getMotoOrders(): MotorcycleOrder[] {
    const data = localStorage.getItem(STORAGE_KEYS.MOTO_ORDERS);
    if (!data) {
      if (this.isDemoSuppressed()) return [];
      this.saveMotoOrders(INITIAL_MOTO_ORDERS);
      return INITIAL_MOTO_ORDERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveMotoOrders(orders: MotorcycleOrder[]): void {
    localStorage.setItem(STORAGE_KEYS.MOTO_ORDERS, JSON.stringify(orders));
  },

  addMotoOrder(order: MotorcycleOrder): void {
    const orders = this.getMotoOrders();
    orders.unshift(order);
    this.saveMotoOrders(orders);
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
