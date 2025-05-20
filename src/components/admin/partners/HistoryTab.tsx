
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Partner } from "@/hooks/usePartnersState";

interface HistoryTabProps {
  partner: Partner;
}

const HistoryTab = ({ partner }: HistoryTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Histórico</CardTitle>
      </CardHeader>
      <CardContent>
        {partner.history && partner.history.length > 0 ? (
          <div className="space-y-4">
            {partner.history.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <div className="font-medium">{item.action}</div>
                  <div className="text-sm text-gray-500">Por: {item.user}</div>
                </div>
                <div className="text-sm text-gray-500">{item.date}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">
            Nenhum histórico disponível.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryTab;
