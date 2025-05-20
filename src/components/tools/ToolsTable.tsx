
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowUp, ArrowDown } from "lucide-react";
import StatusBadge from "@/components/ui/status-badge";

export interface Tool {
  id: number;
  name: string;
  category: string;
  provider: string;
  rating: number;
  comments: number;
  logo: string;
  recommended?: boolean;
  notRecommended?: boolean;
  description: string;
  website: string;
  phone: string;
  email: string;
  status: string;
  coupons: string;
  contacts: Array<{
    id: number;
    name: string;
    role: string;
    email: string;
    phone: string;
    notes?: string;
  }>;
  comments_list: Array<{
    id: number;
    user: string;
    text: string;
    date: string;
    likes: number;
    replies: Array<{
      id: number;
      user: string;
      text: string;
      date: string;
      likes: number;
    }>;
  }>;
  ratings_list: Array<{
    id: number;
    user: string;
    rating: number;
    comment: string;
    date: string;
    likes: number;
  }>;
  files: Array<{
    id: number;
    name: string;
    type: string;
    size: string;
    date: string;
  }>;
  images: Array<{
    id: number;
    url: string;
    alt: string;
  }>;
}

interface ToolsTableProps {
  tools: Tool[];
  sortField: string;
  sortDirection: string;
  onSort: (field: string) => void;
  onOpenTool: (tool: Tool) => void;
}

const ToolsTable: React.FC<ToolsTableProps> = ({
  tools,
  sortField,
  sortDirection,
  onSort,
  onOpenTool,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="cursor-pointer" onClick={() => onSort("name")}>
            Nome
            {sortField === "name" && (
              sortDirection === "asc" ? 
                <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                <ArrowDown className="ml-1 h-4 w-4 inline" />
            )}
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort("category")}>
            Categoria
            {sortField === "category" && (
              sortDirection === "asc" ? 
                <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                <ArrowDown className="ml-1 h-4 w-4 inline" />
            )}
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort("provider")}>
            Fornecedor
            {sortField === "provider" && (
              sortDirection === "asc" ? 
                <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                <ArrowDown className="ml-1 h-4 w-4 inline" />
            )}
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort("rating")}>
            Avaliação
            {sortField === "rating" && (
              sortDirection === "asc" ? 
                <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                <ArrowDown className="ml-1 h-4 w-4 inline" />
            )}
          </TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tools.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              Nenhuma ferramenta encontrada com os filtros selecionados.
            </TableCell>
          </TableRow>
        ) : (
          tools.map((tool) => (
            <TableRow key={tool.id}>
              <TableCell className="font-medium">
                {tool.name}
                <div className="flex gap-2 mt-1">
                  {tool.recommended && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      Recomendada
                    </Badge>
                  )}
                  {tool.notRecommended && (
                    <Badge variant="destructive">
                      Não Recomendado (Corre)
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{tool.category}</TableCell>
              <TableCell>{tool.provider}</TableCell>
              <TableCell>
                <StatusBadge isActive={tool.status === "Ativo"} />
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{tool.rating}</span>
                  <span className="text-gray-400 ml-1">({tool.comments})</span>
                </div>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => onOpenTool(tool)}>
                  Ver Detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ToolsTable;
