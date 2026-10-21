import React from 'react';
import { LoanContract, Client } from '../types';
import { GarmaLogo } from './Logos';
import { Printer, X, Download, ShieldCheck, FileCheck } from 'lucide-react';

interface ContractModalProps {
  contract: LoanContract;
  client: Client;
  onClose: () => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({
  contract,
  client,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 print-page">
        {/* Modal Controls - Hidden when printing */}
        <div className="no-print bg-slate-900 px-5 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FileCheck className="w-5 h-5 text-[#F07D08]" />
            <div>
              <h3 className="text-sm font-bold">Contrato Oficial de Microcrédito y Calendario de Pagos</h3>
              <p className="text-xs text-slate-400">Folio: {contract.folio} • {client.nombreCompleto}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#C42326] hover:bg-[#a51c1f] text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Contrato</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contract Document Body */}
        <div className="p-6 sm:p-10 text-slate-900 text-xs sm:text-sm space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-4">
            <div>
              <GarmaLogo className="h-10 sm:h-12 w-auto object-contain" />
              <p className="text-xs text-slate-500 font-medium mt-1">
                Garma y Asociados S.A. de C.V. • RFC: GAS180512-KM9
              </p>
            </div>
            <div className="text-right sm:text-right">
              <span className="inline-block px-3 py-1 bg-red-100 text-[#C42326] font-mono font-bold rounded text-xs border border-red-200">
                CONTRATO: {contract.folio}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Fecha de Aprobación: {contract.fechaAprobacion}</p>
              <p className="text-[11px] text-slate-500">Sucursal: {contract.sucursalId}</p>
            </div>
          </div>

          {/* Declarations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C42326] mb-2">
                1. Datos del Acreditado (Titular)
              </h4>
              <p className="font-semibold text-slate-900">{client.nombreCompleto}</p>
              <p className="text-slate-600 text-xs">Dirección: {client.direccion}</p>
              <p className="text-slate-600 text-xs">Teléfono: {client.telefono}</p>
              <p className="text-slate-600 text-xs">Giro Comercial: {client.giroNegocio}</p>
              <p className="text-slate-600 text-xs">Día Asignado de Cobranza: <strong>{contract.diaPago}</strong></p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F07D08] mb-2">
                2. Datos del Obligado Solidario (Aval)
              </h4>
              <p className="font-semibold text-slate-900">{client.aval.nombreCompleto}</p>
              <p className="text-slate-600 text-xs">Dirección: {client.aval.direccion}</p>
              <p className="text-slate-600 text-xs">Teléfono: {client.aval.telefono}</p>
              <p className="text-slate-600 text-xs">Parentesco con Titular: {client.aval.parentesco}</p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                ✓ Aval validado sin adeudos morosos en red Garma
              </p>
            </div>
          </div>

          {/* Financial Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
              3. Condiciones Financieras del Otorgamiento
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
              <div className="p-2 bg-slate-50 rounded">
                <span className="text-slate-500 text-[10px] uppercase block">Capital Autorizado</span>
                <span className="font-bold text-slate-900 text-base font-mono">
                  ${contract.montoSolicitado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <span className="text-slate-500 text-[10px] uppercase block">Plazo y Frecuencia</span>
                <span className="font-bold text-slate-900 text-base">
                  {contract.plazoSemanas} semanas ({contract.frecuencia})
                </span>
              </div>
              <div className="p-2 bg-amber-50 rounded border border-amber-200">
                <span className="text-amber-800 text-[10px] uppercase block">Cuota Periódica Fija</span>
                <span className="font-bold text-amber-900 text-base font-mono">
                  ${contract.cuotaPeriodica.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-2 bg-red-50 rounded border border-red-200">
                <span className="text-red-800 text-[10px] uppercase block">Monto Total a Pagar</span>
                <span className="font-bold text-[#C42326] text-base font-mono">
                  ${contract.montoTotalAdeudo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="mt-2 text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1 bg-slate-50 px-3 py-2 rounded border border-slate-100">
              <span><strong>Interés:</strong> ${contract.interesTotal.toFixed(2)} ({contract.tasaInteresPorcentaje}%)</span>
              <span><strong>IVA (16%):</strong> ${contract.ivaTotal.toFixed(2)}</span>
              <span><strong>Seguro de Vida:</strong> ${contract.seguroVidaTotal.toFixed(2)}</span>
              <span><strong>Aportación a Ahorro:</strong> ${contract.ahorroTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Official Amortization Calendar Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
              4. Calendario Oficial de Pagos (Tabla de Amortización)
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                  <tr>
                    <th className="py-2 px-2.5">#</th>
                    <th className="py-2 px-2.5">Vencimiento</th>
                    <th className="py-2 px-2.5 text-right">Capital</th>
                    <th className="py-2 px-2.5 text-right">Interés</th>
                    <th className="py-2 px-2.5 text-right">IVA</th>
                    <th className="py-2 px-2.5 text-right">Seguro</th>
                    <th className="py-2 px-2.5 text-right">Ahorro</th>
                    <th className="py-2 px-2.5 text-right font-bold text-slate-900">Cuota</th>
                    <th className="py-2 px-2.5 text-right">Saldo Insoluto</th>
                    <th className="py-2 px-2.5 text-center">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {contract.tablaAmortizacion.map((row) => (
                    <tr key={row.numeroCuota} className={row.estado === 'Pagado' ? 'bg-emerald-50/40' : ''}>
                      <td className="py-1.5 px-2.5 font-bold text-slate-900">{row.numeroCuota}</td>
                      <td className="py-1.5 px-2.5 font-sans">{row.fechaVencimiento}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-600">${row.capital.toFixed(2)}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-600">${row.interes.toFixed(2)}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-600">${row.iva.toFixed(2)}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-600">${row.seguro.toFixed(2)}</td>
                      <td className="py-1.5 px-2.5 text-right text-slate-600">${row.ahorro.toFixed(2)}</td>
                      <td className="py-1.5 px-2.5 text-right font-bold text-slate-900">${row.cuotaTotal.toFixed(2)}</td>
                      <td className="py-1.5 px-2.5 text-right text-[#C42326] font-semibold">${row.saldoRestante.toFixed(2)}</td>
                      <td className="py-1.5 px-2.5 text-center font-sans">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          row.estado === 'Pagado' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {row.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal Signatures */}
          <div className="pt-8 border-t border-slate-300">
            <p className="text-[10px] text-slate-500 text-justify mb-8 leading-relaxed">
              El acreditado y el aval aceptan solidariamente los términos y el calendario de pagos aquí consignado.
              Cualquier atraso devengará los cargos y mora contractual estipulados. Garma y Asociados se reserva el derecho de exigir el pago total anticipado en caso de incumplimiento.
            </p>

            <div className="grid grid-cols-3 gap-6 text-center text-xs">
              <div className="border-t border-slate-400 pt-2">
                <p className="font-bold text-slate-900">{client.nombreCompleto}</p>
                <p className="text-slate-500 text-[10px]">Firma del Acreditado (Titular)</p>
              </div>
              <div className="border-t border-slate-400 pt-2">
                <p className="font-bold text-slate-900">{client.aval.nombreCompleto}</p>
                <p className="text-slate-500 text-[10px]">Firma del Aval Solidario</p>
              </div>
              <div className="border-t border-slate-400 pt-2">
                <p className="font-bold text-slate-900">{contract.aprobadoPor}</p>
                <p className="text-slate-500 text-[10px]">Gerente Autorizante • Garma</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer in Modal */}
        <div className="no-print bg-slate-50 px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-xs transition cursor-pointer"
          >
            Cerrar Visualizador
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-[#C42326] hover:bg-[#a51c1f] text-white font-semibold rounded-lg text-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Formato</span>
          </button>
        </div>
      </div>
    </div>
  );
};
