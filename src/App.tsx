import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  Client, 
  LoanContract, 
  PaymentTransaction, 
  CashRegisterCut, 
  Branch, 
  UserAccount, 
  AuditLog, 
  MachineryOrder,
  MotorcycleOrder 
} from './types';
import { storageService } from './services/storage';
import { usePWAInstall } from './hooks/usePWAInstall';
import { RoleSelector } from './components/RoleSelector';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { ReceiptModal } from './components/ReceiptModal';
import { ContractModal } from './components/ContractModal';
import { SupabaseModal } from './components/SupabaseModal';
import { PWAInstallModal } from './components/PWAInstallModal';

import { CobradorView } from './views/CobradorView';
import { GerenteView } from './views/GerenteView';
import { AdminView } from './views/AdminView';
import { MaquinariaPesadaView } from './views/TallerMotosView';

// Helper to get default module for each role
const getDefaultModule = (role: UserRole | null): string => {
  switch (role) {
    case 'cobrador': return 'cobranza';
    case 'gerente': return 'simulador';
    case 'admin': return 'global';
    case 'taller': return 'taller';
    default: return 'cobranza';
  }
};

export default function App() {
  // Navigation & Role State (starts on Home Screen to show unencapsulated logo and role selector)
  const [activeRole, setActiveRole] = useState<UserRole | null>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const roleParam = urlParams.get('role') as UserRole | null;
      if (roleParam && ['cobrador', 'gerente', 'admin', 'taller'].includes(roleParam)) {
        return roleParam;
      }
    }
    return null;
  });

  const [activeModule, setActiveModule] = useState<string>('cobranza');

  const [activeBranchId, setActiveBranchId] = useState<string>('suc-centro');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Modals state
  const [activeReceiptTx, setActiveReceiptTx] = useState<PaymentTransaction | null>(null);
  const [activeContractViewing, setActiveContractViewing] = useState<{ contract: LoanContract; client: Client } | null>(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // App Data State
  const [clients, setClients] = useState<Client[]>([]);
  const [contracts, setContracts] = useState<LoanContract[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [cashCuts, setCashCuts] = useState<CashRegisterCut[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [motoOrders, setMotoOrders] = useState<MotorcycleOrder[]>([]);
  const [isDemoSuppressed, setIsDemoSuppressed] = useState(false);

  // PWA Install Hook
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  // Load state from StorageService
  const reloadData = () => {
    setClients(storageService.getClients());
    setContracts(storageService.getContracts());
    setTransactions(storageService.getTransactions());
    setCashCuts(storageService.getCashCuts());
    setBranches(storageService.getBranches());
    setUsers(storageService.getUsers());
    setAuditLogs(storageService.getAuditLogs());
    setMotoOrders(storageService.getMotoOrders());
    setIsDemoSuppressed(storageService.isDemoSuppressed());
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Update default module when role changes
  const handleSelectRole = (role: UserRole) => {
    setActiveRole(role);
    localStorage.setItem('garma_active_role', role);
    const defMod = getDefaultModule(role);
    setActiveModule(defMod);
    localStorage.setItem('garma_active_module', defMod);
  };

  const handleModuleSelect = (moduleId: string) => {
    setActiveModule(moduleId);
    localStorage.setItem('garma_active_module', moduleId);
  };

  const handleLogout = () => {
    setActiveRole(null);
    localStorage.removeItem('garma_active_role');
    localStorage.removeItem('garma_active_module');
  };

  // Data mutation callbacks
  const handlePaymentRegistered = (tx: PaymentTransaction) => {
    storageService.registerPayment(tx);
    reloadData();
  };

  const handleClientAdded = (newClient: Client) => {
    storageService.addClient(newClient, activeRole === 'gerente' ? 'Gerente Sucursal' : 'Cobrador Campo');
    reloadData();
  };

  const handleContractApproved = (newContract: LoanContract) => {
    storageService.addContract(newContract);
    reloadData();
  };

  const handleCashCutCompleted = (cut: CashRegisterCut) => {
    storageService.addCashCut(cut);
    reloadData();
  };

  const handleBranchAdded = (branch: Branch) => {
    storageService.addBranch(branch);
    reloadData();
  };

  const handleUserAdded = (user: UserAccount) => {
    storageService.addUser(user);
    reloadData();
  };

  const handleMotoOrderAdded = (order: MotorcycleOrder) => {
    storageService.addMotoOrder(order);
    reloadData();
  };

  // If no role is active, render the Clean Role Selector Screen (2 cols mobile / 4 cols desktop, no header, no descriptions)
  if (!activeRole) {
    return (
      <RoleSelector onSelectRole={handleSelectRole} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-[#C42326] selection:text-white">
      {/* 1. Cabecera Institucional Unificada */}
      <Header
        activeRole={activeRole}
        branches={branches}
        activeBranchId={activeBranchId}
        onBranchChange={setActiveBranchId}
        onLogout={handleLogout}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        onToggleSidebar={() => setIsSidebarOpenMobile(true)}
        isInstallable={isInstallable}
        isDemoSuppressed={isDemoSuppressed}
      />

      {/* Main Workspace with Desktop Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* 2. Menú Lateral Desplegable en Escritorio */}
        <Sidebar
          activeRole={activeRole}
          activeModule={activeModule}
          onSelectModule={handleModuleSelect}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
          onLogout={handleLogout}
          onOpenDataModal={() => setIsDataModalOpen(true)}
        />

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8 min-w-0 overflow-x-hidden">
          {activeRole === 'cobrador' && (
            <CobradorView
              activeModule={activeModule}
              clients={clients}
              contracts={contracts}
              transactions={transactions}
              branches={branches}
              activeBranchId={activeBranchId}
              onPaymentRegistered={handlePaymentRegistered}
              onClientAdded={handleClientAdded}
              onViewReceipt={(tx) => setActiveReceiptTx(tx)}
            />
          )}

          {activeRole === 'gerente' && (
            <GerenteView
              activeModule={activeModule}
              clients={clients}
              contracts={contracts}
              transactions={transactions}
              cashCuts={cashCuts}
              branches={branches}
              activeBranchId={activeBranchId}
              onContractApproved={handleContractApproved}
              onCashCutCompleted={handleCashCutCompleted}
              onViewContract={(contract, client) => setActiveContractViewing({ contract, client })}
            />
          )}

          {activeRole === 'admin' && (
            <AdminView
              activeModule={activeModule}
              clients={clients}
              contracts={contracts}
              transactions={transactions}
              cashCuts={cashCuts}
              branches={branches}
              users={users}
              auditLogs={auditLogs}
              activeBranchId={activeBranchId}
              onBranchChange={setActiveBranchId}
              onBranchAdded={handleBranchAdded}
              onUserAdded={handleUserAdded}
            />
          )}

          {activeRole === 'taller' && (
            <MaquinariaPesadaView
              activeModule={activeModule}
              motoOrders={motoOrders}
              branches={branches}
              activeBranchId={activeBranchId}
              onOrderAdded={handleMotoOrderAdded}
            />
          )}
        </main>
      </div>

      {/* 3. Navegación Móvil y Tablet (Bottom Bar) */}
      <BottomNav
        activeRole={activeRole}
        activeModule={activeModule}
        onSelectModule={handleModuleSelect}
      />

      {/* MODAL: Printable Receipt */}
      {activeReceiptTx && (
        <ReceiptModal
          transaction={activeReceiptTx}
          client={clients.find(c => c.id === activeReceiptTx.clienteId)}
          contract={contracts.find(c => c.id === activeReceiptTx.contratoId)}
          onClose={() => setActiveReceiptTx(null)}
        />
      )}

      {/* MODAL: Official Contract & Amortization Calendar */}
      {activeContractViewing && (
        <ContractModal
          contract={activeContractViewing.contract}
          client={activeContractViewing.client}
          onClose={() => setActiveContractViewing(null)}
        />
      )}

      {/* MODAL: Supabase & Sample Data Management */}
      <SupabaseModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        onDataChanged={reloadData}
        isDemoSuppressed={isDemoSuppressed}
      />

      {/* MODAL: PWA Install Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        isInstallable={isInstallable}
        isIOS={isIOS}
        isInstalled={isInstalled}
        onInstall={install}
      />
    </div>
  );
}
