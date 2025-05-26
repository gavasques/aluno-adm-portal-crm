
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'lucide-react';

const CheckoutTab: React.FC = () => {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-600">
      <CardHeader className="pb-4 bg-gradient-to-r from-green-100 to-emerald-100">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Link className="h-5 w-5 text-green-600" />
          🔗 Links de Checkout
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">Configure os links de pagamento para esta mentoria</p>
      </CardHeader>
      <CardContent className="text-center py-8">
        <div className="text-gray-500">
          <Link className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-sm font-medium">🚧 Funcionalidade em desenvolvimento</p>
          <p className="text-xs">Em breve você poderá configurar links de checkout</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutTab;
