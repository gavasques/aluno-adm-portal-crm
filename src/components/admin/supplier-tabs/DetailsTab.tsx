
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Supplier } from "@/types/supplier.types";

interface DetailsTabProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  isAdmin?: boolean;
}

const DetailsTab = ({ supplier, onEdit, isAdmin = true }: DetailsTabProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Nome</h3>
            <p className="mt-1 text-base">{supplier.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Categoria</h3>
            <p className="mt-1 text-base">{supplier.category}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
            <p className="mt-1 text-base">{supplier.type}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">CNPJ</h3>
            <p className="mt-1 text-base">{supplier.cnpj}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1 text-base">{supplier.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
            <p className="mt-1 text-base">{supplier.phone}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Website</h3>
            <p className="mt-1 text-base">
              <a href={`https://${supplier.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {supplier.website}
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="mt-1 text-base">{supplier.status || "Ativo"}</p>
          </div>
          <div className="col-span-3">
            <h3 className="text-sm font-medium text-gray-500">Endereço</h3>
            <p className="mt-1 text-base">{supplier.address}</p>
          </div>
        </div>
        {isAdmin && (
          <div className="mt-6 flex justify-end space-x-2">
            <Button 
              variant="outline"
              onClick={() => onEdit(supplier)}
            >
              <Edit className="h-4 w-4 mr-2" /> Editar Fornecedor
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DetailsTab;
