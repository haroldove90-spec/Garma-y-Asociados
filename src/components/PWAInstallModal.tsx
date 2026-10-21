import React from 'react';
import { GarmaIcon, GarmaLogo } from './Logos';
import { Download, Smartphone, Laptop, CheckCircle2, X, Share } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isIOS: boolean;
  isInstalled: boolean;
  onInstall: () => Promise<boolean>;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isIOS,
  isInstalled,
  onInstall
}) => {
  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await onInstall();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#000000] via-[#C42326] to-[#F07D08] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-white rounded-xl shadow-md">
              <GarmaIcon className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">Instalar Garma y Asociados</h3>
              <p className="text-xs text-white/80">App Móvil y de Escritorio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isInstalled ? (
            <div className="text-center py-4 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">¡Aplicación ya instalada!</h4>
              <p className="text-xs text-slate-600">
                Garma y Asociados ya se encuentra instalada en este dispositivo como aplicación nativa.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Smartphone className="w-5 h-5 text-[#C42326] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="block text-slate-800">Uso Rápido en Campo y Ventanilla</strong>
                    <span className="text-slate-500">
                      Acceda directamente desde la pantalla de inicio sin barra de navegación ni retrasos.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Laptop className="w-5 h-5 text-[#F07D08] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="block text-slate-800">Modo Fuera de Línea (Offline)</strong>
                    <span className="text-slate-500">
                      La app almacena su ruta y clientes en memoria para operar aun con mala señal celular.
                    </span>
                  </div>
                </div>
              </div>

              {/* iOS Instructions */}
              {isIOS ? (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-2 text-slate-800">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <Share className="w-4 h-4 text-[#F07D08]" />
                    <span>Instalación en iPhone / iPad (Safari):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700 pl-1">
                    <li>Toque el botón <strong>Compartir</strong> <span className="inline-block px-1 bg-amber-200/60 rounded">⎙ / ↑</span> en la barra inferior de Safari.</li>
                    <li>Deslice hacia abajo y seleccione <strong>"Agregar a Inicio"</strong> (Add to Home Screen).</li>
                    <li>Toque <strong>"Agregar"</strong> en la esquina superior derecha.</li>
                  </ol>
                </div>
              ) : (
                <div className="pt-2">
                  <button
                    onClick={handleInstallClick}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#C42326] hover:bg-[#a51c1f] text-white font-bold rounded-xl text-sm shadow-md transition active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#F07D08]" />
                    <span>Instalar Garma y Asociados Ahora</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-500 mt-2">
                    Compatible con Chrome, Edge, Android y computadoras de escritorio.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
