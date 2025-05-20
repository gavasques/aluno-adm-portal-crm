
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Partner } from "../PartnersTable";

interface DetailsTabProps {
  partner: Partner;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ partner }) => {
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
          <div className="col-span-3">
            <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
            <p className="mt-1 text-base">{partner.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailsTab;
