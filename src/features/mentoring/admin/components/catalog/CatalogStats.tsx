
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award, TrendingUp, User, Users, Target, Zap } from 'lucide-react';

interface CatalogStatsProps {
  total: number;
  active: number;
  individual: number;
  group: number;
}

export const CatalogStats: React.FC<CatalogStatsProps> = ({
  total,
  active,
  individual,
  group
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3">
      <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-md transition-all duration-300">
        <CardContent className="p-2 lg:p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-600 mb-1">Total</p>
              <p className="text-lg lg:text-xl font-bold text-blue-900">{total}</p>
              <div className="flex items-center mt-1">
                <Award className="h-2 w-2 text-blue-500 mr-1" />
                <span className="text-xs text-blue-700">Mentorias</span>
              </div>
            </div>
            <Target className="h-6 w-6 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 hover:shadow-md transition-all duration-300">
        <CardContent className="p-2 lg:p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-600 mb-1">Ativas</p>
              <p className="text-lg lg:text-xl font-bold text-green-900">{active}</p>
              <div className="flex items-center mt-1">
                <Zap className="h-2 w-2 text-green-500 mr-1" />
                <span className="text-xs text-green-700">{((active / total) * 100 || 0).toFixed(0)}%</span>
              </div>
            </div>
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-md transition-all duration-300">
        <CardContent className="p-2 lg:p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-purple-600 mb-1">Individual</p>
              <p className="text-lg lg:text-xl font-bold text-purple-900">{individual}</p>
              <div className="flex items-center mt-1">
                <User className="h-2 w-2 text-purple-500 mr-1" />
                <span className="text-xs text-purple-700">1:1</span>
              </div>
            </div>
            <User className="h-6 w-6 text-purple-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-md transition-all duration-300">
        <CardContent className="p-2 lg:p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-orange-600 mb-1">Grupo</p>
              <p className="text-lg lg:text-xl font-bold text-orange-900">{group}</p>
              <div className="flex items-center mt-1">
                <Users className="h-2 w-2 text-orange-500 mr-1" />
                <span className="text-xs text-orange-700">Turmas</span>
              </div>
            </div>
            <Users className="h-6 w-6 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
