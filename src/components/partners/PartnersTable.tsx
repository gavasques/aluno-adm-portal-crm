
import React from "react";
import { motion } from "framer-motion";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Eye, HandHeart } from "lucide-react";
import { Partner } from "@/types/partner.types";

interface PartnersTableProps {
  partners: Partner[];
  onSelectPartner: (partner: Partner) => void;
  isAdmin: boolean;
}

const PartnersTable: React.FC<PartnersTableProps> = ({ 
  partners, 
  onSelectPartner,
  isAdmin
}) => {
  const calculateAverageRating = (ratings: any[]) => {
    if (!ratings || ratings.length === 0) return "0.0";
    const sum = ratings.reduce((acc, item) => acc + item.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  if (partners.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-gray-100">
              <HandHeart className="h-12 w-12 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum parceiro encontrado
              </h3>
              <p className="text-gray-500">
                Não há parceiros que correspondam aos critérios de busca.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b bg-gray-50/50">
                <TableHead className="font-semibold text-gray-900">Nome</TableHead>
                <TableHead className="font-semibold text-gray-900">Categoria</TableHead>
                <TableHead className="font-semibold text-gray-900">Tipo</TableHead>
                <TableHead className="font-semibold text-gray-900">Avaliação</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.map((partner, index) => (
                <motion.tr
                  key={partner.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="cursor-pointer hover:bg-blue-50/50 transition-colors border-b border-gray-100"
                  onClick={() => onSelectPartner(partner)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center text-white font-semibold text-sm">
                        {partner.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{partner.name}</span>
                        {partner.recommended && (
                          <Badge className="bg-green-100 text-green-700 border-green-200 w-fit text-xs mt-1">
                            <Star className="h-3 w-3 mr-1" />
                            Recomendado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {partner.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {partner.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">{calculateAverageRating(partner.ratings)}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {partner.ratings?.length || 0} avaliações
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`${
                        partner.recommended 
                          ? "bg-green-100 text-green-700 border-green-200" 
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {partner.recommended ? "Ativo" : "Padrão"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPartner(partner);
                      }}
                      className="hover:bg-blue-50 text-blue-600"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PartnersTable;
