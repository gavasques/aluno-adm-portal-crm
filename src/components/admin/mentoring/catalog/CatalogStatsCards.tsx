
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Zap, User, Users } from 'lucide-react';
import { MentoringCatalog } from '@/types/mentoring.types';

interface CatalogStatsCardsProps {
  catalogs: MentoringCatalog[];
}

const CatalogStatsCards: React.FC<CatalogStatsCardsProps> = ({ catalogs }) => {
  const stats = {
    total: catalogs.length,
    active: catalogs.filter(c => c.active).length,
    individual: catalogs.filter(c => c.type === 'Individual').length,
    group: catalogs.filter(c => c.type === 'Grupo').length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              <p className="text-xs text-blue-600">mentorias</p>
            </div>
            <div className="p-2 bg-blue-500 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Ativas</p>
              <p className="text-2xl font-bold text-green-900">{stats.active}</p>
              <p className="text-xs text-green-600">disponíveis</p>
            </div>
            <div className="p-2 bg-green-500 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">Individual</p>
              <p className="text-2xl font-bold text-purple-900">{stats.individual}</p>
              <p className="text-xs text-purple-600">1:1</p>
            </div>
            <div className="p-2 bg-purple-500 rounded-lg">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 mb-1">Grupo</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.group}</p>
              <p className="text-xs text-yellow-600">turmas</p>
            </div>
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CatalogStatsCards;
