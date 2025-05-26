
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  BarChart3,
  Zap
} from "lucide-react";

const performanceData = [
  {
    title: "Usuários Ativos",
    value: "125",
    change: "+12%",
    period: "vs. último mês",
    trend: "up",
    icon: Users,
    color: "blue"
  },
  {
    title: "Taxa de Engajamento", 
    value: "87%",
    change: "+5%",
    period: "vs. semana anterior",
    trend: "up",
    icon: Target,
    color: "green"
  },
  {
    title: "Tempo Médio de Sessão",
    value: "24min",
    change: "+8%",
    period: "vs. último mês",
    trend: "up",
    icon: Clock,
    color: "purple"
  },
  {
    title: "Conversão de Leads",
    value: "32%",
    change: "-2%",
    period: "vs. último mês", 
    trend: "down",
    icon: TrendingUp,
    color: "amber"
  }
];

const activityHours = [
  { hour: "06h", users: 12 },
  { hour: "09h", users: 45 },
  { hour: "12h", users: 78 },
  { hour: "15h", users: 93 },
  { hour: "18h", users: 67 },
  { hour: "21h", users: 34 }
];

const colorMap = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  amber: "bg-amber-100 text-amber-600"
};

export function PerformanceMetrics() {
  const maxUsers = Math.max(...activityHours.map(h => h.users));

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          Métricas de Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 gap-3">
          {performanceData.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colorMap[metric.color as keyof typeof colorMap]}`}>
                  <metric.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-900">{metric.title}</h4>
                  <p className="text-xs text-gray-500">{metric.period}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{metric.value}</div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    metric.trend === "up" 
                      ? "text-green-600 border-green-200" 
                      : "text-red-600 border-red-200"
                  }`}
                >
                  {metric.change}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gráfico de Atividade por Hora */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-sm text-gray-900 mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Usuários por Hora (Hoje)
          </h4>
          <div className="space-y-2">
            {activityHours.map((hour, index) => (
              <motion.div
                key={hour.hour}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="text-xs text-gray-500 w-8">{hour.hour}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(hour.users / maxUsers) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700 w-8">{hour.users}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center pt-2">
          <Badge variant="outline" className="text-purple-600 border-purple-200">
            <TrendingUp className="h-3 w-3 mr-1" />
            Performance em Alta
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
