
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Plus, 
  Handshake, 
  TrendingUp, 
  Users, 
  Star,
  ExternalLink,
  Package
} from 'lucide-react';
import PartnersTable from '@/components/admin/partners/PartnersTable';

// Mock data para demonstração
const mockPartners = [
  {
    id: 1,
    name: "EduTech Academy",
    category: "Educacional",
    type: "Instituição",
    contact: "contato@edutech.com",
    description: "Plataforma de cursos online com foco em tecnologia",
    website: "www.edutech.com",
    benefits: ["20% desconto em cursos", "Acesso antecipado", "Certificados gratuitos"],
    ratings: [{ rating: 4.9, user: "user1" }, { rating: 4.8, user: "user2" }],
    recommended: true,
    status: "Ativo"
  },
  {
    id: 2,
    name: "Business Hub",
    category: "Networking",
    type: "Comunidade",
    contact: "info@businesshub.com",
    description: "Rede de networking para empreendedores",
    website: "www.businesshub.com",
    benefits: ["Eventos exclusivos", "Mentoring gratuito", "Acesso ao coworking"],
    ratings: [{ rating: 4.7, user: "user3" }, { rating: 4.6, user: "user4" }],
    recommended: false,
    status: "Ativo"
  },
  {
    id: 3,
    name: "InnovaTools",
    category: "Tecnologia",
    type: "Software",
    contact: "vendas@innovatools.com",
    description: "Suite de ferramentas para gestão empresarial",
    website: "www.innovatools.com",
    benefits: ["50% desconto no primeiro ano", "Suporte prioritário", "Treinamento gratuito"],
    ratings: [{ rating: 4.8, user: "user5" }, { rating: 4.9, user: "user6" }],
    recommended: true,
    status: "Ativo"
  }
];

const PartnersPage = () => {
  const [partners, setPartners] = useState(mockPartners);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filtered partners
  const filteredPartners = useMemo(() => {
    return partners.filter(partner => {
      const matchesSearch = 
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(partner.category);
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(partner.type);
      
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [partners, searchQuery, selectedCategories, selectedTypes]);

  // Stats
  const totalPartners = partners.length;
  const activePartners = partners.filter(p => p.status === "Ativo").length;
  const recommendedPartners = partners.filter(p => p.recommended).length;
  const averageRating = partners.reduce((acc, p) => {
    const partnerAvg = p.ratings.reduce((sum, r) => sum + r.rating, 0) / p.ratings.length;
    return acc + partnerAvg;
  }, 0) / partners.length;

  const calculateAverageRating = (ratings: any[]) => {
    if (!ratings || ratings.length === 0) return "0.0";
    const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    return average.toFixed(1);
  };

  const handleOpenPartner = (partner: any) => {
    setSelectedPartner(partner);
    setIsDetailModalOpen(true);
  };

  const handleEditPartner = (partner: any) => {
    console.log('Edit partner:', partner);
    // Implementar modal de edição
  };

  const toggleRecommendedStatus = (partnerId: number) => {
    setPartners(prev => prev.map(p => 
      p.id === partnerId ? { ...p, recommended: !p.recommended } : p
    ));
  };

  const handleDeletePartner = (partnerId: number) => {
    setPartners(prev => prev.filter(p => p.id !== partnerId));
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Parceiros
            </h1>
            <p className="text-muted-foreground">
              Gerencie todos os parceiros cadastrados na plataforma
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Parceiro
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <Handshake className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{totalPartners}</div>
                  <div className="text-sm text-gray-600">Total de Parceiros</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{activePartners}</div>
                  <div className="text-sm text-gray-600">Parceiros Ativos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Avaliação Média</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-violet-600 text-white">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{recommendedPartners}</div>
                  <div className="text-sm text-gray-600">Recomendados</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-md mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar parceiros..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Partners Table */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Lista de Parceiros
              <Badge variant="secondary" className="ml-2">
                {filteredPartners.length} de {totalPartners}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <PartnersTable
              partners={filteredPartners}
              calculateAverageRating={calculateAverageRating}
              handleOpenPartner={handleOpenPartner}
              handleEditPartner={handleEditPartner}
              toggleRecommendedStatus={toggleRecommendedStatus}
              handleDeletePartner={handleDeletePartner}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PartnersPage;
