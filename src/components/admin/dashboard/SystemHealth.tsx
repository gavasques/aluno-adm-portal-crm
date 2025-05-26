
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Server, 
  Database, 
  Wifi, 
  HardDrive,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

const systemMetrics = [
  {
    name: "Status do Servidor",
    status: "online",
    value: "99.9%",
    icon: Server,
    description: "Uptime últimos 30 dias"
  },
  {
    name: "Banco de Dados",
    status: "online", 
    value: "Normal",
    icon: Database,
    description: "Conexões ativas: 45"
  },
  {
    name: "Conectividade",
    status: "online",
    value: "Estável",
    icon: Wifi,
    description: "Latência: 12ms"
  },
  {
    name: "Armazenamento",
    status: "warning",
    value: "75%",
    icon: HardDrive,
    description: "125GB de 500GB usados"
  }
];

const storageData = [
  { name: "Documentos", used: 45, color: "bg-blue-500" },
  { name: "Imagens", used: 30, color: "bg-green-500" },
  { name: "Backups", used: 15, color: "bg-amber-500" },
  { name: "Logs", used: 10, color: "bg-red-500" }
];

export function SystemHealth() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Status do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Geral */}
        <div className="grid grid-cols-1 gap-3">
          {systemMetrics.map((metric, index) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  metric.status === "online" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                }`}>
                  <metric.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-900">{metric.name}</h4>
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{metric.value}</span>
                {metric.status === "online" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Uso de Armazenamento */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-sm text-gray-900 mb-3">Distribuição de Armazenamento</h4>
          <div className="space-y-3">
            {storageData.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={item.used} className="w-16 h-2" />
                  <span className="text-xs text-gray-500 w-8">{item.used}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center pt-2">
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Sistema Operacional
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
