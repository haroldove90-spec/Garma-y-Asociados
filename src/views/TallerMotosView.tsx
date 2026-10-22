import React, { useState } from 'react';
import { MachineryOrder, Branch } from '../types';
import { HeavyMachineryLogo } from '../components/Logos';
import { 
  Wrench, 
  Construction, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  DollarSign, 
  Search,
  Check,
  History,
  Gauge,
  MapPin,
  HardHat,
  Filter
} from 'lucide-react';

interface TallerMotosViewProps {
  activeModule: string;
  motoOrders: MachineryOrder[];
  branches: Branch[];
  activeBranchId: string;
  onOrderAdded: (order: MachineryOrder) => void;
}

export const TallerMotosView: React.FC<TallerMotosViewProps> = ({
  activeModule,
  motoOrders,
  branches,
  activeBranchId,
  onOrderAdded
}) => {
  // Safe active module fallback
  const currentModule = ['taller', 'flotilla', 'auditoria'].includes(activeModule) ? activeModule : 'taller';

  const [showAddModal, setShowAddModal] = useState(false);
  const [numEconomico, setNumEconomico] = useState('MQ-');
  const [tipoEquipo, setTipoEquipo] = useState('Excavadora de Orugas');
  const [modelo, setModelo] = useState('');
  const [serie, setSerie] = useState('');
  const [operadorObra, setOperadorObra] = useState('');
  const [ubicacionObra, setUbicacionObra] = useState('Patio Central Garma');
  const [servicio, setServicio] = useState('');
  const [horometro, setHorometro] = useState(1500);
  const [costo, setCosto] = useState(4500);
  const [mecanico, setMecanico] = useState('Ing. Javier Peña (Jefe de Taller)');
  const [tipoServicio, setTipoServicio] = useState('Preventivo por Horas');

  const filteredOrders = motoOrders.filter(
    o => activeBranchId === 'todas' || o.sucursalId === activeBranchId
  );

  const totalGastoTaller = filteredOrders.reduce((acc, o) => acc + o.costoEstimado, 0);
  const equiposEnRenta = filteredOrders.filter(o => o.estatus === 'En Renta en Obra').length;
  const equiposEnMantenimiento = filteredOrders.filter(o => o.estatus === 'En Mantenimiento').length;
  const equiposEnPatio = filteredOrders.filter(o => o.estatus === 'En Patio').length;

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numEconomico || !modelo) return;

    const newOrder: MachineryOrder = {
      id: `maq-${Date.now()}`,
      folio: `MAQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      numeroEconomico: numEconomico.toUpperCase(),
      tipoEquipo,
      modelo,
      serie: serie || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      operadorAsignado: operadorObra || 'Disponible para Renta',
      sucursalId: activeBranchId === 'todas' ? 'suc-centro' : activeBranchId,
      servicioSolicitado: servicio || 'Mantenimiento Preventivo e Inspección General',
      fechaIngreso: new Date().toISOString().split('T')[0],
      horometro: Number(horometro),
      costoEstimado: Number(costo),
      estatus: 'En Mantenimiento',
      mecanicoResponsable: mecanico,
      ubicacionObra: ubicacionObra || 'Patio Central Garma'
    };

    onOrderAdded(newOrder);
    setShowAddModal(false);
    setNumEconomico('MQ-');
    setModelo('');
    setSerie('');
    setServicio('');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header Banner - Renta y Mantenimiento de Maquinaria Pesada */}
      <div className="bg-gradient-to-r from-slate-950 via-zinc-900 to-black p-5 sm:p-7 rounded-3xl border border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl">
        <div className="flex items-center gap-4 sm:gap-5 w-full md:w-auto">
          <div className="shrink-0 bg-slate-900 p-2.5 rounded-2xl border border-[#C42326]">
            <HeavyMachineryLogo className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-[#C42326] text-white uppercase tracking-wider mb-1.5">
              Garma Heavy Machinery Service
            </div>
            <h2 className="text-lg sm:text-2xl font-black tracking-tight">
              Taller y Parque de Maquinaria Pesada
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-xl">
              Control técnico de excavadoras, retroexcavadoras, motoniveladoras, horómetro, mantenimiento preventivo y disponibilidad de equipos para renta en obra.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-[#F07D08] hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg transition active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-black stroke-[3]" />
          <span>Ingresar Maquinaria a Servicio</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">Total en Parque</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-0.5 block">{filteredOrders.length}</span>
          <span className="text-[11px] text-slate-500 mt-1 block">Unidades pesadas registradas</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 block">En Renta en Obra</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700 font-mono mt-0.5 block">{equiposEnRenta}</span>
          <span className="text-[11px] text-emerald-600 mt-1 block">Operando en frentes de obra</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 block">En Mantenimiento</span>
          <span className="text-xl sm:text-2xl font-black text-[#F07D08] font-mono mt-0.5 block">{equiposEnMantenimiento}</span>
          <span className="text-[11px] text-amber-600 mt-1 block">En bahía de servicio técnico</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">Gasto Mantenimiento</span>
          <span className="text-xl sm:text-2xl font-black text-[#C42326] font-mono mt-0.5 block">
            ${totalGastoTaller.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Inversión en refacciones y servicio</span>
        </div>
      </div>

      {/* MODULE 1: MANTENIMIENTO MAQUINARIA (Órdenes de servicio activas) */}
      {currentModule === 'taller' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#C42326]" />
              <span>Órdenes de Servicio Mecánico e Hidráulico en Taller</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">{filteredOrders.length} máquinas en control</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-900 text-white rounded font-mono font-bold text-xs tracking-wider">
                          {order.numeroEconomico || order.placa}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-400">{order.folio}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1.5">{order.modelo}</h4>
                      <p className="text-xs font-semibold text-[#F07D08]">{order.tipoEquipo}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                      order.estatus === 'En Renta en Obra'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : order.estatus === 'En Patio'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : order.estatus === 'En Mantenimiento'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-red-100 text-red-900 border border-red-300'
                    }`}>
                      {order.estatus}
                    </span>
                  </div>

                  {/* Machine Specifications Grid */}
                  <div className="mt-3.5 text-xs space-y-1.5 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-slate-400" />
                        <span>Horómetro de Operación:</span>
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {order.horometro ? `${order.horometro.toLocaleString()} Horas` : `${(order.kilometraje || 1500).toLocaleString()} Horas`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Ubicación / Frente:</span>
                      </span>
                      <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]">
                        {order.ubicacionObra || 'Patio Central'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 flex items-center gap-1">
                        <HardHat className="w-3.5 h-3.5 text-slate-400" />
                        <span>Asignado a:</span>
                      </span>
                      <span className="font-medium text-slate-800 text-right truncate max-w-[200px]">
                        {order.operadorAsignado || order.cobradorAsignado || 'En Espera de Asignación'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Jefe de Taller:</span>
                      <span className="text-slate-700">{order.mecanicoResponsable}</span>
                    </div>
                  </div>

                  {/* Work Requested Details */}
                  <div className="mt-3 text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block mb-1">Trabajo Técnico y Refacciones:</span>
                    <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60">
                      {order.servicioSolicitado}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Costo Refacciones y Servicio</span>
                    <span className="font-bold font-mono text-slate-900 text-sm">
                      ${order.costoEstimado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Fecha Registro</span>
                    <span className="text-xs font-mono font-medium text-slate-700">{order.fechaIngreso}</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                <Construction className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-700">No hay órdenes de servicio de maquinaria registradas.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULE 2: PARQUE DE MAQUINARIA PESADA PARA RENTA */}
      {currentModule === 'flotilla' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Construction className="w-5 h-5 text-[#F07D08]" />
                <span>Inventario y Disponibilidad del Parque de Maquinaria Pesada</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Control de número económico, serie, horómetro de operación y ubicación en frentes de obra o patios
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 bg-[#C42326] hover:bg-[#a51c1f] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              + Ingresar Máquina a Servicio
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b">
                <tr>
                  <th className="py-3 px-4">No. Económico</th>
                  <th className="py-3 px-4">Equipo / Tipo</th>
                  <th className="py-3 px-4">Modelo y Serie</th>
                  <th className="py-3 px-4">Frente de Obra / Ubicación</th>
                  <th className="py-3 px-4 text-right">Horómetro</th>
                  <th className="py-3 px-4 text-center">Estatus Operativo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                        {o.numeroEconomico || o.placa}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {o.tipoEquipo}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div>{o.modelo}</div>
                      <span className="text-[10px] font-mono text-slate-400">{o.serie || 'S/N'}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[220px]">{o.ubicacionObra || 'Patio Central'}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{o.operadorAsignado || 'Sin cliente asignado'}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {o.horometro ? `${o.horometro.toLocaleString()} hrs` : `${(o.kilometraje || 1500).toLocaleString()} hrs`}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        o.estatus === 'En Renta en Obra'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : o.estatus === 'En Patio'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : o.estatus === 'En Mantenimiento'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-red-100 text-red-900 border border-red-300'
                      }`}>
                        {o.estatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULE 3: HISTORIAL DE SERVICIOS Y REFACCIONES */}
      {currentModule === 'auditoria' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-[#C42326]" />
                <span>Bitácora de Servicios Técnicos y Cambio de Componentes</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Registro histórico de mantenimientos por horómetro, cambio de orugas, mangueras y filtros
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Inversión Total en Flotilla</span>
              <span className="text-base font-bold text-[#C42326] font-mono">
                ${totalGastoTaller.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="p-4 divide-y divide-slate-100">
            {filteredOrders.map((o) => (
              <div key={o.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-900 text-white rounded">
                      {o.numeroEconomico || o.placa}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{o.modelo}</span>
                    <span className="text-xs text-slate-400 font-mono">• {o.folio}</span>
                  </div>
                  <p className="text-xs text-slate-600">{o.servicioSolicitado}</p>
                  <div className="text-[11px] text-slate-500 flex items-center gap-3">
                    <span>Mecánico: <strong>{o.mecanicoResponsable}</strong></span>
                    <span>•</span>
                    <span>Horómetro: <strong>{o.horometro || o.kilometraje} hrs</strong></span>
                    <span>•</span>
                    <span>Fecha: {o.fechaIngreso}</span>
                  </div>
                </div>

                <div className="text-right sm:text-right shrink-0">
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    ${o.costoEstimado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="block text-[10px] text-emerald-700 font-semibold">✓ Dictamen Aprobado</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL INGRESO MAQUINARIA A SERVICIO */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Construction className="w-5 h-5 text-[#F07D08]" />
                <h3 className="font-bold text-base">Registrar Maquinaria a Servicio</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">No. Económico *</label>
                  <input
                    type="text"
                    required
                    value={numEconomico}
                    onChange={(e) => setNumEconomico(e.target.value)}
                    placeholder="Ej. MQ-EX01"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase font-bold focus:ring-2 focus:ring-[#C42326] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tipo de Maquinaria *</label>
                  <select
                    value={tipoEquipo}
                    onChange={(e) => setTipoEquipo(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#C42326] focus:outline-none"
                  >
                    <option value="Excavadora de Orugas">Excavadora de Orugas</option>
                    <option value="Retroexcavadora 4x4">Retroexcavadora 4x4</option>
                    <option value="Motoniveladora">Motoniveladora</option>
                    <option value="Rodillo Compactador">Rodillo Compactador</option>
                    <option value="Cargador Frontal">Cargador Frontal</option>
                    <option value="Minicargador">Minicargador Bobcat</option>
                    <option value="Tractor Orugas D6">Tractor de Orugas D6</option>
                    <option value="Camión Volteo 14m³">Camión Volteo 14m³</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Marca y Modelo *</label>
                  <input
                    type="text"
                    required
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    placeholder="Ej. Caterpillar 320D"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#C42326] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Número de Serie</label>
                  <input
                    type="text"
                    value={serie}
                    onChange={(e) => setSerie(e.target.value)}
                    placeholder="Ej. CAT0320D88910"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-[#C42326] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Horómetro Actual (Horas) *</label>
                  <input
                    type="number"
                    required
                    value={horometro}
                    onChange={(e) => setHorometro(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-[#C42326] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Costo Estimado ($) *</label>
                  <input
                    type="number"
                    required
                    value={costo}
                    onChange={(e) => setCosto(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold focus:ring-2 focus:ring-[#C42326] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Ubicación / Frente de Obra Actual</label>
                <input
                  type="text"
                  value={ubicacionObra}
                  onChange={(e) => setUbicacionObra(e.target.value)}
                  placeholder="Ej. Tramo Carretero Sur Km 14 o Patio Matriz"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#C42326] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Servicio o Reparación Requerida *</label>
                <textarea
                  required
                  rows={2}
                  value={servicio}
                  onChange={(e) => setServicio(e.target.value)}
                  placeholder="Ej. Servicio de 2,500 hrs: cambio de filtros, aceite hidráulico ISO 46 y ajuste de zapatas..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-[#C42326] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C42326] hover:bg-[#a51c1f] text-white font-bold shadow-md cursor-pointer transition active:scale-95"
                >
                  Crear Orden de Servicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const MaquinariaPesadaView = TallerMotosView;
