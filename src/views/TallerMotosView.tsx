import React, { useState } from 'react';
import { MotorcycleOrder, Branch } from '../types';
import { MotoWorkshopLogo } from '../components/Logos';
import { storageService } from '../services/storage';
import { 
  Wrench, 
  Bike, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  DollarSign, 
  Search,
  Check
} from 'lucide-react';

interface TallerMotosViewProps {
  activeModule: string;
  motoOrders: MotorcycleOrder[];
  branches: Branch[];
  activeBranchId: string;
  onOrderAdded: (order: MotorcycleOrder) => void;
}

export const TallerMotosView: React.FC<TallerMotosViewProps> = ({
  activeModule,
  motoOrders,
  branches,
  activeBranchId,
  onOrderAdded
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cobrador, setCobrador] = useState('');
  const [servicio, setServicio] = useState('');
  const [kilometraje, setKilometraje] = useState(30000);
  const [costo, setCosto] = useState(750);
  const [mecanico, setMecanico] = useState('Mtro. Javier Peña');

  const filteredOrders = motoOrders.filter(
    o => activeBranchId === 'todas' || o.sucursalId === activeBranchId
  );

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placa || !modelo) return;

    const newOrder: MotorcycleOrder = {
      id: `mot-${Date.now()}`,
      folio: `TALL-2026-${Math.floor(100 + Math.random() * 900)}`,
      placa: placa.toUpperCase(),
      modelo,
      cobradorAsignado: cobrador || 'Cobrador de Campo',
      sucursalId: activeBranchId === 'todas' ? 'suc-centro' : activeBranchId,
      servicioSolicitado: servicio || 'Mantenimiento Preventivo y Cambio de Aceite',
      fechaIngreso: new Date().toISOString().split('T')[0],
      kilometraje: Number(kilometraje),
      costoEstimado: Number(costo),
      estatus: 'En Taller',
      mecanicoResponsable: mecanico
    };

    onOrderAdded(newOrder);
    setShowAddModal(false);
    setPlaca('');
    setModelo('');
    setServicio('');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-zinc-900 to-black p-6 rounded-3xl border border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="shrink-0 bg-black/40 p-2 rounded-2xl border border-[#C42326]">
            <MotoWorkshopLogo className="w-20 h-20" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C42326] text-white uppercase tracking-wider mb-1">
              Garma Moto Service
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Taller Central de Motos y Flotilla de Cobranza
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Mantenimiento mecánico y soporte de unidades para cobradores y asesores de campo
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#F07D08] hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg transition active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Ingresar Moto a Servicio</span>
        </button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-400 block">{order.folio}</span>
                  <h4 className="text-base font-bold text-slate-900">{order.modelo}</h4>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  order.estatus === 'Reparada'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {order.estatus}
                </span>
              </div>

              <div className="mt-3 text-xs space-y-1.5 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Placas:</span>
                  <span className="font-mono font-bold text-slate-800">{order.placa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Asignada a:</span>
                  <span className="font-semibold text-slate-800">{order.cobradorAsignado}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kilometraje:</span>
                  <span className="font-mono text-slate-800">{order.kilometraje.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mecánico:</span>
                  <span className="text-slate-800">{order.mecanicoResponsable}</span>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-0.5">Trabajo Realizado:</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">{order.servicioSolicitado}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Costo Refacciones</span>
                <span className="font-bold font-mono text-slate-900">${order.costoEstimado.toFixed(2)}</span>
              </div>
              <span className="text-[10px] text-slate-400">{order.fechaIngreso}</span>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <Bike className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No hay órdenes de servicio en taller registradas.</p>
          </div>
        )}
      </div>

      {/* MODAL INGRESO MOTO */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#F07D08]" />
              <span>Registrar Orden de Servicio Mecánico</span>
            </h3>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Modelo de la Moto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Honda Cargo 150cc"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Placas de Circulación *</label>
                <input
                  type="text"
                  required
                  placeholder="CDMX-8890"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Cobrador Asignado</label>
                <input
                  type="text"
                  placeholder="Nombre del cobrador de ruta"
                  value={cobrador}
                  onChange={(e) => setCobrador(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Diagnóstico / Servicio Requerido</label>
                <textarea
                  rows={2}
                  placeholder="Afinación mayor, cambio de cadena, balatas o llantas..."
                  value={servicio}
                  onChange={(e) => setServicio(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Kilometraje</label>
                  <input
                    type="number"
                    value={kilometraje}
                    onChange={(e) => setKilometraje(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Costo Estimado ($)</label>
                  <input
                    type="number"
                    value={costo}
                    onChange={(e) => setCosto(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C42326] text-white rounded-lg font-bold cursor-pointer"
                >
                  Generar Orden Taller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
