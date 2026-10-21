import React, { useState, useMemo } from 'react';
import { 
  Client, 
  LoanContract, 
  PaymentTransaction, 
  Branch, 
  PaymentDay,
  PaymentFrequency 
} from '../types';
import { storageService } from '../services/storage';
import { 
  DollarSign, 
  Search, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  Receipt, 
  Calendar, 
  MapPin, 
  Phone, 
  Briefcase, 
  ShieldAlert, 
  ArrowRight, 
  Filter,
  Check,
  CreditCard,
  Building2,
  Clock
} from 'lucide-react';

interface CobradorViewProps {
  activeModule: string;
  clients: Client[];
  contracts: LoanContract[];
  transactions: PaymentTransaction[];
  branches: Branch[];
  activeBranchId: string;
  onPaymentRegistered: (tx: PaymentTransaction) => void;
  onClientAdded: (client: Client) => void;
  onViewReceipt: (tx: PaymentTransaction) => void;
}

const DAYS_OF_WEEK: PaymentDay[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const CobradorView: React.FC<CobradorViewProps> = ({
  activeModule,
  clients,
  contracts,
  transactions,
  branches,
  activeBranchId,
  onPaymentRegistered,
  onClientAdded,
  onViewReceipt
}) => {
  // Safe active module fallback
  const currentModule = ['cobranza', 'clientes', 'saldos'].includes(activeModule) ? activeModule : 'cobranza';

  // Day filter for today's collection agenda
  const [selectedDay, setSelectedDay] = useState<PaymentDay>('Miércoles');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Payment capture modal state
  const [payingContract, setPayingContract] = useState<{ contract: LoanContract; client: Client } | null>(null);
  const [payAmount, setPayAmount] = useState<string>('');
  const [payMethod, setPayMethod] = useState<'Efectivo' | 'Transferencia' | 'Terminal / Tarjeta'>('Efectivo');
  const [payNotes, setPayNotes] = useState('');

  // New Client Form state
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newNombre, setNewNombre] = useState('');
  const [newDireccion, setNewDireccion] = useState('');
  const [newTelefono, setNewTelefono] = useState('');
  const [newGiro, setNewGiro] = useState('');
  const [newDia, setNewDia] = useState<PaymentDay>('Miércoles');
  const [newSucursal, setNewSucursal] = useState(activeBranchId === 'todas' ? 'suc-centro' : activeBranchId);
  
  // Aval details
  const [newAvalNombre, setNewAvalNombre] = useState('');
  const [newAvalDireccion, setNewAvalDireccion] = useState('');
  const [newAvalTelefono, setNewAvalTelefono] = useState('');
  const [newAvalParentesco, setNewAvalParentesco] = useState('Familiar');

  // Quick Cross-Branch Credit Validation state
  const [validationAlert, setValidationAlert] = useState<{ status: 'clean' | 'blocked' | 'checking'; msg: string } | null>(null);

  // Filter clients by active branch (or all)
  const branchClients = useMemo(() => {
    return clients.filter(c => activeBranchId === 'todas' || c.sucursalId === activeBranchId);
  }, [clients, activeBranchId]);

  // Daily agenda items: clients with active loans scheduled for selectedDay
  const dailyAgenda = useMemo(() => {
    return branchClients
      .filter(c => c.diaAsignadoPago === selectedDay)
      .map(client => {
        const contract = contracts.find(ct => ct.clienteId === client.id && ct.estatus !== 'Liquidado');
        // Check if paid today
        const paidToday = transactions.some(t => t.clienteId === client.id && t.fecha.startsWith('2026-10-21'));
        return {
          client,
          contract,
          paidToday
        };
      })
      .filter(item => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          item.client.nombreCompleto.toLowerCase().includes(q) ||
          item.client.giroNegocio.toLowerCase().includes(q) ||
          item.client.direccion.toLowerCase().includes(q)
        );
      });
  }, [branchClients, contracts, transactions, selectedDay, searchQuery]);

  // Statistics for today's collection
  const totalScheduledToday = dailyAgenda.length;
  const totalPaidToday = dailyAgenda.filter(i => i.paidToday).length;
  const totalPendingToday = totalScheduledToday - totalPaidToday;
  const totalAmountCollectedToday = transactions
    .filter(t => (activeBranchId === 'todas' || t.sucursalId === activeBranchId) && t.fecha.startsWith('2026-10-21'))
    .reduce((acc, curr) => acc + curr.montoPagado, 0);

  // Validate titular and aval in real-time
  const checkCrossValidation = (titularName: string, avalName: string) => {
    if (!titularName && !avalName) {
      setValidationAlert(null);
      return;
    }
    // Check if titular or aval has overdue loan in any other branch
    const delinquentContracts = contracts.filter(c => c.estatus === 'En Mora' || c.saldoVencido > 0);
    const delinquentClients = clients.filter(c => delinquentContracts.some(ct => ct.clienteId === c.id));

    const titularDelinquent = delinquentClients.find(c => c.nombreCompleto.toLowerCase() === titularName.toLowerCase().trim());
    const avalDelinquent = delinquentClients.find(c => 
      c.nombreCompleto.toLowerCase() === avalName.toLowerCase().trim() ||
      c.aval.nombreCompleto.toLowerCase() === avalName.toLowerCase().trim()
    );

    if (titularDelinquent) {
      setValidationAlert({
        status: 'blocked',
        msg: `ALERTA DE RIESGO: El titular ${titularDelinquent.nombreCompleto} tiene atraso activo en ${titularDelinquent.sucursalId}. No autorizado para nuevo crédito.`
      });
      return;
    }

    if (avalDelinquent) {
      setValidationAlert({
        status: 'blocked',
        msg: `ALERTA DE RIESGO: El aval propuesto (${avalName}) se encuentra registrado con mora o incumplimiento en otra sucursal.`
      });
      return;
    }

    setValidationAlert({
      status: 'clean',
      msg: '✓ Validación exitosa: Ni el titular ni el aval registran adeudos morosos en la red institucional.'
    });
  };

  // Open payment capture modal
  const handleOpenPay = (client: Client, contract: LoanContract) => {
    setPayingContract({ client, contract });
    setPayAmount(contract.cuotaPeriodica.toFixed(2));
    setPayMethod('Efectivo');
    setPayNotes('');
  };

  // Submit payment
  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingContract) return;

    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Ingrese un monto válido.');
      return;
    }

    const { client, contract } = payingContract;
    const newSaldo = Math.max(0, contract.saldoPendiente - amount);

    // Breakdown distribution (vencido/mora -> seguro -> interés -> capital -> ahorro)
    const seguroPart = Math.min(amount * 0.05, 50);
    const interesPart = Math.min((amount - seguroPart) * 0.15, 120);
    const ahorroPart = Math.min(amount * 0.05, 50);
    const capitalPart = Math.max(0, amount - seguroPart - interesPart - ahorroPart);

    const folioNum = Math.floor(1000 + Math.random() * 9000);
    const newTx: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      folio: `REC-2026-${folioNum}`,
      contratoId: contract.id,
      clienteId: client.id,
      clienteNombre: client.nombreCompleto,
      montoPagado: amount,
      fecha: '2026-10-21 ' + new Date().toTimeString().substring(0, 5),
      metodoPago: payMethod,
      sucursalId: client.sucursalId,
      cobradorNombre: 'Alejandro Ruiz (Cobrador)',
      desglose: {
        moraCuotaVencida: contract.saldoVencido > 0 ? Math.min(amount, contract.saldoVencido) : 0,
        seguro: seguroPart,
        interes: interesPart,
        capital: capitalPart,
        ahorro: ahorroPart
      },
      saldoAnterior: contract.saldoPendiente,
      nuevoSaldo: newSaldo,
      notas: payNotes || 'Cobro regular capturado en campo'
    };

    onPaymentRegistered(newTx);
    setPayingContract(null);
    // Show digital receipt immediately
    onViewReceipt(newTx);
  };

  // Handle client registration
  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNombre || !newTelefono || !newDireccion || !newAvalNombre) {
      alert('Por favor complete los campos obligatorios del titular y del aval.');
      return;
    }

    if (validationAlert?.status === 'blocked') {
      alert('No se puede registrar al cliente debido a bloqueos de riesgo o mora.');
      return;
    }

    const newClient: Client = {
      id: `cli-${Date.now()}`,
      nombreCompleto: newNombre.trim(),
      telefono: newTelefono.trim(),
      direccion: newDireccion.trim(),
      giroNegocio: newGiro.trim() || 'Comercio General',
      diaAsignadoPago: newDia,
      sucursalId: newSucursal,
      fechaRegistro: new Date().toISOString().split('T')[0],
      aval: {
        id: `ava-${Date.now()}`,
        nombreCompleto: newAvalNombre.trim(),
        telefono: newAvalTelefono.trim(),
        direccion: newAvalDireccion.trim(),
        parentesco: newAvalParentesco.trim()
      }
    };

    onClientAdded(newClient);
    setShowAddClientModal(false);
    // Reset form
    setNewNombre('');
    setNewTelefono('');
    setNewDireccion('');
    setNewGiro('');
    setNewAvalNombre('');
    setNewAvalTelefono('');
    setNewAvalDireccion('');
    setValidationAlert(null);
    alert(`Cliente ${newClient.nombreCompleto} y Aval ${newClient.aval.nombreCompleto} registrados correctamente.`);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Module Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#C42326] rounded-full inline-block" />
            {currentModule === 'cobranza' && 'Ruta y Cobranza Diaria'}
            {currentModule === 'clientes' && 'Directorio de Clientes y Avales'}
            {currentModule === 'saldos' && 'Consulta de Saldos y Cuentas'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Captura ágil en campo o ventanilla • Garma y Asociados
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddClientModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#C42326] hover:bg-[#a51c1f] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrar Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Cobros Programados Hoy
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">{totalScheduledToday}</span>
            <span className="text-xs text-slate-500">cuotas</span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Cobrados / Al Corriente
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 font-mono">{totalPaidToday}</span>
            <span className="text-xs text-emerald-700">pagados</span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            Pagos Faltantes del Día
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#F07D08] font-mono">{totalPendingToday}</span>
            <span className="text-xs text-amber-700">pendientes</span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Recaudado en Jornada
          </span>
          <div className="mt-1">
            <span className="text-2xl font-black text-[#C42326] font-mono">
              ${totalAmountCollectedToday.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: COBRANZA DIARIA (Ruta del Día) */}
      {currentModule === 'cobranza' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Day Selector Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#F07D08]" /> Día:
              </span>
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    selectedDay === day
                      ? 'bg-[#C42326] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por cliente, giro o dirección..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#C42326] focus:outline-none"
              />
            </div>
          </div>

          {/* Agenda List / Cards */}
          <div className="p-4">
            {dailyAgenda.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Calendar className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">
                  No hay cobros programados para {selectedDay} con los filtros seleccionados.
                </p>
                <p className="text-xs text-slate-400">
                  Seleccione otro día de la semana o registre nuevos clientes.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {dailyAgenda.map(({ client, contract, paidToday }) => {
                  const hasOverdue = (contract?.saldoVencido || 0) > 0;
                  return (
                    <div
                      key={client.id}
                      className={`relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-150 ${
                        paidToday
                          ? 'bg-emerald-50/30 border-emerald-200'
                          : hasOverdue
                          ? 'bg-red-50/30 border-red-200'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      {/* Top Header Card */}
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">
                              {client.giroNegocio}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 leading-snug">
                              {client.nombreCompleto}
                            </h4>
                          </div>
                          {paidToday ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3" /> Cobrado Hoy
                            </span>
                          ) : hasOverdue ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-[#C42326]">
                              <AlertCircle className="w-3 h-3" /> Con Mora
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                              <Clock className="w-3 h-3" /> Pago Faltante
                            </span>
                          )}
                        </div>

                        {/* Location and Phone */}
                        <div className="mt-2 text-xs text-slate-600 space-y-1">
                          <p className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{client.direccion}</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a href={`tel:${client.telefono}`} className="text-blue-600 hover:underline font-mono">
                              {client.telefono}
                            </a>
                          </p>
                        </div>

                        {/* Aval reference */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700">Aval:</span> {client.aval.nombreCompleto} ({client.aval.parentesco}) • Tel: {client.aval.telefono}
                        </div>
                      </div>

                      {/* Financial info & Action */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Cuota Esperada
                          </span>
                          <span className="text-base font-black text-slate-900 font-mono">
                            ${(contract?.cuotaPeriodica || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </span>
                          {contract && (
                            <span className="text-[10px] text-slate-500 block font-mono">
                              Saldo Restante: ${contract.saldoPendiente.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
                            </span>
                          )}
                        </div>

                        {contract && !paidToday ? (
                          <button
                            onClick={() => handleOpenPay(client, contract)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-[#C42326] hover:bg-[#a51c1f] text-white text-xs font-bold rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Cobrar Cuota</span>
                          </button>
                        ) : paidToday ? (
                          <button
                            onClick={() => {
                              const tx = transactions.find(t => t.clienteId === client.id);
                              if (tx) onViewReceipt(tx);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                          >
                            <Receipt className="w-3.5 h-3.5 text-slate-500" />
                            <span>Ver Recibo</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Sin crédito activo</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION: CONSULTA DE SALDO POR CLIENTE */}
      {currentModule === 'saldos' && (
        <div className="space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#C42326]" />
                  <span>Consulta de Saldos y Cuentas por Cliente</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Desglose de cuota esperada, abonos aplicados, pago faltante del día y saldo vencido
                </p>
              </div>

              {/* Instant Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar titular, folio o teléfono..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#C42326] focus:outline-none"
                />
              </div>
            </div>

            {/* Balances Cards Grid */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {branchClients
                .filter(c => {
                  if (!searchQuery) return true;
                  const q = searchQuery.toLowerCase();
                  return (
                    c.nombreCompleto.toLowerCase().includes(q) ||
                    c.telefono.includes(q) ||
                    c.giroNegocio.toLowerCase().includes(q)
                  );
                })
                .map(client => {
                  const contract = contracts.find(ct => ct.clienteId === client.id && ct.estatus !== 'Liquidado');
                  const clientTx = transactions.filter(t => t.clienteId === client.id);
                  const abonosRealizados = clientTx.reduce((acc, t) => acc + t.montoPagado, 0);
                  const paidToday = clientTx.some(t => t.fecha.startsWith('2026-10-21'));
                  const cuotaEsperada = contract?.cuotaPeriodica || 0;
                  const pagoFaltanteHoy = paidToday ? 0 : cuotaEsperada;
                  const saldoVencido = contract?.saldoVencido || 0;
                  const saldoInsoluto = contract?.saldoPendiente || 0;

                  return (
                    <div
                      key={client.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-xs flex flex-col justify-between space-y-3"
                    >
                      {/* Top Titular & Status */}
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-slate-400">{client.giroNegocio}</span>
                            <h4 className="text-sm font-bold text-slate-900">{client.nombreCompleto}</h4>
                            <p className="text-[11px] text-slate-500">Tel: {client.telefono} • Cobro: {client.diaAsignadoPago}</p>
                          </div>
                          {contract ? (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              saldoVencido > 0 
                                ? 'bg-red-100 text-red-900' 
                                : paidToday 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-amber-100 text-amber-900'
                            }`}>
                              {saldoVencido > 0 ? 'Con Mora' : (paidToday ? 'Al Corriente' : 'Pago Faltante')}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                              Sin Crédito
                            </span>
                          )}
                        </div>

                        {/* Balance Breakdown Grid */}
                        {contract ? (
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <div>
                              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Cuota Esperada:</span>
                              <span className="font-bold text-slate-900 font-mono">${cuotaEsperada.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Abonos Totales:</span>
                              <span className="font-bold text-emerald-700 font-mono">${abonosRealizados.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Faltante Hoy:</span>
                              <span className={`font-bold font-mono ${pagoFaltanteHoy > 0 ? 'text-[#F07D08]' : 'text-slate-400'}`}>
                                ${pagoFaltanteHoy.toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Saldo Vencido (Mora):</span>
                              <span className={`font-bold font-mono ${saldoVencido > 0 ? 'text-[#C42326]' : 'text-slate-400'}`}>
                                ${saldoVencido.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ) : null}

                        {contract && (
                          <div className="mt-2 text-xs flex justify-between items-center text-slate-600 font-medium pt-1">
                            <span>Saldo Insoluto Restante:</span>
                            <span className="font-mono font-black text-[#C42326] text-sm">${saldoInsoluto.toFixed(2)}</span>
                          </div>
                        )}
                      </div>

                      {/* Action */}
                      <div className="pt-2 border-t flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {contract ? `Contrato: ${contract.folio}` : 'Expediente libre'}
                        </span>
                        {contract && !paidToday ? (
                          <button
                            onClick={() => handleOpenPay(client, contract)}
                            className="px-3 py-1.5 bg-[#C42326] hover:bg-[#a51c1f] text-white text-xs font-bold rounded-lg transition active:scale-95 cursor-pointer"
                          >
                            Cobrar
                          </button>
                        ) : clientTx.length > 0 ? (
                          <button
                            onClick={() => onViewReceipt(clientTx[0])}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                          >
                            Último Recibo
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CLIENTES Y AVALES DIRECTORY TABLE */}
      {currentModule === 'clientes' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-900">
              Directorio General de Titulares y Avales Registrados
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Total: {branchClients.length} clientes
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b">
                <tr>
                  <th className="py-3 px-4">Titular</th>
                  <th className="py-3 px-4">Teléfono & Dirección</th>
                  <th className="py-3 px-4">Giro Comercial</th>
                  <th className="py-3 px-4">Día de Cobro</th>
                  <th className="py-3 px-4">Aval de Respaldo</th>
                  <th className="py-3 px-4">Sucursal</th>
                  <th className="py-3 px-4 text-center">Estatus Crédito</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {branchClients.map((client) => {
                  const contract = contracts.find(c => c.clienteId === client.id && c.estatus !== 'Liquidado');
                  return (
                    <tr key={client.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {client.nombreCompleto}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div>{client.telefono}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{client.direccion}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {client.giroNegocio}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#C42326]">
                        {client.diaAsignadoPago}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <div className="font-semibold">{client.aval.nombreCompleto}</div>
                        <div className="text-[11px] text-slate-500">
                          {client.aval.parentesco} • {client.aval.telefono}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {branches.find(b => b.id === client.sucursalId)?.nombre || client.sucursalId}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {contract ? (
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            contract.estatus === 'En Mora'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {contract.estatus} (${contract.saldoPendiente.toFixed(0)})
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Sin adeudo activo</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: CAPTURA RÁPIDA DE COBRO EN CAMPO */}
      {payingContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-[#C42326] px-5 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-200">
                  Módulo de Cobranza en Campo
                </span>
                <h3 className="text-base font-bold leading-tight">Captura de Pago Inmediato</h3>
              </div>
              <button
                onClick={() => setPayingContract(null)}
                className="text-white/80 hover:text-white text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmPayment} className="p-6 space-y-4">
              {/* Client Info Banner */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Titular:</span>
                  <span className="font-bold text-slate-900">{payingContract.client.nombreCompleto}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contrato Folio:</span>
                  <span className="font-mono font-semibold text-slate-800">{payingContract.contract.folio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cuota Programada:</span>
                  <span className="font-mono font-bold text-slate-900">${payingContract.contract.cuotaPeriodica.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Saldo Pendiente:</span>
                  <span className="font-mono text-[#C42326] font-bold">${payingContract.contract.saldoPendiente.toFixed(2)}</span>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Monto Recibido en Efectivo ($ MXN):
                </label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-lg font-bold font-mono bg-white border-2 border-slate-300 focus:border-[#C42326] rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Método de Pago:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Efectivo', 'Transferencia', 'Terminal / Tarjeta'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayMethod(m)}
                      className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition cursor-pointer ${
                        payMethod === m
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Observaciones de la visita / Referencia:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Cobrado puntual en tienda"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#C42326] focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPayingContract(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#C42326] hover:bg-[#a51c1f] text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 cursor-pointer"
                >
                  Confirmar y Generar Recibo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ALTA DE CLIENTE Y AVAL CON VALIDACIÓN CRUZADA */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#F07D08] uppercase tracking-wider">
                  Fase 1: Prospección y Registro en Ventanilla
                </span>
                <h3 className="text-base font-bold">Alta y Validación de Cliente & Aval</h3>
              </div>
              <button
                onClick={() => setShowAddClientModal(false)}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
              {/* Validation Status Box */}
              {validationAlert && (
                <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                  validationAlert.status === 'blocked'
                    ? 'bg-red-50 border-red-300 text-red-900'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                }`}>
                  {validationAlert.status === 'blocked' ? (
                    <ShieldAlert className="w-5 h-5 text-[#C42326] shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div className="text-xs font-semibold leading-relaxed">
                    {validationAlert.msg}
                  </div>
                </div>
              )}

              {/* Titular Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C42326] flex items-center gap-1.5 border-b pb-1">
                  <span>1. Datos del Titular</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Juan Carlos López"
                      value={newNombre}
                      onChange={(e) => {
                        setNewNombre(e.target.value);
                        checkCrossValidation(e.target.value, newAvalNombre);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C42326] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Teléfono Móvil *</label>
                    <input
                      type="tel"
                      required
                      placeholder="55-1234-5678"
                      value={newTelefono}
                      onChange={(e) => setNewTelefono(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C42326] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Dirección Completa *</label>
                    <input
                      type="text"
                      required
                      placeholder="Calle, número, colonia y alcaldía"
                      value={newDireccion}
                      onChange={(e) => setNewDireccion(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C42326] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Giro de Negocio / Actividad *</label>
                    <input
                      type="text"
                      placeholder="Ej: Taller mecánico, Abarrotes, etc."
                      value={newGiro}
                      onChange={(e) => setNewGiro(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C42326] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Día Asignado de Pago *</label>
                    <select
                      value={newDia}
                      onChange={(e) => setNewDia(e.target.value as PaymentDay)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C42326] focus:outline-none font-semibold text-slate-900"
                    >
                      {DAYS_OF_WEEK.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Sucursal de Adscripción *</label>
                    <select
                      value={newSucursal}
                      onChange={(e) => setNewSucursal(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C42326] focus:outline-none font-semibold text-slate-900"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>{b.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Aval Section */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F07D08] flex items-center gap-1.5 border-b pb-1">
                  <span>2. Datos del Obligado Solidario (Aval)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Nombre Completo del Aval *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Rosa Morales Cruz"
                      value={newAvalNombre}
                      onChange={(e) => {
                        setNewAvalNombre(e.target.value);
                        checkCrossValidation(newNombre, e.target.value);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F07D08] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Parentesco con Titular *</label>
                    <input
                      type="text"
                      placeholder="Ej: Hermano, Esposa, Padre, Socio"
                      value={newAvalParentesco}
                      onChange={(e) => setNewAvalParentesco(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F07D08] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Dirección del Aval *</label>
                    <input
                      type="text"
                      required
                      placeholder="Dirección comprobable del aval"
                      value={newAvalDireccion}
                      onChange={(e) => setNewAvalDireccion(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F07D08] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Teléfono del Aval *</label>
                    <input
                      type="tel"
                      required
                      placeholder="55-9876-5432"
                      value={newAvalTelefono}
                      onChange={(e) => setNewAvalTelefono(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#F07D08] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={validationAlert?.status === 'blocked'}
                  className={`px-5 py-2 font-bold text-white rounded-lg transition shadow-md cursor-pointer ${
                    validationAlert?.status === 'blocked'
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-[#C42326] hover:bg-[#a51c1f] active:scale-95'
                  }`}
                >
                  Guardar y Habilitar Expediente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
