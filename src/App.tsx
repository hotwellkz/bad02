import React, { Suspense } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useStats } from './hooks/useStats';

// Ленивая загрузка страниц из pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Transactions = React.lazy(() => import('./pages/Transactions'));
const Feed = React.lazy(() => import('./pages/Feed'));
const DailyReport = React.lazy(() => import('./pages/DailyReport'));
const Clients = React.lazy(() => import('./pages/Clients'));
const ContractTemplates = React.lazy(() => import('./pages/ContractTemplates'));
const Products = React.lazy(() => import('./pages/Products'));
const Employees = React.lazy(() => import('./pages/Employees'));
const Projects = React.lazy(() => import('./pages/Projects'));
const Calculator = React.lazy(() => import('./pages/Calculator'));
const Chat = React.lazy(() => import('./pages/Chat'));
const Warehouse = React.lazy(() => import('./pages/Warehouse'));

type Page = 'dashboard' | 'transactions' | 'feed' | 'daily-report' | 'clients' | 'templates' | 'products' | 'employees' | 'projects' | 'calculator' | 'chat' | 'warehouse';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState<Page>('dashboard');
  const { stats, loading: statsLoading, error: statsError } = useStats();

  if (statsLoading) {
    return <LoadingSpinner />;
  }

  if (statsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-xl text-red-500 p-4 bg-white rounded-lg shadow">
          Ошибка загрузки данных: {statsError}
        </div>
      </div>
    );
  }

  const renderPage = () => {
    const pageComponents = {
      dashboard: <Dashboard />,
      transactions: <Transactions />,
      feed: <Feed />,
      'daily-report': <DailyReport />,
      clients: <Clients />,
      templates: <ContractTemplates />,
      products: <Products />,
      employees: <Employees />,
      projects: <Projects />,
      calculator: <Calculator />,
      chat: <Chat />,
      warehouse: <Warehouse />
    };

    return (
      <Suspense fallback={<LoadingSpinner />}>
        {pageComponents[currentPage]}
      </Suspense>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar onPageChange={setCurrentPage} currentPage={currentPage} />
      <div className="lg:pl-64">
        <Header stats={stats} />
        {renderPage()}
      </div>
    </div>
  );
};

export default App;