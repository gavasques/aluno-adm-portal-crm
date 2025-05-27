
import React from "react";
import { Partner } from "@/types/partner.types";

interface DetailsTabProps {
  partner: Partner;
}

export const DetailsTab: React.FC<DetailsTabProps> = ({ partner }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Nome:</label>
          <p className="text-sm text-gray-600">{partner.name}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Categoria:</label>
          <p className="text-sm text-gray-600">{partner.category}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Tipo:</label>
          <p className="text-sm text-gray-600">{partner.type}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Contato:</label>
          <p className="text-sm text-gray-600">{partner.contact}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Telefone:</label>
          <p className="text-sm text-gray-600">{partner.phone}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Email:</label>
          <p className="text-sm text-gray-600">{partner.email}</p>
        </div>
      </div>
      {partner.address && (
        <div>
          <label className="text-sm font-medium">Endereço:</label>
          <p className="text-sm text-gray-600">{partner.address}</p>
        </div>
      )}
      {partner.description && (
        <div>
          <label className="text-sm font-medium">Descrição:</label>
          <p className="text-sm text-gray-600">{partner.description}</p>
        </div>
      )}
      {partner.website && (
        <div>
          <label className="text-sm font-medium">Website:</label>
          <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
            {partner.website}
          </a>
        </div>
      )}
    </div>
  );
};
