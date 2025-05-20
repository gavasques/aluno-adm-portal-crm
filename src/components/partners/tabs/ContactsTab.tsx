
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Partner } from "../PartnersTable";

interface ContactsTabProps {
  partner: Partner;
}

const ContactsTab: React.FC<ContactsTabProps> = ({ partner }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Contatos</CardTitle>
      </CardHeader>
      <CardContent>
        {partner.contacts && partner.contacts.length > 0 ? (
          <div className="space-y-4">
            {partner.contacts.map((contact, index) => (
              <div key={index} className="border p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                    <p className="mt-1">{contact.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Cargo</h3>
                    <p className="mt-1">{contact.role}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1">{contact.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                    <p className="mt-1">{contact.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">Nenhum contato cadastrado.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactsTab;
