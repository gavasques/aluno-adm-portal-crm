
import { Supplier } from "@/types/supplier.types";

// Dados de exemplo
export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 1,
    name: "Distribuidor Nacional",
    category: "Produtos Diversos",
    categoryId: 1,
    rating: 4.7,
    comments: 12,
    cnpj: "12.345.678/0001-90",
    email: "contato@distribuidornacional.com",
    phone: "(11) 98765-4321",
    website: "www.distribuidornacional.com",
    address: "Av. Exemplo, 1000 - São Paulo/SP",
    logo: "DN",
    type: "Distribuidor",
    brands: ["Marca A", "Marca B"],
    status: "Ativo"
  },
  {
    id: 2,
    name: "Importadora Global",
    category: "Eletrônicos",
    categoryId: 2,
    rating: 4.2,
    comments: 8,
    cnpj: "98.765.432/0001-10",
    email: "contato@importadoraglobal.com",
    phone: "(11) 91234-5678",
    website: "www.importadoraglobal.com",
    address: "Rua Exemplo, 500 - São Paulo/SP",
    logo: "IG",
    type: "Importador",
    brands: ["Marca C", "Marca D"],
    status: "Ativo"
  },
  {
    id: 3,
    name: "Manufatura Express",
    category: "Vestuário",
    categoryId: 3,
    rating: 3.9,
    comments: 15,
    cnpj: "45.678.901/0001-23",
    email: "contato@manufaturaexpress.com",
    phone: "(11) 94567-8901",
    website: "www.manufaturaexpress.com",
    address: "Rua dos Exemplos, 200 - São Paulo/SP",
    logo: "ME",
    type: "Fabricante",
    brands: ["Marca E", "Marca F"],
    status: "Inativo"
  },
  {
    id: 4,
    name: "Tech Solution Distribuidora",
    category: "Tecnologia",
    categoryId: 2,
    rating: 4.5,
    comments: 23,
    cnpj: "34.567.890/0001-12",
    email: "contato@techsolution.com",
    phone: "(11) 93456-7890",
    website: "www.techsolution.com",
    address: "Av. Exemplar, 300 - São Paulo/SP",
    logo: "TS",
    type: "Distribuidor",
    brands: ["Marca G"],
    status: "Ativo"
  },
  {
    id: 5,
    name: "Eco Produtos",
    category: "Sustentáveis",
    categoryId: 3,
    rating: 4.8,
    comments: 19,
    cnpj: "23.456.789/0001-01",
    email: "contato@ecoprodutos.com",
    phone: "(11) 92345-6789",
    website: "www.ecoprodutos.com",
    address: "Rua Sustentável, 100 - São Paulo/SP",
    logo: "EP",
    type: "Fabricante",
    brands: ["Marca H", "Marca I"],
    status: "Ativo"
  }
];

// Categorias e Tipos de Fornecedor
export const CATEGORIES = [
  { id: 1, name: "Produtos Diversos" },
  { id: 2, name: "Eletrônicos" },
  { id: 3, name: "Vestuário" },
  { id: 4, name: "Tecnologia" },
  { id: 5, name: "Sustentáveis" },
];

export const SUPPLIER_TYPES = [
  "Fabricante", 
  "Distribuidor", 
  "Importador", 
  "Atacadista", 
  "Varejista", 
  "Representante"
];

// Extrair todas as marcas dos fornecedores
export const getAllBrands = (suppliers: Supplier[]): string[] => {
  const brandsSet = new Set<string>();
  suppliers.forEach(supplier => {
    if (supplier.brands && Array.isArray(supplier.brands)) {
      supplier.brands.forEach(brand => brandsSet.add(brand));
    }
  });
  return Array.from(brandsSet);
};
