import React, { useState, useMemo } from 'react';
import { 
  Client, 
  LoanContract, 
  PaymentTransaction, 
  CashRegisterCut, 
  Branch, 
  PaymentFrequency, 
  PaymentDay,
  AmortizationRow 
} from '../types';
import { storageService } from '../services/storage';
import { 
  Calculator, 
  Scale, 
  PieChart, 
  FileText, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Printer, 
  Users, 
  ArrowUpRight, 
  FileCheck,
  Check
} from 'lucide-react';

interface GerenteViewProps {
  activeModule: string;
  clients: Client[];
  contracts: LoanContract[];
  transactions: PaymentTransaction[];
  cashCuts: CashRegisterCut[];
  branches: Branch[];
  activeBranchId: string;
  onContractApproved: (contract: LoanContract) => void;
  onCashCutCompleted: (cut: CashRegisterCut) => void;
  onViewContract: (contract: LoanContract, client: Client) => void;
}

export const GerenteView: React.FC<GerenteViewProps> = ({
  activeModule,
  clients,
  contracts,
  transactions,
  cashCuts,
  branches,
  activeBranchId,
  onContractApproved,
  onCashCutCompleted,
  onViewContract
}) => {
  // Current active branch name
  const currentBranch = branches.find(b => b.id === activeBranchId) || branches[0];

  // Branch filtered data
  const branchContracts = useMemo(() => {
    return contracts.filter(c => activeBranchId === 'todas' || c.sucursalId === activeBranchId);
  }, [contracts, activeBranchId]);

  const branchTransactions = useMemo(() => {
    return transactions.filter(t => activeBranchId === 'todas' || t.sucursalId === activeBranchId);
  }, [transactions, activeBranchId]);

  const branchClients = useMemo(() => {
    return clients.filter(c => activeBranchId === 'todas' || c.sucursalId === activeBranchId);
  }, [clients, activeBranchId]);

  // SIMULATOR STATE
  const [selectedClientId, setSelectedClientId] = useState<string>(branchClients[0]?.id || '');
  const [montoSolicitado, setMontoSolicitado] = useState<number>(10000);
  const [plazoSemanas, setPlazoSemanas] = useState<number>(16);
  const [frecuencia, setFrecuencia] = useState<PaymentFrequency>('semanal');
  const [tasaInteres, setTasaInteres] = useState<number>(12); // 12%
  const [cuotaSeguroSemanal, setCuotaSeguroSemanal] = useState<number>(50);
  const [cuotaAhorroSemanal, setCuotaAhorroSemanal] = useState<number>(50);
  const [diaCobro, setDiaCobro] = useState<PaymentDay>('Miércoles');

  // Simulation calculations
  const simCalculations = useMemo(() => {
    const capital = montoSolicitado;
    const interes = (capital * (tasaInteres / 100));
    const iva = (interes * 0.16);
    const seguroTotal = cuotaSeguroSemanal * plazoSemanas;
    const ahorroTotal = cuotaAhorroSemanal * plazoSemanas;
    const adeudoTotal = capital + interes + iva + seguroTotal + ahorroTotal;
    const cuotaPeriodica = adeudoTotal / plazoSemanas;

    // Build Amortization Table
    const table: AmortizationRow[] = [];
    const capitalPorSemana = capital / plazoSemanas;
    const interesPorSemana = interes / plazoSemanas;
    const ivaPorSemana = iva / plazoSemanas;
    let saldoRestante = adeudoTotal;

    const baseDate = new Date();
    for (let i = 1; i <= plazoSemanas; i++) {
      const fechaVenc = new Date(baseDate);
      fechaVenc.setDate(baseDate.getDate() + i * 7);
      saldoRestante -= cuotaPeriodica;

      table.push({
        numeroCuota: i,
        fechaVencimiento: fechaVenc.toISOString().split('T')[0],
        cuotaTotal: Math.round(cuotaPeriodica * 100) / 100,
        capital: Math.round(capitalPorSemana * 100) / 100,
        interes: Math.round(interesPorSemana * 100) / 100,
        iva: Math.round(ivaPorSemana * 100) / 100,
        seguro: cuotaSeguroSemanal,
        ahorro: cuotaAhorroSemanal,
        saldoRestante: Math.max(0, Math.round(saldoRestante * 100) / 100),
        estado: 'Pendiente',
        montoPagado: 0
      });
    }

    return {
      capital,
      interes,
      iva,
      seguroTotal,
      ahorroTotal,
      adeudoTotal,
      cuotaPeriodica,
      table
    };
  }, [montoSolicitado, plazoSemanas, tasaInteres, cuotaSeguroSemanal, cuotaAhorroSemanal]);

  // Authorize & Issue Credit
  const handleAuthorizeCredit = () => {
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) {
      alert('Seleccione un cliente válido.');
      return;
    }

    // Check if client already has an active loan with arrears
    const existingActive = contracts.find(c => c.clienteId === client.id && c.estatus === 'En Mora');
    if (existingActive) {
      alert(`El cliente ${client.nombreCompleto} tiene el crédito ${existingActive.folio} en MORA. No se puede aperturar uno nuevo.`);
      return;
    }

    const folioNum = Math.floor(100 + Math.random() * 900);
    const newContract: LoanContract = {
      id: `con-${Date.now()}`,
      folio: `GAR-2026-${folioNum}`,
      clienteId: client.id,
      sucursalId: currentBranch.id,
      montoSolicitado: simCalculations.capital,
      plazoSemanas: plazoSemanas,
      frecuencia: frecuencia,
      diaPago: diaCobro,
      tasaInteresPorcentaje: tasaInteres,
      interesTotal: simCalculations.interes,
      ivaTotal: simCalculations.iva,
      seguroVidaTotal: simCalculations.seguroTotal,
      ahorroTotal: simCalculations.ahorroTotal,
      montoTotalAdeudo: simCalculations.adeudoTotal,
      cuotaPeriodica: Math.round(simCalculations.cuotaPeriodica * 100) / 100,
      saldoPendiente: simCalculations.adeudoTotal,
      saldoVencido: 0,
      estatus: 'Activo',
      fechaAprobacion: new Date().toISOString().split('T')[0],
      fechaPrimerPago: simCalculations.table[0]?.fechaVencimiento || '',
      aprobadoPor: currentBranch.gerenteEncargado,
      totalPagado: 0,
      tablaAmortizacion: simCalculations.table
    };

    onContractApproved(newContract);
    // Immediately open printable contract for signing
    onViewContract(newContract, client);
    alert(`¡Crédito ${newContract.folio} aprobado exitosamente! Se genera contrato para firma.`);
  };

  // CASH CUT & ARQUEO STATE
  const todayTransactions = useMemo(() => {
    return branchTransactions.filter(t => t.fecha.startsWith('2026-10-21'));
  }, [branchTransactions]);

  const totalCollectedToday = todayTransactions.reduce((acc, t) => acc + t.montoPagado, 0);

  // Missing payments of the day (clients with active credit assigned to Wednesday who haven't paid today)
  const missingPayments = useMemo(() => {
    return branchClients
      .filter(c => c.diaAsignadoPago === 'Miércoles')
      .filter(c => !todayTransactions.some(t => t.clienteId === c.id))
      .map(client => {
        const contract = contracts.find(ct => ct.clienteId === client.id && ct.estatus !== 'Liquidado');
        return { client, contract };
      })
      .filter(item => item.contract !== undefined);
  }, [branchClients, todayTransactions, contracts]);

  const [efectivoFisicoReportado, setEfectivoFisicoReportado] = useState<string>(totalCollectedToday.toString());
  const [arqueoNotas, setArqueoNotas] = useState('');

  const diferenciaCaja = parseFloat(efectivoFisicoReportado || '0') - totalCollectedToday;

  const handleCerrarArqueo = (e: React.FormEvent) => {
    e.preventDefault();
    const cut: CashRegisterCut = {
      id: `cut-${Date.now()}`,
      folio: `ARQ-${currentBranch.id.toUpperCase()}-${new Date().toISOString().split('T')[0].replace(/-/g, '')}`,
      fecha: new Date().toISOString().split('T')[0],
      sucursalId: currentBranch.id,
      gerenteNombre: currentBranch.gerenteEncargado,
      cobrosEsperados: totalCollectedToday + missingPayments.reduce((acc, m) => acc + (m.contract?.cuotaPeriodica || 0), 0),
      cobrosIngresados: totalCollectedToday,
      totalEfectivoReportado: parseFloat(efectivoFisicoReportado || '0'),
      diferencia: diferenciaCaja,
      clientesProgramados: todayTransactions.length + missingPayments.length,
      clientesPagaron: todayTransactions.length,
      clientesFaltantes: missingPayments.length,
      cerrado: true,
      observaciones: arqueoNotas || (diferenciaCaja === 0 ? 'Caja cuadrada sin diferencias.' : `Diferencia de $${diferenciaCaja.toFixed(2)}`)
    };

    onCashCutCompleted(cut);
    alert(`Arqueo de Sucursal registrado con Folio ${cut.folio}. Información consolidada a base central.`);
  };

  // LOCAL PORTFOLIO MONITORING
  const portfolioVigente = branchContracts.filter(c => c.estatus === 'Activo').reduce((acc, c) => acc + c.saldoPendiente, 0);
  const portfolioMora = branchContracts.filter(c => c.estatus === 'En Mora' || c.saldoVencido > 0).reduce((acc, c) => acc + c.saldoPendiente, 0);
  const portfolioTotal = portfolioVigente + portfolioMora;
  const morosidadPorcentaje = portfolioTotal > 0 ? (portfolioMora / portfolioTotal) * 100 : 0;

  const delinquentCredits = branchContracts.filter(c => c.estatus === 'En Mora' || c.saldoVencido > 0);

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#C42326] rounded-full inline-block" />
            {activeModule === 'simulador' && 'Simulador y Apertura de Créditos'}
            {activeModule === 'arqueo' && 'Corte y Arqueo Diario de Caja'}
            {activeModule === 'cartera' && 'Monitoreo Local de Cartera y Mora'}
            {activeModule === 'clientes' && 'Contratos y Expedientes de Sucursal'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Gerencia Operativa • {currentBranch.nombre} ({currentBranch.gerenteEncargado})
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Cartera Vigente Local
          </span>
          <div className="mt-1">
            <span className="text-2xl font-black text-slate-900 font-mono">
              ${portfolioVigente.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-red-200 bg-red-50/20 shadow-xs">
          <span className="text-[11px] font-bold text-[#C42326] uppercase tracking-wider block">
            Cartera en Atraso (Mora)
          </span>
          <div className="mt-1">
            <span className="text-2xl font-black text-[#C42326] font-mono">
              ${portfolioMora.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs text-red-700 ml-1.5 font-bold">({morosidadPorcentaje.toFixed(1)}%)</span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Cobrado en Sucursal Hoy
          </span>
          <div className="mt-1">
            <span className="text-2xl font-black text-emerald-700 font-mono">
              ${totalCollectedToday.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            Clientes Faltantes del Día
          </span>
          <div className="mt-1">
            <span className="text-2xl font-black text-[#F07D08] font-mono">
              {missingPayments.length}
            </span>
            <span className="text-xs text-amber-700 ml-1.5">por cobrar</span>
          </div>
        </div>
      </div>

      {/* MODULE 1: SIMULADOR Y APERTURA DE CRÉDITOS */}
      {activeModule === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Simulator Inputs Form */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F07D08]">
                Fase 2: Simulación y Otorgamiento
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Parámetros Financieros del Crédito
              </h3>
            </div>

            {/* Select Client */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cliente Acreditado (Titular):
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#C42326] focus:outline-none"
              >
                {branchClients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombreCompleto} — Aval: {c.aval.nombreCompleto}
                  </option>
                ))}
              </select>
            </div>

            {/* Loan Amount */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Monto Solicitado:</span>
                <span className="text-[#C42326] font-mono text-sm">${montoSolicitado.toLocaleString('es-MX')}</span>
              </div>
              <input
                type="range"
                min="2000"
                max="60000"
                step="1000"
                value={montoSolicitado}
                onChange={(e) => setMontoSolicitado(Number(e.target.value))}
                className="w-full accent-[#C42326] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>$2,000</span>
                <span>$30,000</span>
                <span>$60,000</span>
              </div>
            </div>

            {/* Term (Weeks) */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Plazo en Semanas:</span>
                <span className="text-slate-900 font-mono text-sm">{plazoSemanas} semanas</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[8, 12, 16, 24].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setPlazoSemanas(w)}
                    className={`py-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
                      plazoSemanas === w
                        ? 'bg-[#C42326] text-white border-[#C42326]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {w} sem
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate & Day */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tasa Interés (%)</label>
                <select
                  value={tasaInteres}
                  onChange={(e) => setTasaInteres(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none"
                >
                  <option value={8}>8% Preferencial</option>
                  <option value={10}>10% Estándar</option>
                  <option value={12}>12% Regular</option>
                  <option value={15}>15% Mayor Plazo</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Día de Cobro Pactado</label>
                <select
                  value={diaCobro}
                  onChange={(e) => setDiaCobro(e.target.value as PaymentDay)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                >
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Insurance & Savings Addons */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Seguro de Vida ($/sem)</label>
                <input
                  type="number"
                  value={cuotaSeguroSemanal}
                  onChange={(e) => setCuotaSeguroSemanal(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Aporte Ahorro ($/sem)</label>
                <input
                  type="number"
                  value={cuotaAhorroSemanal}
                  onChange={(e) => setCuotaAhorroSemanal(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            {/* Authorize Credit Button */}
            <div className="pt-3 border-t">
              <button
                type="button"
                onClick={handleAuthorizeCredit}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#C42326] hover:bg-[#a51c1f] text-white font-bold rounded-xl text-sm shadow-md transition active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5 text-[#F07D08]" />
                <span>Autorizar Crédito y Generar Contrato</span>
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Firma oficial requerida por {currentBranch.gerenteEncargado}
              </p>
            </div>
          </div>

          {/* Real-time Calculation Breakdown & Amortization Preview */}
          <div className="lg:col-span-7 space-y-4">
            {/* Calculation summary card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center justify-between">
                <span>Desglose Oficial en Tiempo Real</span>
                <span className="text-xs font-mono text-[#C42326]">Plazo: {plazoSemanas} semanas</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Capital Solicitado</span>
                  <span className="text-base font-black text-slate-900 font-mono">${simCalculations.capital.toFixed(2)}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Interés Total ({tasaInteres}%)</span>
                  <span className="text-base font-bold text-slate-800 font-mono">${simCalculations.interes.toFixed(2)}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">IVA (16% sobre interés)</span>
                  <span className="text-base font-bold text-slate-800 font-mono">${simCalculations.iva.toFixed(2)}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Seguro de Vida Acumulado</span>
                  <span className="text-base font-bold text-slate-800 font-mono">${simCalculations.seguroTotal.toFixed(2)}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Aportación a Ahorro</span>
                  <span className="text-base font-bold text-slate-800 font-mono">${simCalculations.ahorroTotal.toFixed(2)}</span>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-emerald-800 text-[10px] uppercase font-bold block">Adeudo Total Acumulado</span>
                  <span className="text-base font-black text-emerald-800 font-mono">${simCalculations.adeudoTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Big Fixed Periodic Payment Box */}
              <div className="p-4 bg-gradient-to-r from-red-50 to-amber-50 rounded-xl border-2 border-red-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-900 block">
                    Cuota Periódica Fija ({frecuencia})
                  </span>
                  <span className="text-xs text-slate-600">
                    A pagar cada <strong>{diaCobro}</strong> durante {plazoSemanas} semanas
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-[#C42326] font-mono">
                    ${simCalculations.cuotaPeriodica.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Amortization Table Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 bg-slate-50 border-b flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  Proyección de Tabla de Amortización Oficial ({simCalculations.table.length} Cuotas)
                </span>
                <span className="text-slate-500">Muestra las primeras semanas</span>
              </div>

              <div className="overflow-x-auto max-h-60 overflow-y-auto">
                <table className="w-full text-left text-[11px] font-mono">
                  <thead className="bg-slate-100 text-slate-600 font-semibold sticky top-0">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3 font-sans">Vencimiento</th>
                      <th className="py-2 px-3 text-right">Capital</th>
                      <th className="py-2 px-3 text-right">Interés</th>
                      <th className="py-2 px-3 text-right">IVA</th>
                      <th className="py-2 px-3 text-right font-bold text-slate-900">Cuota</th>
                      <th className="py-2 px-3 text-right">Saldo Restante</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {simCalculations.table.map((row) => (
                      <tr key={row.numeroCuota} className="hover:bg-slate-50">
                        <td className="py-1.5 px-3 font-bold text-slate-900">{row.numeroCuota}</td>
                        <td className="py-1.5 px-3 font-sans">{row.fechaVencimiento}</td>
                        <td className="py-1.5 px-3 text-right text-slate-600">${row.capital.toFixed(2)}</td>
                        <td className="py-1.5 px-3 text-right text-slate-600">${row.interes.toFixed(2)}</td>
                        <td className="py-1.5 px-3 text-right text-slate-600">${row.iva.toFixed(2)}</td>
                        <td className="py-1.5 px-3 text-right font-bold text-slate-900">${row.cuotaTotal.toFixed(2)}</td>
                        <td className="py-1.5 px-3 text-right text-[#C42326]">${row.saldoRestante.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: CORTE Y ARQUEO DE CAJA DIARIO */}
      {activeModule === 'arqueo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Arqueo Form & Confrontation */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C42326]">
                Fase 4: Corte Diario y Arqueo
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Confrontación de Efectivo Físico vs Sistema
              </h3>
            </div>

            <form onSubmit={handleCerrarArqueo} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cobros Registrados en Sistema (Hoy):</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    ${totalCollectedToday.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Número de Transacciones Capturadas:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {todayTransactions.length} recibos
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Clientes Programados que NO pagaron:</span>
                  <span className="font-mono font-bold text-[#F07D08]">
                    {missingPayments.length} faltantes
                  </span>
                </div>
              </div>

              {/* Physical Cash Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Efectivo Físico Contado en Bóveda / Caja ($ MXN):
                </label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={efectivoFisicoReportado}
                    onChange={(e) => setEfectivoFisicoReportado(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-lg font-bold font-mono bg-white border-2 border-slate-300 focus:border-[#C42326] rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Difference indicator */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between font-bold ${
                Math.abs(diferenciaCaja) < 0.01
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : diferenciaCaja > 0
                  ? 'bg-blue-50 border-blue-300 text-blue-800'
                  : 'bg-red-50 border-red-300 text-[#C42326]'
              }`}>
                <span>Descuadre / Diferencia:</span>
                <span className="text-base font-mono">
                  {diferenciaCaja === 0 ? '✓ Caja Cuadrada ($0.00)' : `$${diferenciaCaja.toFixed(2)}`}
                </span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Observaciones del Cierre de Caja:
                </label>
                <textarea
                  rows={2}
                  placeholder="Observaciones de entrega a valores o notas sobre faltantes..."
                  value={arqueoNotas}
                  onChange={(e) => setArqueoNotas(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#C42326] hover:bg-[#a51c1f] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
              >
                Cerrar Arqueo Oficial y Consolidar en la Nube
              </button>
            </form>
          </div>

          {/* Missing Payments Report of the Day */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b bg-amber-50/50 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#F07D08]" />
                  <span>Reporte de Clientes que NO Pagaron Hoy</span>
                </h4>
                <p className="text-xs text-amber-800">
                  Cuentas pendientes para gestión de cobranza inmediata
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-xs font-mono">
                {missingPayments.length} cuentas
              </span>
            </div>

            <div className="p-4 divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {missingPayments.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-1" />
                  <p className="text-xs font-semibold text-slate-700">
                    ¡Todos los clientes programados del día realizaron su pago!
                  </p>
                </div>
              ) : (
                missingPayments.map(({ client, contract }) => (
                  <div key={client.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <h5 className="font-bold text-slate-900">{client.nombreCompleto}</h5>
                      <p className="text-[11px] text-slate-500">{client.giroNegocio} • Tel: {client.telefono}</p>
                      <p className="text-[11px] text-slate-500">Aval: {client.aval.nombreCompleto} ({client.aval.telefono})</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#C42326] font-mono block">
                        Falta: ${(contract?.cuotaPeriodica || 0).toFixed(2)}
                      </span>
                      <a
                        href={`tel:${client.telefono}`}
                        className="inline-block mt-1 px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[10px]"
                      >
                        Llamar a Cliente
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: MONITOREO LOCAL DE CARTERA Y CRÉDITOS EN MORA */}
      {(activeModule === 'cartera' || activeModule === 'clientes') && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[#C42326]" />
                  <span>Créditos en Mora y Atraso para Cobranza Extrajudicial</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Detección y seguimiento prioritario de contratos morosos
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#C42326] bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                {delinquentCredits.length} contratos en mora activa
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b">
                  <tr>
                    <th className="py-3 px-4">Folio Contrato</th>
                    <th className="py-3 px-4">Titular y Negocio</th>
                    <th className="py-3 px-4">Aval de Respaldo</th>
                    <th className="py-3 px-4 text-right">Saldo Insoluto</th>
                    <th className="py-3 px-4 text-right">Monto Vencido</th>
                    <th className="py-3 px-4 text-center">Estatus</th>
                    <th className="py-3 px-4 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {delinquentCredits.map((ct) => {
                    const client = clients.find(c => c.id === ct.clienteId);
                    return (
                      <tr key={ct.id} className="hover:bg-red-50/30">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {ct.folio}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{client?.nombreCompleto || 'Desconocido'}</div>
                          <div className="text-[11px] text-slate-500">{client?.giroNegocio} • Tel: {client?.telefono}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          <div className="font-semibold">{client?.aval.nombreCompleto}</div>
                          <div className="text-[11px] text-slate-500">Tel: {client?.aval.telefono}</div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          ${ct.saldoPendiente.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-black text-[#C42326]">
                          ${ct.saldoVencido.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-900">
                            Cobranza Extrajudicial
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {client && (
                            <button
                              onClick={() => onViewContract(ct, client)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs transition cursor-pointer"
                            >
                              Ver Contrato
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {delinquentCredits.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No hay créditos en mora o atraso en esta sucursal.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
