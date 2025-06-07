
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, ExternalLink, Star, Award } from 'lucide-react';

const Partners = () => {
  const partners = [
    {
      id: 1,
      name: "EduTech Academy",
      type: "Educacional",
      description: "Plataforma de cursos online com foco em tecnologia",
      benefits: ["20% desconto em cursos", "Acesso antecipado", "Certificados gratuitos"],
      rating: 4.9,
      featured: true
    },
    {
      id: 2,
      name: "Business Hub",
      type: "Networking",
      description: "Rede de networking para empreendedores",
      benefits: ["Eventos exclusivos", "Mentoring gratuito", "Acesso ao coworking"],
      rating: 4.7,
      featured: false
    },
    {
      id: 3,
      name: "InnovaTools",
      type: "Ferramentas",
      description: "Suite de ferramentas para gestão empresarial",
      benefits: ["50% desconto no primeiro ano", "Suporte prioritário", "Treinamento gratuito"],
      rating: 4.8,
      featured: true
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parceiros</h1>
          <p className="text-gray-600">Descubra benefícios exclusivos com nossos parceiros</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner) => (
          <Card key={partner.id} className={`hover:shadow-lg transition-shadow ${
            partner.featured ? 'ring-2 ring-blue-500' : ''
          }`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {partner.name}
                    {partner.featured && (
                      <Award className="h-4 w-4 text-yellow-500" />
                    )}
                  </CardTitle>
                  <Badge variant="outline" className="mt-2">
                    {partner.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">{partner.rating}</span>
                </div>
              </div>
              {partner.featured && (
                <Badge variant="default" className="w-fit">
                  Parceiro Destaque
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>{partner.description}</CardDescription>
              
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Benefícios:</h4>
                <ul className="space-y-1">
                  {partner.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <Button className="w-full" variant={partner.featured ? "default" : "outline"}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Acessar Benefícios
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Partners;
