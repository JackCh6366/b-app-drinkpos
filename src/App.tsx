import React from 'react';
import { BeverageProvider, useBeverage } from './context/BeverageContext';
import { Navbar } from './components/Navbar';
import { CustomerOrderView } from './components/customer/CustomerOrderView';
import { AdminLayout } from './components/admin/AdminLayout';

function MainApp() {
  const { activeView } = useBeverage();

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-neutral-900 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar />
      <main>
        {activeView === 'customer' ? <CustomerOrderView /> : <AdminLayout />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BeverageProvider>
      <MainApp />
    </BeverageProvider>
  );
}
