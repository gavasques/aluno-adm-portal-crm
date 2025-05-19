
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Users,
  Star,
  MessageCircle,
  Building,
  Tag,
  Phone,
  File,
} from "lucide-react";

// Sample data
const SUPPLIERS = [
  {
    id: 1,
    name: "Distribuidor Nacional",
    category: "Produtos Diversos",
    rating: 4.7,
    comments: 12,
    logo: "DN"
  },
  {
    id: 2,
    name: "Importadora Global",
    category: "Eletrônicos",
    rating: 4.2,
    comments: 8,
    logo: "IG"
  },
  {
    id: 3,
    name: "Manufatura Express",
    category: "Vestuário",
    rating: 3.9,
    comments: 15,
    logo: "ME"
  },
  {
    id: 4,
    name: "Tech Solution Distribuidora",
    category: "Tecnologia",
    rating: 4.5,
    comments: 23,
    logo: "TS"
  },
  {
    id: 5,
    name: "Eco Produtos",
    category: "Sustentáveis",
    rating: 4.8,
    comments: 19,
    logo: "EP"
  }
];

const SupplierDetails = ({ supplier, onBack }: { supplier: any, onBack: () => void }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={onBack}>Voltar para lista</Button>
        <div className="flex items-center">
          <div className="flex items-center text-yellow-500 mr-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                className="mr-0.5" 
                fill={i < Math.floor(supplier.rating) ? "currentColor" : "none"} 
              />
            ))}
            <span className="ml-1 text-gray-600">({supplier.rating})</span>
          </div>
          <Button variant="outline" size="sm" className="flex items-center">
            <Star className="mr-1 h-4 w-4" /> Avaliar
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-portal-primary text-white flex items-center justify-center text-xl font-bold">
              {supplier.logo}
            </div>
            <div>
              <CardTitle className="text-2xl">{supplier.name}</CardTitle>
              <p className="text-gray-500">{supplier.category}</p>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="info">
        <TabsList className="mb-6">
          <TabsTrigger value="info" className="flex items-center gap-1">
            <Users className="h-4 w-4" /> Dados
          </TabsTrigger>
          <TabsTrigger value="branches" className="flex items-center gap-1">
            <Building className="h-4 w-4" /> Filiais
          </TabsTrigger>
          <TabsTrigger value="brands" className="flex items-center gap-1">
            <Tag className="h-4 w-4" /> Marcas
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-1">
            <Phone className="h-4 w-4" /> Contatos
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-1">
            <File className="h-4 w-4" /> Arquivos
          </TabsTrigger>
          <TabsTrigger value="ratings" className="flex items-center gap-1">
            <Star className="h-4 w-4" /> Avaliações
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" /> Comentários
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Fornecedor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nome</p>
                  <p className="font-medium">{supplier.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Categoria</p>
                  <p className="font-medium">{supplier.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">CNPJ</p>
                  <p className="font-medium">00.000.000/0001-00</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Endereço</p>
                  <p className="font-medium">Avenida Exemplo, 1000 - São Paulo/SP</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Telefone</p>
                  <p className="font-medium">(11) 99999-9999</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">E-mail</p>
                  <p className="font-medium">contato@exemplo.com</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Site</p>
                  <p className="font-medium text-portal-primary">www.exemplo.com</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Avaliação</p>
                  <div className="flex items-center">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className="mr-0.5" 
                          fill={i < Math.floor(supplier.rating) ? "currentColor" : "none"} 
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-gray-600">({supplier.rating})</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="branches">
          <Card>
            <CardHeader>
              <CardTitle>Filiais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p>Lista de filiais do fornecedor.</p>
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium">Filial São Paulo</h3>
                    <p className="text-sm text-gray-500">Avenida Paulista, 1000 - São Paulo/SP</p>
                    <p className="text-sm text-gray-500">contato@filial.com</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium">Filial Rio de Janeiro</h3>
                    <p className="text-sm text-gray-500">Avenida Atlântica, 500 - Rio de Janeiro/RJ</p>
                    <p className="text-sm text-gray-500">rio@filial.com</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Comentários</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-portal-light text-portal-primary flex items-center justify-center font-medium">
                  JD
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium">João da Silva</h4>
                      <span className="text-xs text-gray-500">2 dias atrás</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Fornecedor excelente! Produtos de qualidade e entrega rápida. Recomendo a todos.
                    </p>
                  </div>
                  <div className="flex items-center mt-2 ml-2 text-sm text-gray-600">
                    <button className="flex items-center hover:text-portal-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                      </svg>
                      <span>3 Curtidas</span>
                    </button>
                    <button className="flex items-center ml-4 hover:text-portal-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span>Responder</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-portal-light text-portal-primary flex items-center justify-center font-medium">
                  MR
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium">Maria Rodrigues</h4>
                      <span className="text-xs text-gray-500">1 semana atrás</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Tive problema com um produto e o fornecedor resolveu rapidamente. Atendimento eficiente!
                    </p>
                  </div>
                  <div className="flex items-center mt-2 ml-2 text-sm text-gray-600">
                    <button className="flex items-center hover:text-portal-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                      </svg>
                      <span>1 Curtida</span>
                    </button>
                    <button className="flex items-center ml-4 hover:text-portal-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span>Responder</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Adicionar Comentário</h4>
                <textarea 
                  className="portal-input min-h-[100px]"
                  placeholder="Escreva seu comentário..."
                ></textarea>
                <div className="flex justify-end mt-2">
                  <Button>Publicar Comentário</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ratings">
          <Card>
            <CardHeader>
              <CardTitle>Avaliações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 mr-6 text-center">
                  <div className="text-5xl font-bold text-portal-primary">{supplier.rating}</div>
                  <div className="flex items-center justify-center text-yellow-500 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className="mr-0.5" 
                        fill={i < Math.floor(supplier.rating) ? "currentColor" : "none"} 
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{supplier.comments} avaliações</div>
                </div>
                
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center mb-1">
                      <span className="text-sm text-gray-500 w-4">{rating}</span>
                      <Star size={14} className="text-yellow-500 mx-1" fill="currentColor" />
                      <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-yellow-500 rounded-full"
                          style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : 10}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {rating === 5 ? '70%' : rating === 4 ? '20%' : '10%'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Sua Avaliação</h3>
                <div className="flex items-center mb-4">
                  <span className="text-sm text-gray-500 mr-2">Nota:</span>
                  <div className="flex items-center text-gray-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={24} className="mr-1 cursor-pointer hover:text-yellow-500" />
                    ))}
                  </div>
                </div>
                <textarea 
                  className="portal-input min-h-[100px] mb-4"
                  placeholder="Descreva sua experiência com este fornecedor..."
                ></textarea>
                <div className="flex justify-end">
                  <Button>Enviar Avaliação</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Implement other tabs as needed */}
        <TabsContent value="brands">
          <Card>
            <CardHeader>
              <CardTitle>Marcas</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Informações sobre marcas serão exibidas aqui.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                <Card className="p-4">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded bg-portal-light flex items-center justify-center mx-auto">
                      <span className="text-lg font-bold text-portal-primary">M1</span>
                    </div>
                    <h3 className="mt-2 font-medium">Marca A</h3>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded bg-portal-light flex items-center justify-center mx-auto">
                      <span className="text-lg font-bold text-portal-primary">M2</span>
                    </div>
                    <h3 className="mt-2 font-medium">Marca B</h3>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Contatos</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Lista de contatos do fornecedor.</p>
              <div className="space-y-4 mt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-portal-light flex items-center justify-center mr-3">
                        <span className="font-medium text-portal-primary">RS</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Roberto Santos</h3>
                        <p className="text-sm text-gray-500">Gerente Comercial</p>
                        <p className="text-sm text-gray-500">roberto@exemplo.com | (11) 99999-8888</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-portal-light flex items-center justify-center mr-3">
                        <span className="font-medium text-portal-primary">AL</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Ana Lima</h3>
                        <p className="text-sm text-gray-500">Atendimento ao Cliente</p>
                        <p className="text-sm text-gray-500">ana@exemplo.com | (11) 99999-7777</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Arquivos</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Arquivos disponíveis para este fornecedor.</p>
              <div className="space-y-4 mt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded bg-portal-light flex items-center justify-center mr-3">
                        <File className="h-5 w-5 text-portal-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Catálogo de Produtos.pdf</h3>
                        <p className="text-sm text-gray-500">2.3 MB • Adicionado em 15/04/2023</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded bg-portal-light flex items-center justify-center mr-3">
                        <File className="h-5 w-5 text-portal-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Tabela de Preços.xlsx</h3>
                        <p className="text-sm text-gray-500">1.5 MB • Adicionado em 10/03/2023</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Suppliers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  
  // Filter suppliers based on search query
  const filteredSuppliers = SUPPLIERS.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Fornecedores</h1>
      
      {!selectedSupplier ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar fornecedores..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card 
                key={supplier.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedSupplier(supplier)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-14 h-14 rounded-lg bg-portal-primary text-white flex items-center justify-center text-xl font-bold">
                      {supplier.logo}
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{supplier.name}</h3>
                      <p className="text-sm text-gray-500">{supplier.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className="mr-0.5" 
                          fill={i < Math.floor(supplier.rating) ? "currentColor" : "none"} 
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-600">({supplier.rating})</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500 text-sm">
                      <MessageCircle size={16} className="mr-1" />
                      {supplier.comments}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <SupplierDetails 
          supplier={selectedSupplier}
          onBack={() => setSelectedSupplier(null)}
        />
      )}
    </div>
  );
};

export default Suppliers;
