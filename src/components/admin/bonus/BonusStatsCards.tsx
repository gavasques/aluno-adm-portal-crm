
import React from "react";
import { Gift, Calendar, TrendingUp, Package } from "lucide-react";
import { CardStats } from "@/components/ui/card-stats";
import { BonusStats } from "@/types/bonus.types";

interface BonusStatsCardsProps {
  stats: BonusStats;
  loading?: boolean;
}

const BonusStatsCards: React.FC<BonusStatsCardsProps> = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-32"></div>
        ))}
      </div>
    );
  }

  const mostCommonType = Object.entries(stats.byType).reduce((a, b) => 
    stats.byType[a[0] as keyof typeof stats.byType] > stats.byType[b[0] as keyof typeof stats.byType] ? a : b
  )[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <CardStats 
        title="Total de Bônus"
        value={stats.total}
        icon={<Gift size={20} />}
        description="cadastrados no sistema"
        className="bg-gradient-to-br from-blue-50 to-white"
      />
      
      <CardStats 
        title="Recentemente Adicionados"
        value={stats.recentlyAdded}
        icon={<Calendar size={20} />}
        description="últimos 30 dias"
        trend={stats.recentlyAdded > 0 ? "up" : "neutral"}
        trendValue={stats.recentlyAdded > 0 ? `+${stats.recentlyAdded}` : "0"}
        className="bg-gradient-to-br from-green-50 to-white"
      />
      
      <CardStats 
        title="Tipo Mais Comum"
        value={mostCommonType}
        icon={<TrendingUp size={20} />}
        description={`${stats.byType[mostCommonType as keyof typeof stats.byType]} bônus`}
        className="bg-gradient-to-br from-purple-50 to-white"
      />
      
      <CardStats 
        title="Softwares"
        value={stats.byType.Software}
        icon={<Package size={20} />}
        description="bônus de software"
        className="bg-gradient-to-br from-orange-50 to-white"
      />
    </div>
  );
};

export default BonusStatsCards;
