import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Users from './pages/Users';
import Categories from './pages/Categories';
import Tickets from './pages/Tickets';
import { useStore } from './hooks/useStore';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const store = useStore();

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return (
          <Dashboard
            assets={store.assets}
            users={store.users}
            categories={store.categories}
            tickets={store.tickets}
          />
        );
      case 'inventory':
        return (
          <Inventory
            assets={store.assets}
            categories={store.categories}
            users={store.users}
            onAdd={store.addAsset}
            onUpdate={store.updateAsset}
            onDelete={store.deleteAsset}
          />
        );
      case 'tickets':
        return (
          <Tickets
            tickets={store.tickets}
            assets={store.assets}
            users={store.users}
            onAdd={store.addTicket}
            onUpdate={store.updateTicket}
            onDelete={store.deleteTicket}
          />
        );
      case 'users':
        return (
          <Users
            users={store.users}
            assets={store.assets}
            onAdd={store.addUser}
            onUpdate={store.updateUser}
            onDelete={store.deleteUser}
          />
        );
      case 'categories':
        return (
          <Categories
            categories={store.categories}
            assets={store.assets}
            onAdd={store.addCategory}
            onUpdate={store.updateCategory}
            onDelete={store.deleteCategory}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex">
      <Sidebar
        currentPage={page}
        onNavigate={setPage}
        assetCount={store.assets.length}
        userCount={store.users.length}
      />
      <main className="flex-1 ml-[260px] p-6 min-h-screen overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
