
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

interface Comment {
  id: number;
  text: string;
  date: string;
  author: string;
}

interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  column: string;
  responsible: string;
  lastContact: string;
  comments: Comment[];
}

interface Column {
  id: string;
  name: string;
  color: string;
}

interface ListViewProps {
  filteredLeads: Lead[];
  columns: Column[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  openLeadDetails: (lead: Lead) => void;
}

const ListView = ({ 
  filteredLeads, 
  columns, 
  searchQuery, 
  onSearchChange, 
  openLeadDetails 
}: ListViewProps) => {
  return (
    <div>
      <div className="sticky top-0 z-10 bg-white border-b p-4">
        <div className="mb-4 w-full max-w-sm">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar leads..." 
              value={searchQuery} 
              onChange={e => onSearchChange(e.target.value)} 
              className="pl-8" 
            />
          </div>
        </div>
      </div>
      <div className="p-4">
        <ScrollArea className="h-[calc(100vh-350px)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Nome</th>
                  <th className="px-4 py-2 text-left">Empresa</th>
                  <th className="px-4 py-2 text-left">Responsável</th>
                  <th className="px-4 py-2 text-left">Estágio</th>
                  <th className="px-4 py-2 text-left">Último Contato</th>
                  <th className="px-4 py-2 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => {
                  const column = columns.find(col => col.id === lead.column);
                  return (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{lead.name}</td>
                      <td className="px-4 py-3">{lead.company}</td>
                      <td className="px-4 py-3">{lead.responsible}</td>
                      <td className="px-4 py-3">
                        {column && (
                          <span className={`px-2 py-1 rounded-full text-xs ${column.color}`}>
                            {column.name}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">{lead.lastContact}</td>
                      <td className="px-4 py-3">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openLeadDetails(lead)}
                        >
                          Ver Detalhes
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredLeads.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum lead encontrado com os critérios de busca.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ListView;
