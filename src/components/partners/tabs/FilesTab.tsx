
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Partner } from "../PartnersTable";

interface FilesTabProps {
  partner: Partner;
}

const FilesTab: React.FC<FilesTabProps> = ({ partner }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Arquivos</CardTitle>
      </CardHeader>
      <CardContent>
        {partner.files && partner.files.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partner.files.map((file, index) => (
              <div key={index} className="border p-4 rounded-md flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">{file.size}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-center py-4 text-gray-500">
              Nenhum arquivo disponível.
            </p>
            <div className="mt-4 flex justify-center">
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Adicionar Arquivo
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilesTab;
