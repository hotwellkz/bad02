```typescript
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Building2, Car, Globe, Hammer, Home, Package, User, Wallet } from 'lucide-react';
import { CategoryCardType } from '../types';
import React from 'react';

const iconMap: { [key: string]: React.ElementType } = {
  Car,
  User,
  Building2,
  Wallet,
  Home,
  Hammer,
  Globe,
  Package
};

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeCallbacks: (() => void)[] = [];

    try {
      // Подписываемся на клиентов для отслеживания их статуса
      const clientsQuery = query(
        collection(db, 'clients'),
        where('status', '==', 'built')
      );

      const clientsUnsubscribe = onSnapshot(clientsQuery, (clientsSnapshot) => {
        const builtClients = new Set(
          clientsSnapshot.docs.map(doc => {
            const data = doc.data();
            return `${data.lastName} ${data.firstName}`;
          })
        );

        // Подписываемся на категории
        [1, 2, 3, 4].forEach(row => {
          const categoriesQuery = query(
            collection(db, 'categories'),
            where('row', '==', row),
            orderBy('createdAt', 'desc')
          );

          const unsubscribe = onSnapshot(categoriesQuery, 
            (snapshot) => {
              setCategories(prev => {
                const updatedCategories = [...prev];
                
                snapshot.docChanges().forEach(change => {
                  const data = change.doc.data();
                  const IconComponent = iconMap[data.icon] || Home;
                  const clientName = data.title;
                  
                  // Определяем видимость категории
                  let isVisible = true;
                  if ((data.row === 1 || data.row === 3) && builtClients.has(clientName)) {
                    isVisible = false;
                  }
                  
                  const categoryData: CategoryCardType = {
                    id: change.doc.id,
                    title: data.title || '',
                    amount: data.amount || '0 ₸',
                    icon: React.createElement(IconComponent, { 
                      size: 24,
                      className: "text-white"
                    }),
                    iconName: data.icon || 'Home',
                    color: data.color || 'bg-emerald-500',
                    row: data.row || 1,
                    isVisible
                  };

                  const index = updatedCategories.findIndex(cat => cat.id === categoryData.id);
                  
                  if (change.type === 'added' && index === -1) {
                    updatedCategories.push(categoryData);
                  } else if (change.type === 'modified' && index !== -1) {
                    updatedCategories[index] = categoryData;
                  } else if (change.type === 'removed' && index !== -1) {
                    updatedCategories.splice(index, 1);
                  }
                });

                return updatedCategories;
              });
              setLoading(false);
            },
            (error) => {
              console.error('Categories subscription error:', error);
              setError('Failed to load categories');
              setLoading(false);
            }
          );

          unsubscribeCallbacks.push(unsubscribe);
        });
      });

      unsubscribeCallbacks.push(clientsUnsubscribe);

    } catch (error) {
      console.error('Error in useCategories:', error);
      setError('Failed to initialize categories subscription');
      setLoading(false);
    }

    return () => {
      unsubscribeCallbacks.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  return { categories, loading, error };
};
```