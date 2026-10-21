import React, { useState } from 'react';
import { storageService } from '../services/storage';
import { Trash2, Database, Copy, Check, RefreshCw, AlertTriangle, X, ShieldAlert, Sparkles } from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
  isDemoSuppressed: boolean;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
  isDemoSuppressed
}) => {
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [copiedTruncate, setCopiedTruncate] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(() => storageService.getSupabaseConfig()?.url || '');
  const [supabaseKey, setSupabaseKey] = useState(() => storageService.getSupabaseConfig()?.anonKey || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleClearSampleData = () => {
    if (window.confirm('¿Está seguro de eliminar TODOS los datos de muestra del sistema? Se activará el modo limpio y el navegador NO volverá a mostrar datos de prueba.')) {
      storageService.clearAllSystemData();
      onDataChanged();
      alert('Se han borrado los datos de muestra. El sistema operará con base de datos limpia.');
    }
  };

  const handleRestoreSampleData = () => {
    if (window.confirm('¿Desea restaurar los datos de muestra para pruebas?')) {
      storageService.restoreSampleData();
      onDataChanged();
      alert('Datos de prueba restaurados.');
    }
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSupabaseConfig({ url: supabaseUrl, anonKey: supabaseKey });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const supabaseSchemaSQL = `-- Esquema SQL Oficial para Supabase - Garma y Asociados
-- Ejecuta este script en el Editor SQL de tu panel de Supabase

CREATE TABLE IF NOT EXISTS sucursales (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  direccion TEXT NOT NULL,
  telefono TEXT,
  gerente_encargado TEXT,
  activa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clientes (
  id TEXT PRIMARY KEY,
  nombre_completo TEXT NOT NULL,
  telefono TEXT NOT NULL,
  direccion TEXT NOT NULL,
  giro_negocio TEXT NOT NULL,
  dia_asignado_pago TEXT NOT NULL,
  sucursal_id TEXT REFERENCES sucursales(id),
  aval_nombre TEXT NOT NULL,
  aval_telefono TEXT NOT NULL,
  aval_direccion TEXT NOT NULL,
  aval_parentesco TEXT NOT NULL,
  fecha_registro DATE DEFAULT CURRENT_DATE,
  historial_mora BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contratos (
  id TEXT PRIMARY KEY,
  folio TEXT UNIQUE NOT NULL,
  cliente_id TEXT REFERENCES clientes(id),
  sucursal_id TEXT REFERENCES sucursales(id),
  monto_solicitado NUMERIC NOT NULL,
  plazo_semanas INTEGER NOT NULL,
  frecuencia TEXT NOT NULL,
  dia_pago TEXT NOT NULL,
  tasa_interes NUMERIC NOT NULL,
  interes_total NUMERIC NOT NULL,
  iva_total NUMERIC NOT NULL,
  seguro_vida NUMERIC NOT NULL,
  ahorro_total NUMERIC NOT NULL,
  total_adeudo NUMERIC NOT NULL,
  cuota_periodica NUMERIC NOT NULL,
  saldo_pendiente NUMERIC NOT NULL,
  saldo_vencido NUMERIC DEFAULT 0,
  estatus TEXT NOT NULL DEFAULT 'Activo',
  fecha_aprobacion DATE DEFAULT CURRENT_DATE,
  aprobado_por TEXT,
  tabla_amortizacion JSONB,
  total_pagado NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transacciones_cobros (
  id TEXT PRIMARY KEY,
  folio TEXT UNIQUE NOT NULL,
  contrato_id TEXT REFERENCES contratos(id),
  cliente_id TEXT REFERENCES clientes(id),
  cliente_nombre TEXT NOT NULL,
  monto_pagado NUMERIC NOT NULL,
  fecha TIMESTAMPTZ DEFAULT NOW(),
  metodo_pago TEXT NOT NULL,
  sucursal_id TEXT,
  cobrador_nombre TEXT NOT NULL,
  desglose JSONB,
  saldo_anterior NUMERIC,
  nuevo_saldo NUMERIC,
  notas TEXT
);

CREATE TABLE IF NOT EXISTS arqueos_caja (
  id TEXT PRIMARY KEY,
  folio TEXT UNIQUE NOT NULL,
  fecha DATE DEFAULT CURRENT_DATE,
  sucursal_id TEXT,
  gerente_nombre TEXT NOT NULL,
  cobros_esperados NUMERIC NOT NULL,
  cobros_ingresados NUMERIC NOT NULL,
  total_efectivo_reportado NUMERIC NOT NULL,
  diferencia NUMERIC DEFAULT 0,
  clientes_programados INTEGER,
  clientes_pagaron INTEGER,
  clientes_faltantes INTEGER,
  cerrado BOOLEAN DEFAULT TRUE,
  observaciones TEXT
);

CREATE TABLE IF NOT EXISTS bitacora_auditoria (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  usuario TEXT NOT NULL,
  rol TEXT NOT NULL,
  accion TEXT NOT NULL,
  modulo TEXT NOT NULL,
  detalles TEXT,
  sucursal_id TEXT
);
`;

  const truncateSQL = `-- Script para borrar todos los registros en Supabase (Modo Limpio)
TRUNCATE TABLE transacciones_cobros CASCADE;
TRUNCATE TABLE contratos CASCADE;
TRUNCATE TABLE clientes CASCADE;
TRUNCATE TABLE arqueos_caja CASCADE;
TRUNCATE TABLE bitacora_auditoria CASCADE;
`;

  const handleCopySQL = () => {
    navigator.clipboard.writeText(supabaseSchemaSQL);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  const handleCopyTruncate = () => {
    navigator.clipboard.writeText(truncateSQL);
    setCopiedTruncate(true);
    setTimeout(() => setCopiedTruncate(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#F07D08]" />
            <div>
              <h3 className="text-sm sm:text-base font-bold">Gestión de Datos y Base Supabase</h3>
              <p className="text-xs text-slate-400">Control de datos de muestra y persistencia en la nube</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Local Sample Data Eraser & Browser Preference */}
          <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#C42326] text-white rounded-lg shrink-0 mt-0.5">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">
                  Borrar Datos de Muestra del Sistema
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Al pulsar este botón, se eliminarán todos los clientes, contratos, cobros y arqueos de prueba. 
                  <strong> La preferencia se guarda en el navegador</strong> para que no vuelvan a cargarse datos de muestra automáticamente al recargar.
                </p>
                <div className="mt-2 text-[11px] font-semibold text-slate-700 flex items-center gap-2">
                  <span>Estado actual:</span>
                  <span className={`px-2 py-0.5 rounded-full ${isDemoSuppressed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {isDemoSuppressed ? '✓ Modo Base Limpia (Sin Datos Demo)' : '• Mostrando Datos Demo Iniciales'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-red-200/70">
              <button
                onClick={handleClearSampleData}
                className="flex items-center gap-2 px-4 py-2 bg-[#C42326] hover:bg-[#a51c1f] text-white text-xs font-bold rounded-lg transition active:scale-95 cursor-pointer shadow-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>Borrar Todos los Datos de Muestra</span>
              </button>

              <button
                onClick={handleRestoreSampleData}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restaurar Datos de Demostración</span>
              </button>
            </div>
          </div>

          {/* Section 2: Supabase Credentials */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#F07D08]" />
              <h4 className="text-sm font-bold text-slate-900">
                Conexión a Base de Datos en Supabase (Opcional)
              </h4>
            </div>
            <p className="text-xs text-slate-600">
              Configure las credenciales de su proyecto Supabase para sincronizar clientes, cartera y transacciones en tiempo real.
            </p>

            <form onSubmit={handleSaveSupabase} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Project URL de Supabase:
                </label>
                <input
                  type="text"
                  placeholder="https://xyzabcdefg.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#C42326] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  API Key / Public Anon Key:
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#C42326] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  Guardar Conexión Supabase
                </button>
                {saveSuccess && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Credenciales guardadas
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Section 3: Supabase SQL Scripts */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Scripts SQL para Supabase
            </h4>
            <p className="text-xs text-slate-600">
              Copie los comandos listos para ejecutar en el SQL Editor de Supabase para inicializar o vaciar las tablas del sistema Garma y Asociados:
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCopySQL}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition cursor-pointer border border-slate-300"
              >
                {copiedSQL ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSQL ? '¡SQL Copiado!' : 'Copiar Creación de Tablas SQL'}</span>
              </button>

              <button
                onClick={handleCopyTruncate}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-[#C42326] text-xs font-semibold rounded-lg transition cursor-pointer border border-red-200"
              >
                {copiedTruncate ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTruncate ? '¡Truncate Copiado!' : 'Copiar Vaciar Tablas Supabase (TRUNCATE)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
