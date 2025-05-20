
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, Users, Star, MessageCircle, Trash } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import SupplierDetail from "@/components/student/SupplierDetail";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Esquema de validação com zod para o formulário de fornecedor
const supplierSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  category: z.string().min(2, { message: "A categoria é obrigatória" }),
  cnpj: z.string().optional(),
  email: z.string().email({ message: "Email inválido" }).optional().or(z.literal("")),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  type: z.string()
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

// Definindo interfaces para manter consistência de tipos
interface Comment {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  date: string;
  likes: number;
  userLiked: boolean;
  replies: {
    id: number;
    userId: number;
    userName: string;
    userAvatar: string;
    content: string;
    date: string;
  }[];
}

interface Supplier {
  id: number;
  name: string;
  category: string;
  rating: number;
  commentCount: number; // Número de comentários
  logo: string;
  cnpj: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  type: string;
  brands: any[];
  branches: any[];
  contacts: any[];
  communications: any[];
  files: any[];
  commentItems: Comment[]; // Array com os comentários
  ratings: any[];
  images: any[];
}

// Sample data for my suppliers
const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 1,
    name: "Meu Fornecedor Local",
    category: "Produtos Regionais",
    rating: 4.5,
    commentCount: 3,
    logo: "ML",
    cnpj: "12.345.678/0001-90",
    email: "contato@meufornecedor.com",
    phone: "(11) 98765-4321",
    website: "www.meufornecedor.com",
    address: "Av. Exemplo, 1000 - São Paulo/SP",
    type: "Distribuidor",
    brands: [
      { id: 1, name: "Marca Regional", description: "Produtos locais" }
    ],
    branches: [
      { id: 1, name: "Filial SP Centro", address: "Rua Central, 123 - São Paulo/SP", phone: "(11) 3456-7890", email: "centro@meufornecedor.com" }
    ],
    contacts: [
      { id: 1, name: "João Silva", role: "Gerente Comercial", phone: "(11) 97654-3210", email: "joao@meufornecedor.com" }
    ],
    communications: [
      { id: 1, date: "2023-05-15", type: "Reunião", notes: "Discutimos novos produtos", contact: "João Silva" }
    ],
    files: [
      { id: 1, name: "Catálogo 2023", type: "PDF", size: "2.5MB", date: "2023-04-10" }
    ],
    commentItems: [ 
      { 
        id: 1, 
        userId: 1, 
        userName: "Maria Oliveira", 
        userAvatar: "", 
        content: "Ótima qualidade de produtos e entrega rápida.", 
        date: "2023-06-10T10:30:00", 
        likes: 3, 
        userLiked: true, 
        replies: [
          { 
            id: 11, 
            userId: 2, 
            userName: "Carlos Silva", 
            userAvatar: "", 
            content: "Concordo! Serviço excelente.", 
            date: "2023-06-10T14:45:00" 
          }
        ] 
      }
    ],
    ratings: [
      { 
        id: 1, 
        userId: 3, 
        userName: "Pedro Santos", 
        rating: 5, 
        comment: "Produtos de alta qualidade e atendimento impecável.", 
        date: "2023-05-20T09:15:00", 
        likes: 2, 
        userLiked: false 
      }
    ],
    images: [
      { 
        id: 1, 
        name: "Fachada da loja", 
        src: "https://images.unsplash.com/photo-1472851294608-062f824d29cc", 
        date: "2023-04-05", 
        type: "JPEG", 
        size: "1.2MB" 
      }
    ]
  }
];

const MySuppliers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Configurar react-hook-form com validação zod
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      category: "",
      cnpj: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      type: "Distribuidor"
    }
  });
  
  // Filter suppliers based on search query
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddSupplier = (data: SupplierFormValues) => {
    setIsSubmitting(true);
    
    // Simular um atraso de rede
    setTimeout(() => {
      // Create new supplier with all required properties
      const supplier: Supplier = {
        id: Date.now(),
        name: data.name,
        category: data.category,
        email: data.email || "",
        phone: data.phone || "",
        website: data.website || "",
        cnpj: data.cnpj || "",
        address: data.address || "",
        type: data.type || "Distribuidor",
        rating: 0,
        commentCount: 0,
        logo: data.name.substring(0, 2).toUpperCase(),
        brands: [],
        branches: [],
        contacts: [],
        communications: [],
        files: [],
        images: [],
        ratings: [],
        commentItems: []
      };
      
      setSuppliers([...suppliers, supplier]);
      toast.success(`${data.name} foi adicionado com sucesso.`);
      
      // Reset form and close dialog
      form.reset();
      setIsAddDialogOpen(false);
      setIsSubmitting(false);
    }, 500);
  };
  
  const handleDeleteSupplier = (id: number) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    toast.success("Fornecedor excluído com sucesso.");
  };

  const handleUpdateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === updatedSupplier.id ? updatedSupplier : supplier
    ));
    setSelectedSupplier(updatedSupplier);
    toast.success("Fornecedor atualizado com sucesso!");
  };
  
  return (
    <div className="container mx-auto py-6">
      {!selectedSupplier ? (
        <>
          <h1 className="text-3xl font-bold mb-8 text-portal-dark">Meus Fornecedores</h1>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar meus fornecedores..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Fornecedor
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card 
                key={supplier.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
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
                      {supplier.commentCount}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setSelectedSupplier(supplier)}
                    >
                      Gerenciar
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir fornecedor</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir {supplier.name}? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteSupplier(supplier.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add Supplier Card */}
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed" onClick={() => setIsAddDialogOpen(true)}>
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                <div className="w-14 h-14 rounded-full bg-portal-light flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-portal-primary" />
                </div>
                <h3 className="font-medium text-lg text-portal-primary mb-2">Adicionar Novo Fornecedor</h3>
                <p className="text-sm text-gray-500 text-center">
                  Clique aqui para cadastrar um novo fornecedor em sua lista
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <SupplierDetail 
          supplier={selectedSupplier} 
          onBack={() => setSelectedSupplier(null)}
          onUpdate={handleUpdateSupplier}
        />
      )}
      
      {/* Add Supplier Dialog with form validation */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Fornecedor</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddSupplier)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome*</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do fornecedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria*</FormLabel>
                    <FormControl>
                      <Input placeholder="Categoria principal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input placeholder="00.000.000/0000-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="www.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, número, bairro - cidade/estado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="Distribuidor">Distribuidor</option>
                        <option value="Fabricante">Fabricante</option>
                        <option value="Importador">Importador</option>
                        <option value="Atacadista">Atacadista</option>
                        <option value="Varejista">Varejista</option>
                        <option value="Representante">Representante</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => {
                    form.reset();
                    setIsAddDialogOpen(false);
                  }}
                  className="mr-2"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adicionando..." : "Adicionar Fornecedor"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MySuppliers;
