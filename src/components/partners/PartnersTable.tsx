
import React from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export interface Partner {
  id: number;
  name: string;
  category: string;
  type: string;
  rating: number;
  commentCount: number;
  recommended: boolean;
  contacts: {
    name: string;
    role: string;
    email: string;
    phone: string;
  }[];
  description: string;
  ratings: {
    id: number;
    user: string;
    rating: number;
    comment: string;
    likes: number;
  }[];
  comments: {
    id: number;
    user: string;
    text: string;
    date: string;
    likes: number;
  }[];
  files: any[];
  history: any[];
}

interface PartnersTableProps {
  partners: Partner[];
  onViewDetails: (partner: Partner) => void;
  calculateAverageRating: (ratings: any[]) => string;
}

const PartnersTable: React.FC<PartnersTableProps> = ({ 
  partners, 
  onViewDetails,
  calculateAverageRating 
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Avaliação</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                Nenhum parceiro encontrado com os filtros aplicados.
              </TableCell>
            </TableRow>
          ) : (
            partners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {partner.name}
                    {partner.recommended && (
                      <Badge className="bg-green-500">Recomendado</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{partner.category}</TableCell>
                <TableCell>{partner.type}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{calculateAverageRating(partner.ratings)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onViewDetails(partner)}
                  >
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PartnersTable;
