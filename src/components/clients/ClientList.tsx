import React from 'react';
import { Client } from '../../types/client';
import { ClientSection } from './ClientSection';
import { Users } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  onContextMenu: (e: React.MouseEvent, client: Client) => void;
  onClientClick: (client: Client) => void;
  onToggleVisibility: (client: Client) => void;
  status: 'building' | 'deposit' | 'built' | 'all';
}

export const ClientList: React.FC<ClientListProps> = ({
  clients,
  onContextMenu,
  onClientClick,
  onToggleVisibility,
  status
}) => {
  // Сортируем клиентов по номеру в каждой категории
  const sortClients = (clientsToSort: Client[]) => {
    return [...clientsToSort].sort((a, b) => {
      const aNum = parseInt(a.clientNumber.split('-')[1]);
      const bNum = parseInt(b.clientNumber.split('-')[1]);
      return aNum - bNum;
    });
  };

  const buildingClients = sortClients(clients.filter(client => client.status === 'building'));
  const depositClients = sortClients(clients.filter(client => client.status === 'deposit'));
  const builtClients = sortClients(clients.filter(client => client.status === 'built'));

  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Нет клиентов</h3>
        <p className="text-gray-500">
          {status === 'building' ? 'Нет активных проектов' :
           status === 'deposit' ? 'Нет клиентов с задатком' :
           status === 'built' ? 'Нет завершенных проектов' :
           'Список клиентов пуст'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {buildingClients.length > 0 && (
        <ClientSection
          title="Строим"
          subtitle="Активные проекты"
          clients={buildingClients}
          onContextMenu={onContextMenu}
          onClientClick={onClientClick}
          onToggleVisibility={onToggleVisibility}
          type="building"
        />
      )}

      {depositClients.length > 0 && (
        <ClientSection
          title="Задаток"
          subtitle="Ожидают строительства"
          clients={depositClients}
          onContextMenu={onContextMenu}
          onClientClick={onClientClick}
          onToggleVisibility={onToggleVisibility}
          type="deposit"
        />
      )}

      {builtClients.length > 0 && (
        <ClientSection
          title="Построено"
          subtitle="Завершенные проекты"
          clients={builtClients}
          onContextMenu={onContextMenu}
          onClientClick={onClientClick}
          onToggleVisibility={onToggleVisibility}
          type="built"
        />
      )}
    </div>
  );
};