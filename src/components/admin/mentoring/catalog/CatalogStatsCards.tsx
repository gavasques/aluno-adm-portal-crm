
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, ToggleRight, DollarSign, Users, TrendingUp } from 'lucide-react';
import { MentoringCatalog } from '@/types/mentoring.types';

interface CatalogStatsCardsProps {
  catalogs: MentoringCatalog[];
}

const CatalogStatsCards: React.FC<CatalogStatsCardsProps> = ({ catalogs }) => {
  const totalCatalogs = catalogs.length;
  const activeCatalogs = catalogs.filter(c => c.active).length;
  const averagePrice = catalogs.length > 0 
    ? Math.round(catalogs.reduce((acc, c) => acc + c.price, 0) / catalogs.length)
    : 0;
  const uniqueTypes = new Set(catalogs.map(c => c.type)).size;

  const stats = [
    {
      title: 'Total de Mentorias',
      value: totalCatalogs.toString(),
      icon: BookOpen,
      color: 'blue',
      trend: '+12% vs mês anterior'
    },
    {
      title: 'Mentorias Ativas',
      value: activeCatalogs.toString(),
      icon: ToggleRight,
      color: 'green',
      trend: `${Math.round((activeCatalogs / totalCatalogs) * 100)}% do total`
    },
    {
      title: 'Valor Médio',
      value: `R$ ${averagePrice.toLocaleString()}`,
      icon: DollarSign,
      color: 'purple',
      trend: '+5% vs mês anterior'
    },
    {
      title: 'Tipos Diferentes',
      value: uniqueTypes.toString(),
      icon: Users,
      color: 'orange',
      trend: 'Individual, Grupo, Premium'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return { bg: 'bg-blue-100', icon: 'text-blue-600' };
      case 'green': return { bg: 'bg-green-100', icon: 'text-green-600' };
      case 'purple': return { bg: 'bg-purple-100', icon: 'text-purple-600' };
      case 'orange': return { bg: 'bg-orange-100', icon: 'text-orange-600' };
      default: return { bg: 'bg-gray-100', icon: 'text-gray-600' };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const colors = getColorClasses(stat.color);
        const Icon = stat.icon;
        
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${colors.bg} rounded-lg`}>
                  <Icon className={`h-6 w-6 ${colors.icon}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.trend}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CatalogStatsCards;
