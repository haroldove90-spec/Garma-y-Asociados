import React, { useState, useMemo } from 'react';
import { 
  Client, 
  LoanContract, 
  PaymentTransaction, 
  CashRegisterCut, 
  Branch, 
  UserAccount, 
  AuditLog, 
  UserRole 
} from '../types';
import { storageService } from '../services/storage';
import { 
  PieChart, 
  Building, 
  Users, 
  FileSpreadsheet, 
  History, 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  AlertOctagon, 
  Download, 
  Plus, 
  CheckCircle2, 
  Search, 
  Filter, 
  Sparkles 
} from 'lucide-react';

interface AdminViewProps {
  activeModule: string;
  clients: Client[];
  contracts: LoanContract[];
  transactions: PaymentTransaction[];
  cashCuts: CashRegisterCut[];
  branches: Branch[];
  users: UserAccount[];
  auditLogs: AuditLog[];
  activeBranchId: string;
  onBranchChange: (branchId: string) => void;
  onBranchAdded: (branch: Branch) => void;
  onUserAdded: (user: UserAccount) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  activeModule,
  clients,
  contracts,
  transactions,
  cashCuts,
  branches,
  users,
  auditLogs,
  activeBranchId,
  onBranchChange,
  onBranchAdded,
  onUserAdded
}) => {
  // Safe active module fallback
  const currentModule = ['global', 'sucursales', 'reportes', 'auditoria'].includes(activeModule) ? activeModule : 'global';

  // Filter according to selected branch or global
  const filteredContracts = useMemo(() => {
    return contracts.filter(c => activeBranchId === 'todas' || c.sucursalId === activeBranchId);
  }, [contracts, activeBranchId]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => activeBranchId === 'todas' || t.sucursalId === activeBranchId);
  }, [transactions, activeBranchId]);

  const filteredClients = useMemo(() => {
    return clients.filter(c => activeBranchId === 'todas' || c.sucursalId === activeBranchId);
  }, [clients, activeBranchId]);

  // Global Financial Aggregates
  const totalPrestadoHistorico = filteredContracts.reduce((acc, c) => acc + c.montoSolicitado, 0);
  const totalAdeudoPorCobrar = filteredContracts.filter(c => c.estatus !== 'Liquidado').reduce((acc, c) => acc + c.saldoPendiente, 0);
  const totalRecaudadoGlobal = filteredTransactions.reduce((acc, t) => acc + t.montoPagado, 0);
  const totalRecaudadoHoy = filteredTransactions
    .filter(t => t.fecha.startsWith('2026-10-21'))
    .reduce((acc, t) => acc + t.montoPagado, 0);

  const carteraVigenteMonto = filteredContracts
    .filter(c => c.estatus === 'Activo')
    .reduce((acc, c) => acc + c.saldoPendiente, 0);

  const carteraVencidaMonto = filteredContracts
    .filter(c => c.estatus === 'En Mora' || c.saldoVencido > 0)
    .reduce((acc, c) => acc + c.saldoPendiente, 0);

  const totalCarteraActiva = carteraVigenteMonto + carteraVencidaMonto;
  const pctVigente = totalCarteraActiva > 0 ? (carteraVigenteMonto / totalCarteraActiva) * 100 : 100;
  const pctVencida = totalCarteraActiva > 0 ? (carteraVencidaMonto / totalCarteraActiva) * 100 : 0;

  // New Branch Form Modal
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [branchNombre, setBranchNombre] = useState('');
  const [branchCiudad, setBranchCiudad] = useState('');
  const [branchDireccion, setBranchDireccion] = useState('');
  const [branchTelefono, setBranchTelefono] = useState('');
  const [branchGerente, setBranchGerente] = useState('');

  // New User Form Modal
  const [showAddUser, setShowAddUser] = useState(false);
  const [userNombre, setUserNombre] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRol, setUserRol] = useState<UserRole>('cobrador');
  const [userSucursal, setUserSucursal] = useState('suc-centro');
  const [userTelefono, setUserTelefono] = useState('');

  // Export handlers
  const handleExportClients = () => {
    storageService.exportToCSV('Reporte_Clientes_Garma', clients.map(c => ({
      ID: c.id,
      Nombre: c.nombreCompleto,
      Telefono: c.telefono,
      Direccion: c.direccion,
      Giro: c.giroNegocio,
      DiaPago: c.diaAsignadoPago,
      Sucursal: c.sucursalId,
      AvalNombre: c.aval.nombreCompleto,
      AvalTelefono: c.aval.telefono,
      AvalParentesco: c.aval.parentesco,
      FechaRegistro: c.fechaRegistro
    })));
  };

  const handleExportContracts = () => {
    storageService.exportToCSV('Reporte_Contratos_Garma', contracts.map(c => ({
      Folio: c.folio,
      ClienteID: c.clienteId,
      Sucursal: c.sucursalId,
      MontoPrestado: c.montoSolicitado,
      PlazoSemanas: c.plazoSemanas,
      Frecuencia: c.frecuencia,
      DiaCobro: c.diaPago,
      TasaInteres: c.tasaInteresPorcentaje,
      InteresTotal: c.interesTotal,
      IVATotal: c.ivaTotal,
      SeguroTotal: c.seguroVidaTotal,
      AhorroTotal: c.ahorroTotal,
      AdeudoTotal: c.montoTotalAdeudo,
      CuotaPeriodica: c.cuotaPeriodica,
      SaldoPendiente: c.saldoPendiente,
      SaldoVencido: c.saldoVencido,
      Estatus: c.estatus,
      AprobadoPor: c.aprobadoPor,
      FechaAprobacion: c.fechaAprobacion
    })));
  };

  const handleExportTransactions = () => {
    storageService.exportToCSV('Reporte_Cobros_Transacciones_Garma', transactions.map(t => ({
      Folio: t.folio,
      FechaHora: t.fecha,
      Cliente: t.clienteNombre,
      MontoPagado: t.montoPagado,
      MetodoPago: t.metodoPago,
      Sucursal: t.sucursalId,
      Cobrador: t.cobradorNombre,
      SaldoAnterior: t.saldoAnterior,
      NuevoSaldo: t.nuevoSaldo,
      CapitalAplicado: t.desglose.capital,
      InteresAplicado: t.desglose.interes,
      SeguroAplicado: t.desglose.seguro,
      AhorroAplicado: t.desglose.ahorro,
      MoraRecargoAplicado: t.desglose.moraCuotaVencida
    })));
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchNombre || !branchCiudad) return;
    const newBranch: Branch = {
      id: `suc-${Date.now()}`,
      nombre: branchNombre,
      ciudad: branchCiudad,
      direccion: branchDireccion,
      telefono: branchTelefono,
      gerenteEncargado: branchGerente || 'Por Asignar',
      activa: true
    };
    onBranchAdded(newBranch);
    setShowAddBranch(false);
    setBranchNombre('');
    setBranchCiudad('');
    setBranchDireccion('');
    setBranchTelefono('');
    setBranchGerente('');
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userNombre || !userEmail) return;
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      nombre: userNombre,
      email: userEmail,
      rol: userRol,
      sucursalId: userSucursal,
      telefono: userTelefono,
      activo: true
    };
    onUserAdded(newUser);
    setShowAddUser(false);
    setUserNombre('');
    setUserEmail('');
    setUserTelefono('');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Title & Multi-branch filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#C42326] rounded-full inline-block" />
            <span>Dirección General y Supervisión Global</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Hugo García • Acceso Total Multi-Sucursal en Tiempo Real
          </p>
        </div>

        {/* Global Multi-branch selector toggle */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-300 shadow-xs">
          <Building className="w-4 h-4 text-[#F07D08]" />
          <span className="text-xs font-bold text-slate-700">Vista:</span>
          <select
            value={activeBranchId}
            onChange={(e) => onBranchChange(e.target.value)}
            className="text-xs font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="todas">🏢 Todas las Sucursales (Consolidado)</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* GLOBAL CARTERA HEALTH INDICATORS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Cartera Global por Cobrar
          </span>
          <div className="mt-1">
            <span className="text-2xl font-black text-slate-900 font-mono">
              ${totalAdeudoPorCobrar.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block font-mono">
            Histórico Prestado: ${totalPrestadoHistorico.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Recaudación Global Hoy
          </span>
          <div className="mt-1">
            <span className="text-2xl font-black text-emerald-700 font-mono">
              ${totalRecaudadoHoy.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-[10px] text-emerald-700 mt-1 block">
            {filteredTransactions.filter(t => t.fecha.startsWith('2026-10-21')).length} transacciones registradas hoy
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Cartera Vigente ({pctVigente.toFixed(1)}%)
          </span>
          <div className="mt-1">
            <span className="text-2xl font-black text-slate-900 font-mono">
              ${carteraVigenteMonto.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 mt-1 block font-semibold">
            ✓ Clientes al corriente
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/20 shadow-xs">
          <span className="text-[11px] font-bold text-[#C42326] uppercase tracking-wider block">
            Cartera en Mora ({pctVencida.toFixed(1)}%)
          </span>
          <div className="mt-1">
            <span className="text-2xl font-black text-[#C42326] font-mono">
              ${carteraVencidaMonto.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <span className="text-[10px] text-red-600 mt-1 block font-semibold">
            • Atraso o morosidad
          </span>
        </div>
      </div>

      {/* HEALTH BAR (VIGENTE VS VENCIDA) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-700">Composición de Salud de Cartera:</span>
          <div className="flex items-center gap-4">
            <span className="text-emerald-700 flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              Al Corriente: {pctVigente.toFixed(1)}% (${carteraVigenteMonto.toLocaleString('es-MX')})
            </span>
            <span className="text-[#C42326] flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#C42326] inline-block" />
              En Mora: {pctVencida.toFixed(1)}% (${carteraVencidaMonto.toLocaleString('es-MX')})
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${pctVigente}%` }}
            className="h-full bg-emerald-500 transition-all duration-300"
            title={`Vigente: ${pctVigente.toFixed(1)}%`}
          />
          <div
            style={{ width: `${pctVencida}%` }}
            className="h-full bg-[#C42326] transition-all duration-300"
            title={`Vencida: ${pctVencida.toFixed(1)}%`}
          />
        </div>
      </div>

      {/* MODULE: TABLERO GLOBAL (Recaudación por Sucursal & Cartera) */}
      {currentModule === 'global' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Branch breakdown cards */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 border-b pb-3 flex items-center justify-between">
                <span>Rendimiento y Recaudación por Sucursal</span>
                <span className="text-xs font-mono text-slate-500">{branches.length} sucursales</span>
              </h3>

              <div className="mt-4 space-y-3">
                {branches.map((b) => {
                  const bContracts = contracts.filter(c => c.sucursalId === b.id);
                  const bTx = transactions.filter(t => t.sucursalId === b.id);
                  const bHoy = bTx.filter(t => t.fecha.startsWith('2026-10-21')).reduce((acc, t) => acc + t.montoPagado, 0);
                  const bMora = bContracts.filter(c => c.estatus === 'En Mora' || c.saldoVencido > 0).reduce((acc, c) => acc + c.saldoPendiente, 0);
                  const bCartera = bContracts.filter(c => c.estatus !== 'Liquidado').reduce((acc, c) => acc + c.saldoPendiente, 0);

                  return (
                    <div
                      key={b.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{b.nombre}</h4>
                          <p className="text-xs text-slate-500">Gerente: {b.gerenteEncargado} • {b.telefono}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Activa
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-200">
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase block">Recaudado Hoy</span>
                          <span className="font-bold text-[#C42326] font-mono text-sm">
                            ${bHoy.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase block">Cartera Activa</span>
                          <span className="font-bold text-slate-900 font-mono text-sm">
                            ${bCartera.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase block">Monto en Mora</span>
                          <span className="font-bold text-red-600 font-mono text-sm">
                            ${bMora.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Decision & Delinquent Critical Actions */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-[#C42326]" />
                <span>Mora Crítica para Decisión Directiva</span>
              </h3>

              <div className="space-y-3">
                {contracts
                  .filter(c => c.estatus === 'En Mora' || c.saldoVencido > 0)
                  .map((c) => {
                    const client = clients.find(cl => cl.id === c.clienteId);
                    return (
                      <div
                        key={c.id}
                        className="p-3 bg-red-50/50 rounded-xl border border-red-200 text-xs space-y-1.5"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-slate-900">{client?.nombreCompleto}</span>
                            <p className="text-[11px] text-slate-500">Folio: {c.folio} • Sucursal: {c.sucursalId}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-200 text-red-900 font-mono">
                            ${c.saldoVencido.toFixed(2)} Vencido
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          Aval Solidario: <strong>{client?.aval.nombreCompleto}</strong> ({client?.aval.telefono})
                        </div>
                        <div className="pt-2 flex gap-2">
                          <button
                            onClick={() => alert(`Acción Directiva registrada para contrato ${c.folio}: Se instruye cobranza jurídica / extrajudicial al aval.`)}
                            className="flex-1 py-1.5 bg-[#C42326] hover:bg-[#a51c1f] text-white text-[11px] font-bold rounded-lg transition"
                          >
                            Cobranza Extrajudicial Aval
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE: SUCURSALES Y USUARIOS */}
      {currentModule === 'sucursales' && (
        <div className="space-y-6">
          {/* Header with Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-900">
              Red de Sucursales y Usuarios del Sistema
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddBranch(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#F07D08]" />
                <span>Nueva Sucursal</span>
              </button>
              <button
                onClick={() => setShowAddUser(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#C42326] hover:bg-[#a51c1f] text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Usuario</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Usuarios Registrados y Roles</h4>
              <span className="text-xs text-slate-500 font-mono">{users.length} cuentas</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b">
                  <tr>
                    <th className="py-3 px-4">Nombre</th>
                    <th className="py-3 px-4">Correo Electrónico</th>
                    <th className="py-3 px-4">Rol Asignado</th>
                    <th className="py-3 px-4">Sucursal</th>
                    <th className="py-3 px-4">Teléfono</th>
                    <th className="py-3 px-4 text-center">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{u.nombre}</td>
                      <td className="py-3 px-4 text-slate-600 font-mono">{u.email}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {u.rol === 'admin' && '👑 Administrador General'}
                        {u.rol === 'gerente' && '👔 Gerente de Sucursal'}
                        {u.rol === 'cobrador' && '🛵 Cobrador / Asesor'}
                        {u.rol === 'taller' && '🔧 Taller de Motos'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {branches.find(b => b.id === u.sucursalId)?.nombre || u.sucursalId}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono">{u.telefono}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Activo
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE: REPORTES Y EXPORTACIÓN */}
      {currentModule === 'reportes' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Exportación Oficial de Reportes (Excel / CSV)
            </h3>
            <p className="text-xs text-slate-500">
              Descargue los registros completos para auditoría contable y conciliación fiscal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Report 1: Clientes */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <span className="p-2.5 bg-blue-100 text-blue-700 rounded-xl inline-block mb-3">
                  <Users className="w-5 h-5" />
                </span>
                <h4 className="text-sm font-bold text-slate-900">Padrón de Clientes y Avales</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Incluye datos del titular, avales de respaldo, teléfonos, giro comercial y día asignado.
                </p>
                <div className="mt-3 text-xs font-mono text-slate-500">
                  Total registros: <strong>{clients.length}</strong>
                </div>
              </div>

              <button
                onClick={handleExportClients}
                className="mt-4 flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#F07D08]" />
                <span>Exportar Clientes CSV</span>
              </button>
            </div>

            {/* Report 2: Contratos */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <span className="p-2.5 bg-amber-100 text-[#F07D08] rounded-xl inline-block mb-3">
                  <FileSpreadsheet className="w-5 h-5" />
                </span>
                <h4 className="text-sm font-bold text-slate-900">Contratos de Crédito</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Desglose financiero de capital, intereses, IVA, seguro, cuotas y saldos pendientes.
                </p>
                <div className="mt-3 text-xs font-mono text-slate-500">
                  Total contratos: <strong>{contracts.length}</strong>
                </div>
              </div>

              <button
                onClick={handleExportContracts}
                className="mt-4 flex items-center justify-center gap-2 py-2.5 bg-[#C42326] hover:bg-[#a51c1f] text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Contratos CSV</span>
              </button>
            </div>

            {/* Report 3: Cobros */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <span className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl inline-block mb-3">
                  <DollarSign className="w-5 h-5" />
                </span>
                <h4 className="text-sm font-bold text-slate-900">Bitácora de Cobros y Pagos</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Histórico de folios emitidos, montos, desglose aplicado y cobrador responsable.
                </p>
                <div className="mt-3 text-xs font-mono text-slate-500">
                  Total cobros: <strong>{transactions.length}</strong>
                </div>
              </div>

              <button
                onClick={handleExportTransactions}
                className="mt-4 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Cobros CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODULE: BITÁCORA Y AUDITORÍA DE COBROS */}
      {currentModule === 'auditoria' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-[#F07D08]" />
                <span>Bitácora de Auditoría y Control Anti-Fraude</span>
              </h3>
              <p className="text-xs text-slate-500">
                Registro inmutable de movimientos, cobros y aperturas en toda la red Garma
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {auditLogs.length} eventos registrados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
                <tr>
                  <th className="py-3 px-4">Fecha y Hora</th>
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Rol</th>
                  <th className="py-3 px-4">Acción</th>
                  <th className="py-3 px-4">Módulo</th>
                  <th className="py-3 px-4">Detalles del Evento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 text-slate-500">{log.timestamp}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 font-sans">{log.usuario}</td>
                    <td className="py-2.5 px-4 text-slate-700 font-sans">{log.rol}</td>
                    <td className="py-2.5 px-4 font-bold text-[#C42326]">{log.accion}</td>
                    <td className="py-2.5 px-4 text-slate-600">{log.modulo}</td>
                    <td className="py-2.5 px-4 text-slate-600 font-sans">{log.detalles}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL NUEVA SUCURSAL */}
      {showAddBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">Registrar Nueva Sucursal</h3>
            <form onSubmit={handleSaveBranch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nombre de Sucursal *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sucursal Sur - Coapa"
                  value={branchNombre}
                  onChange={(e) => setBranchNombre(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Ciudad / Municipio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: CDMX"
                  value={branchCiudad}
                  onChange={(e) => setBranchCiudad(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Dirección</label>
                <input
                  type="text"
                  placeholder="Calle y número"
                  value={branchDireccion}
                  onChange={(e) => setBranchDireccion(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Teléfono</label>
                <input
                  type="text"
                  placeholder="55-0000-0000"
                  value={branchTelefono}
                  onChange={(e) => setBranchTelefono(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Gerente Encargado</label>
                <input
                  type="text"
                  placeholder="Nombre del gerente"
                  value={branchGerente}
                  onChange={(e) => setBranchGerente(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBranch(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C42326] text-white rounded-lg font-bold cursor-pointer"
                >
                  Guardar Sucursal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NUEVO USUARIO */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">Crear Cuenta de Usuario</h3>
            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Nombre y Apellidos"
                  value={userNombre}
                  onChange={(e) => setUserNombre(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  placeholder="usuario@garmayasociados.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Rol en el Sistema *</label>
                <select
                  value={userRol}
                  onChange={(e) => setUserRol(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border rounded-lg font-bold"
                >
                  <option value="cobrador">Cobrador / Asesor de Sucursal</option>
                  <option value="gerente">Gerente de Sucursal</option>
                  <option value="admin">Administrador General</option>
                  <option value="taller">Taller de Motos</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Sucursal Asignada *</label>
                <select
                  value={userSucursal}
                  onChange={(e) => setUserSucursal(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg font-bold"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Teléfono</label>
                <input
                  type="text"
                  placeholder="55-1234-5678"
                  value={userTelefono}
                  onChange={(e) => setUserTelefono(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C42326] text-white rounded-lg font-bold cursor-pointer"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
