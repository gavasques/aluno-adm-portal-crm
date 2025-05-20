
import { Partner } from "@/types/partner.types";

export const initialPartnersData: Partner[] = [
  { 
    id: 1, 
    name: "Consultoria XYZ", 
    category: "Consultoria", 
    type: "Agência",
    contact: "João Silva", 
    phone: "(11) 98765-4321", 
    email: "contato@consultoriaxyz.com", 
    address: "Av. Paulista, 1000 - São Paulo, SP", 
    description: "Consultoria especializada em comércio eletrônico e marketing digital.",
    website: "www.consultoriaxyz.com",
    recommended: true,
    ratings: [
      { id: 1, user: "Ana Carolina", rating: 4, comment: "Ótima parceria, sempre disponíveis para ajudar.", likes: 2 },
      { id: 2, user: "Pedro Santos", rating: 5, comment: "Excelente atendimento e resultados.", likes: 0 }
    ],
    comments: [
      { id: 1, user: "Maria Oliveira", text: "Vocês poderiam compartilhar mais detalhes sobre os serviços deste parceiro?", date: "15/05/2025", likes: 3 },
      { id: 2, user: "Carlos Mendes", text: "Tive uma ótima experiência com eles no meu projeto de e-commerce.", date: "12/05/2025", likes: 2, replies: [
        { id: 1, user: "Ana Silva", text: "Qual serviço você contratou com eles?", date: "13/05/2025" }
      ] }
    ],
    contacts: [
      { id: 1, name: "João Silva", role: "Gerente de Contas", email: "joao@consultoriaxyz.com", phone: "(11) 98765-4321" },
      { id: 2, name: "Maria Oliveira", role: "Diretora de Projetos", email: "maria@consultoriaxyz.com", phone: "(11) 91234-5678" }
    ],
    files: [],
    history: [
      { id: 1, action: "Parceiro adicionado", user: "Admin", date: "10/05/2025" },
      { id: 2, action: "Marcado como recomendado", user: "Admin", date: "11/05/2025" },
      { id: 3, action: "Contato adicionado: João Silva", user: "Admin", date: "12/05/2025" }
    ]
  },
  { 
    id: 2, 
    name: "Marketing Digital Pro", 
    category: "Marketing", 
    type: "Consultor",
    contact: "Maria Oliveira", 
    phone: "(11) 91234-5678", 
    email: "contato@marketingdigitalpro.com", 
    address: "Rua Augusta, 500 - São Paulo, SP", 
    description: "Agência especializada em marketing digital para e-commerce.",
    website: "www.marketingdigitalpro.com",
    recommended: false,
    ratings: [
      { id: 1, user: "João Silva", rating: 5, comment: "Estratégias eficientes e resultados rápidos.", likes: 1 },
      { id: 2, user: "Ana Carolina", rating: 4, comment: "Boa comunicação e entregas no prazo.", likes: 0 }
    ],
    comments: [
      { id: 1, user: "Roberto Almeida", text: "Alguém já trabalhou com eles em campanhas para Facebook?", date: "10/05/2025", likes: 1 }
    ],
    contacts: [
      { id: 1, name: "Maria Oliveira", role: "Diretora", email: "maria@marketingpro.com", phone: "(11) 91234-5678" }
    ],
    files: [
      { id: 1, name: "Apresentação.pdf", size: "2.5 MB", uploadedBy: "Admin", date: "15/05/2025" }
    ],
    history: [
      { id: 1, action: "Parceiro adicionado", user: "Admin", date: "05/05/2025" },
      { id: 2, action: "Arquivo adicionado: Apresentação.pdf", user: "Admin", date: "15/05/2025" }
    ]
  },
  { 
    id: 3, 
    name: "Logística Express", 
    category: "Logística", 
    type: "Serviço",
    contact: "Carlos Mendes", 
    phone: "(11) 93333-4444", 
    email: "contato@logisticaexpress.com", 
    address: "Av. das Nações Unidas, 2000 - São Paulo, SP", 
    description: "Soluções logísticas completas para e-commerce.",
    website: "www.logisticaexpress.com",
    recommended: true,
    ratings: [
      { id: 1, user: "Pedro Santos", rating: 3, comment: "Bom serviço, mas prazos de entrega podem melhorar.", likes: 0 }
    ],
    comments: [
      { id: 1, user: "Amanda Costa", text: "Eles atendem entregas para todo o Brasil?", date: "08/05/2025", likes: 0 }
    ],
    contacts: [
      { id: 1, name: "Carlos Mendes", role: "Executivo de Contas", email: "carlos@logisticaexpress.com", phone: "(11) 93333-4444" }
    ],
    files: [],
    history: [
      { id: 1, action: "Parceiro adicionado", user: "Admin", date: "01/05/2025" },
      { id: 2, action: "Marcado como recomendado", user: "Admin", date: "02/05/2025" }
    ]
  },
];
