import React from 'react';
import { PaymentTransaction, Client, LoanContract } from '../types';
import { GarmaLogo } from './Logos';
import { Printer, CheckCircle2, X, Share2 } from 'lucide-react';

interface ReceiptModalProps {
  transaction: PaymentTransaction;
  client?: Client;
  contract?: LoanContract;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  client,
  contract,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const text = `Comprobante Garma y Asociados - Folio: ${transaction.folio}\nCliente: ${transaction.clienteNombre}\nMonto: $${transaction.montoPagado.toFixed(2)}\nNuevo Saldo: $${transaction.nuevoSaldo.toFixed(2)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Recibo ${transaction.folio}`,
          text: text
        });
      } catch {
        // Fallback copy
        navigator.clipboard.writeText(text);
        alert('Datos del comprobante copiados al portapapeles');
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Datos del comprobante copiados al portapapeles');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden my-8 print-page">
        {/* Action Header - Hidden when printing */}
        <div className="no-print bg-slate-900 px-5 py-3.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold">Comprobante de Pago Generado</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              title="Compartir"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C42326] hover:bg-[#a51c1f] text-xs font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Receipt Ticket Content */}
        <div className="p-6 text-slate-800 space-y-4">
          {/* Header Brand */}
          <div className="text-center border-b pb-4">
            <div className="flex justify-center mb-2">
              <GarmaLogo className="h-10 w-auto object-contain" />
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Garma y Asociados S.A. de C.V.
            </p>
            <p className="text-[11px] text-slate-500">
              Sistema de Renta de Maquinaria Pesada y Cobranza en Obra
            </p>
            <div className="mt-2 inline-block px-3 py-1 bg-red-50 text-[#C42326] border border-red-200 rounded-md text-xs font-mono font-bold">
              FOLIO: {transaction.folio}
            </div>
          </div>

          {/* Transaction Metadata */}
          <div className="text-xs space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Fecha y Hora:</span>
              <span className="font-semibold text-slate-800">{transaction.fecha}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sucursal:</span>
              <span className="font-semibold text-slate-800">{transaction.sucursalId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cobrador / Asesor:</span>
              <span className="font-semibold text-slate-800">{transaction.cobradorNombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Método de Pago:</span>
              <span className="font-semibold text-slate-800">{transaction.metodoPago}</span>
            </div>
          </div>

          {/* Client Details */}
          <div className="text-xs space-y-1 border-b pb-3">
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              Datos del Titular
            </p>
            <p className="text-sm font-bold text-slate-900">{transaction.clienteNombre}</p>
            {client && (
              <>
                <p className="text-slate-600 text-[11px]">{client.direccion}</p>
                <p className="text-slate-600 text-[11px]">Tel: {client.telefono}</p>
              </>
            )}
            <p className="text-slate-500 text-[11px] pt-1">
              Contrato: <span className="font-mono font-semibold text-slate-700">{contract?.folio || transaction.contratoId}</span>
            </p>
          </div>

          {/* Amount Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-center">
            <span className="text-xs uppercase tracking-wider text-emerald-800 font-semibold block">
              Monto Recibido
            </span>
            <span className="text-2xl font-black text-emerald-700 font-mono">
              ${transaction.montoPagado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Detailed Breakdown */}
          <div className="text-xs space-y-1 pt-1 border-b pb-3">
            <p className="font-bold text-slate-700 text-[11px] uppercase mb-1">
              Aplicación del Abono (Regla Institucional):
            </p>
            <div className="flex justify-between text-slate-600">
              <span>Amortización a Capital:</span>
              <span className="font-mono">${transaction.desglose.capital.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Interés Ordinario:</span>
              <span className="font-mono">${transaction.desglose.interes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Cuota Seguro de Vida:</span>
              <span className="font-mono">${transaction.desglose.seguro.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Aportación a Ahorro:</span>
              <span className="font-mono">${transaction.desglose.ahorro.toFixed(2)}</span>
            </div>
            {transaction.desglose.moraCuotaVencida > 0 && (
              <div className="flex justify-between text-red-600 font-semibold">
                <span>Recargo / Mora Cubierta:</span>
                <span className="font-mono">${transaction.desglose.moraCuotaVencida.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Balances */}
          <div className="text-xs space-y-1.5 pt-1">
            <div className="flex justify-between text-slate-600">
              <span>Saldo Anterior:</span>
              <span className="font-mono">${transaction.saldoAnterior.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 text-sm">
              <span>Nuevo Saldo Insoluto:</span>
              <span className="font-mono text-[#C42326]">${transaction.nuevoSaldo.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer Barcode / Legal notice */}
          <div className="text-center pt-3 border-t text-[10px] text-slate-500 space-y-1">
            <p>Conserve este comprobante como constancia oficial de abono.</p>
            <div className="font-mono tracking-widest text-slate-400 py-1">
              *||| | ||||| || |||||| | |||| *
            </div>
            <p className="text-[9px] text-slate-400">
              Garma y Asociados © {new Date().getFullYear()} - Sistema Certificado
            </p>
          </div>
        </div>

        {/* Bottom Close Bar - hidden on print */}
        <div className="no-print bg-slate-50 p-4 border-t text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-bold text-slate-800 transition"
          >
            Aceptar y Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
