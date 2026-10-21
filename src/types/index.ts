/**
 * Tipos de datos para el Sistema Integral de Microcréditos y Cobranza - Garma y Asociados
 */

export type UserRole = 'cobrador' | 'gerente' | 'admin' | 'taller';

export type PaymentFrequency = 'semanal' | 'quincenal' | 'mensual';

export type PaymentDay = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';

export type LoanStatus = 'Activo' | 'Liquidado' | 'Vencido' | 'En Mora';

export interface Aval {
  id: string;
  nombreCompleto: string;
  telefono: string;
  direccion: string;
  parentesco: string;
  identificacionOficial?: string;
}

export interface Client {
  id: string;
  nombreCompleto: string;
  telefono: string;
  direccion: string;
  giroNegocio: string;
  diaAsignadoPago: PaymentDay;
  sucursalId: string;
  aval: Aval;
  fechaRegistro: string;
  historialMoraExterna?: boolean;
  notas?: string;
}

export interface AmortizationRow {
  numeroCuota: number;
  fechaVencimiento: string;
  cuotaTotal: number;
  capital: number;
  interes: number;
  iva: number;
  seguro: number;
  ahorro: number;
  saldoRestante: number;
  estado: 'Pendiente' | 'Pagado' | 'Atrasado';
  montoPagado: number;
}

export interface LoanContract {
  id: string;
  folio: string;
  clienteId: string;
  sucursalId: string;
  montoSolicitado: number;
  plazoSemanas: number;
  frecuencia: PaymentFrequency;
  diaPago: PaymentDay;
  tasaInteresPorcentaje: number;
  interesTotal: number;
  ivaTotal: number;
  seguroVidaTotal: number;
  ahorroTotal: number;
  montoTotalAdeudo: number;
  cuotaPeriodica: number;
  saldoPendiente: number;
  saldoVencido: number;
  estatus: LoanStatus;
  fechaAprobacion: string;
  fechaPrimerPago: string;
  aprobadoPor: string;
  tablaAmortizacion: AmortizationRow[];
  totalPagado: number;
}

export interface PaymentTransaction {
  id: string;
  folio: string;
  contratoId: string;
  clienteId: string;
  clienteNombre: string;
  montoPagado: number;
  fecha: string;
  metodoPago: 'Efectivo' | 'Transferencia' | 'Terminal / Tarjeta';
  sucursalId: string;
  cobradorNombre: string;
  desglose: {
    moraCuotaVencida: number;
    seguro: number;
    interes: number;
    capital: number;
    ahorro: number;
  };
  saldoAnterior: number;
  nuevoSaldo: number;
  notas?: string;
}

export interface CashRegisterCut {
  id: string;
  folio: string;
  fecha: string;
  sucursalId: string;
  gerenteNombre: string;
  cobrosEsperados: number;
  cobrosIngresados: number;
  totalEfectivoReportado: number;
  diferencia: number;
  clientesProgramados: number;
  clientesPagaron: number;
  clientesFaltantes: number;
  cerrado: boolean;
  observaciones: string;
}

export interface Branch {
  id: string;
  nombre: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  gerenteEncargado: string;
  activa: boolean;
}

export interface UserAccount {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  sucursalId: string;
  telefono: string;
  activo: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  usuario: string;
  rol: string;
  accion: string;
  modulo: string;
  detalles: string;
  sucursalId: string;
}

export interface MotorcycleOrder {
  id: string;
  folio: string;
  placa: string;
  modelo: string;
  cobradorAsignado: string;
  sucursalId: string;
  servicioSolicitado: string;
  fechaIngreso: string;
  kilometraje: number;
  costoEstimado: number;
  estatus: 'En Taller' | 'Reparada' | 'En Ruta' | 'Refacciones Pendientes';
  mecanicoResponsable: string;
}
