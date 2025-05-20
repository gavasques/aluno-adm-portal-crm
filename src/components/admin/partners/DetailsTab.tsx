import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Partner } from "@/types/partner.types";

interface DetailsTabProps {
  partner: Partner;
  onEdit: (partner: Partner) => void;
}

const DetailsTab = ({ partner, onEdit }: DetailsTabProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Nome</h3>
            <p className="mt-1 text-base">{partner.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Categoria</h3>
            <p className="mt-1 text-base">{partner.category}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
            <p className="mt-1 text-base">{partner.type}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1 text-base">{partner.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
            <p className="mt-1 text-base">{partner.phone}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Website</h3>
            <p className="mt-1 text-base">
              <a href={`https://${partner.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {partner.website}
              </a>
            </p>
          </div>
          <div className="col-span-3">
            <h3 className="text-sm font-medium text-gray-500">Endereço</h3>
            <p className="mt-1 text-base">{partner.address}</p>
          </div>
          <div className="col-span-3">
            <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
            <p className="mt-1 text-base">{partner.description}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <Button 
            variant="outline"
            onClick={() => onEdit(partner)}
          >
            <Edit className="h-4 w-4 mr-2" /> Editar Parceiro
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailsTab;
