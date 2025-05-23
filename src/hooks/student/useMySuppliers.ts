
import { useState } from "react";
import { toast } from "sonner";
import { MySupplier, SupplierFormValues } from "@/types/my-suppliers.types";

// Sample data for my suppliers
const INITIAL_SUPPLIERS: MySupplier[] = [
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
      { id: 1, name: "Filial SP Centro", address: "Rua Central, 123 - São Paulo/SP", phone: "(11) 3456-7890", email: "centro@meufornecedor.com", cnpj: "12.345.678/0002-71" }
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

export const useMySuppliers = () => {
  const [suppliers, setSuppliers] = useState<MySupplier[]>(INITIAL_SUPPLIERS);
  const [selectedSupplier, setSelectedSupplier] = useState<MySupplier | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [cnpjFilter, setCnpjFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [contactFilter, setContactFilter] = useState("");
  const [sortField, setSortField] = useState<"name" | "category">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Filter suppliers based on search filters
  const filteredSuppliers = suppliers.filter(supplier => {
    // Nome do Fornecedor
    const nameMatch = supplier.name.toLowerCase().includes(nameFilter.toLowerCase());
    
    // CNPJ do Fornecedor ou Filial
    const cnpjMatch = supplier.cnpj.replace(/\D/g, "").includes(cnpjFilter.replace(/\D/g, "")) || 
                      supplier.branches.some(branch => 
                        branch.cnpj && branch.cnpj.replace(/\D/g, "").includes(cnpjFilter.replace(/\D/g, "")));
    
    // Marcas
    const brandMatch = brandFilter === "" || 
                       supplier.brands.some(brand => 
                         brand.name.toLowerCase().includes(brandFilter.toLowerCase()));
    
    // Nome do contato
    const contactMatch = contactFilter === "" || 
                         supplier.contacts.some(contact => 
                           contact.name.toLowerCase().includes(contactFilter.toLowerCase()));
    
    return nameMatch && cnpjMatch && brandMatch && contactMatch;
  });
  
  // Sort suppliers
  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else {
      return sortDirection === "asc" 
        ? a.category.localeCompare(b.category) 
        : b.category.localeCompare(a.category);
    }
  });
  
  const handleSort = (field: "name" | "category") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const handleAddSupplier = () => {
    setShowForm(true);
  };
  
  const handleSubmit = (data: SupplierFormValues) => {
    setIsSubmitting(true);
    
    // Simular um atraso de rede
    setTimeout(() => {
      // Create new supplier with all required properties
      const supplier: MySupplier = {
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
      
      setShowForm(false);
      setIsSubmitting(false);
    }, 500);
  };
  
  const handleCancel = () => {
    setShowForm(false);
  };
  
  const handleDeleteSupplier = (id: number) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    toast.success("Fornecedor excluído com sucesso.");
  };

  const handleUpdateSupplier = (updatedSupplier: MySupplier) => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === updatedSupplier.id ? updatedSupplier : supplier
    ));
    setSelectedSupplier(updatedSupplier);
    toast.success("Fornecedor atualizado com sucesso!");
  };
  
  // Função para limpar os filtros
  const clearFilters = () => {
    setNameFilter("");
    setCnpjFilter("");
    setBrandFilter("");
    setContactFilter("");
  };
  
  return {
    suppliers: sortedSuppliers,
    selectedSupplier,
    setSelectedSupplier,
    showForm,
    setShowForm,
    isSubmitting,
    nameFilter,
    setNameFilter,
    cnpjFilter,
    setCnpjFilter,
    brandFilter,
    setBrandFilter,
    contactFilter,
    setContactFilter,
    sortField,
    sortDirection,
    handleSort,
    handleAddSupplier,
    handleSubmit,
    handleCancel,
    handleDeleteSupplier,
    handleUpdateSupplier,
    clearFilters
  };
};
