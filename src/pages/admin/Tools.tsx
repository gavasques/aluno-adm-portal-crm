
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, MessageCircle, Filter, ArrowUp, ArrowDown, Trash2, Plus, FileText, Image, Clock, Users, ExternalLink, ThumbsUp, UserPlus, MessageSquarePlus, FilePlus, ImagePlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

// Sample data for tools
const TOOLS = [
  {
    id: 1,
    name: "ERP Commerce",
    category: "Gestão Empresarial",
    provider: "Sistema ERP",
    rating: 4.7,
    comments: 18,
    logo: "EC",
    price: "R$ 249,90/mês",
    recommended: true,
    notRecommended: false,
    description: "Software integrado para gerenciamento de lojas online e físicas.",
    website: "www.erpcommerce.com.br",
    phone: "(11) 9999-8888",
    email: "contato@erpcommerce.com.br",
    status: "Ativo",
    coupons: "DESCONTO10 - 10% de desconto\nPROMO2025 - 3 meses grátis",
    contacts: [
      { id: 1, name: "João Silva", role: "Gestor de Contas", email: "joao@erpcommerce.com.br", phone: "(11) 97777-6666", notes: "Disponível para suporte técnico." },
      { id: 2, name: "Maria Oliveira", role: "Suporte", email: "maria@erpcommerce.com.br", phone: "(11) 96666-5555", notes: "Especialista em implementação." }
    ],
    comments_list: [
      { id: 1, user: "Carlos Mendes", text: "Vocês recomendam essa ferramenta para uma loja média com cerca de 500 produtos?", date: "15/05/2025", likes: 2, replies: [
        { id: 101, user: "Ana Costa", text: "Sim, utilizamos para uma loja com 600 produtos e funciona muito bem!", date: "16/05/2025", likes: 1 }
      ]},
      { id: 2, user: "Pedro Santos", text: "Alguém sabe se tem integração com o ERP XYZ?", date: "10/05/2025", likes: 0, replies: [] }
    ],
    ratings_list: [
      { id: 1, user: "João Silva", rating: 5, comment: "Excelente ferramenta, atendeu todas as necessidades do meu negócio.", date: "18/04/2025", likes: 3 },
      { id: 2, user: "Maria Oliveira", rating: 4, comment: "Bom custo-benefício, mas poderia ter mais recursos de marketing.", date: "10/04/2025", likes: 1 }
    ],
    files: [
      { id: 1, name: "Manual do Usuário.pdf", type: "application/pdf", size: "2.5 MB", date: "05/04/2025" },
      { id: 2, name: "Planilha de Integração.xlsx", type: "application/xlsx", size: "1.8 MB", date: "02/04/2025" }
    ],
    images: [
      { id: 1, url: "https://placehold.co/600x400?text=Dashboard+ERP", alt: "Dashboard ERP" },
      { id: 2, url: "https://placehold.co/600x400?text=Relatórios", alt: "Relatórios" }
    ],
    history: [
      { id: 1, action: "Criação da ferramenta", user: "Admin", date: "01/04/2025" },
      { id: 2, action: "Alteração de dados", user: "Admin", date: "05/04/2025", details: "Preço atualizado" },
      { id: 3, action: "Adição de contato", user: "Admin", date: "10/04/2025", details: "Contato: João Silva" },
    ]
  },
  {
    id: 2,
    name: "Email Marketing Pro",
    category: "Marketing",
    provider: "Marketing Digital",
    rating: 4.5,
    comments: 12,
    logo: "EM",
    price: "R$ 99,00/mês",
    recommended: false,
    notRecommended: true,
    description: "Ferramenta completa de automação de email marketing.",
    website: "www.emailmarketingpro.com",
    phone: "(11) 8888-7777",
    email: "contato@emailmarketingpro.com",
    status: "Ativo",
    coupons: "WELCOME20 - 20% de desconto no primeiro mês",
    contacts: [
      { id: 1, name: "Ricardo Almeida", role: "Suporte Técnico", email: "ricardo@emailmarketingpro.com", phone: "(11) 95555-4444", notes: "Especialista em integrações." }
    ],
    comments_list: [
      { id: 1, user: "Juliana Mendes", text: "Qual o limite de envio mensal no plano básico?", date: "12/05/2025", likes: 1, replies: [
        { id: 101, user: "Roberto Almeida", text: "No plano básico são 10.000 emails por mês.", date: "13/05/2025", likes: 0 }
      ]}
    ],
    ratings_list: [
      { id: 1, user: "Carlos Santos", rating: 3, comment: "Funciona bem, mas tem muitas limitações no plano básico.", date: "20/04/2025", likes: 2 }
    ],
    files: [
      { id: 1, name: "Comparativo de Planos.pdf", type: "application/pdf", size: "1.2 MB", date: "15/03/2025" }
    ],
    images: [
      { id: 1, url: "https://placehold.co/600x400?text=Interface+Email", alt: "Interface de Email" }
    ],
    history: [
      { id: 1, action: "Criação da ferramenta", user: "Admin", date: "01/03/2025" },
      { id: 2, action: "Adição de comentário", user: "Juliana Mendes", date: "12/05/2025" },
    ]
  },
  {
    id: 3,
    name: "Gestor de Estoque",
    category: "Logística",
    provider: "Supply Chain Co.",
    rating: 4.2,
    comments: 9,
    logo: "GE",
    price: "R$ 199,00/mês",
    recommended: true,
    notRecommended: false,
    description: "Controle completo de estoque para e-commerce.",
    website: "www.gestordeestoque.com.br",
    phone: "(11) 7777-6666",
    email: "contato@gestordeestoque.com.br",
    status: "Ativo",
    coupons: "ESTOQUE15 - 15% de desconto nos planos anuais",
    contacts: [
      { id: 1, name: "Fernanda Lima", role: "Consultora", email: "fernanda@gestordeestoque.com.br", phone: "(11) 94444-3333", notes: "Especialista em implementação para e-commerces." }
    ],
    comments_list: [
      { id: 1, user: "Amanda Costa", text: "A ferramenta permite integração com marketplaces?", date: "08/05/2025", likes: 3, replies: [] }
    ],
    ratings_list: [
      { id: 1, user: "Marcelo Oliveira", rating: 4, comment: "Ótima ferramenta para gestão de múltiplos estoques.", date: "25/04/2025", likes: 1 }
    ],
    files: [
      { id: 1, name: "Guia de Integração.pdf", type: "application/pdf", size: "3.5 MB", date: "20/03/2025" }
    ],
    images: [
      { id: 1, url: "https://placehold.co/600x400?text=Dashboard+Estoque", alt: "Dashboard de Estoque" },
      { id: 2, url: "https://placehold.co/600x400?text=Relatório+de+Inventário", alt: "Relatório de Inventário" }
    ],
    history: [
      { id: 1, action: "Criação da ferramenta", user: "Admin", date: "01/03/2025" },
      { id: 2, action: "Alteração de dados", user: "Admin", date: "15/03/2025", details: "Adicionada tag 'Recomendado'" },
    ]
  },
];

// Form schemas for validation
const contactFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  role: z.string().min(2, "Função é obrigatória"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  notes: z.string().optional(),
});

const commentFormSchema = z.object({
  text: z.string().min(3, "Comentário deve ter pelo menos 3 caracteres"),
});

const replyFormSchema = z.object({
  text: z.string().min(3, "Resposta deve ter pelo menos 3 caracteres"),
});

const ratingFormSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(3, "Comentário deve ter pelo menos 3 caracteres"),
});

const fileUploadSchema = z.object({
  file: z.instanceof(File),
});

const imageUploadSchema = z.object({
  image: z.instanceof(File),
  alt: z.string().min(3, "Descrição da imagem é obrigatória"),
});

const toolFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  category: z.string().min(2, "Categoria é obrigatória"),
  provider: z.string().min(2, "Fornecedor é obrigatório"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  website: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("E-mail inválido").optional(),
  price: z.string().optional(),
  status: z.string().optional(),
  recommended: z.boolean().optional(),
  notRecommended: z.boolean().optional(),
  coupons: z.string().optional(),
});

const Tools = () => {
  const [tools, setTools] = useState(TOOLS);
  const [searchQuery, setSearchQuery] = useState("");
  const [softwareTypeFilter, setSoftwareTypeFilter] = useState("all");
  const [recommendationFilter, setRecommendationFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedTool, setSelectedTool] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [isReplyingTo, setIsReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [rating, setRating] = useState(5);
  const [isAddToolDialogOpen, setIsAddToolDialogOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [ratingToDelete, setRatingToDelete] = useState(null);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(null);
  
  // Forms
  const contactForm = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
      phone: "",
      notes: "",
    }
  });

  const ratingForm = useForm({
    resolver: zodResolver(ratingFormSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    }
  });

  const toolForm = useForm({
    resolver: zodResolver(toolFormSchema),
    defaultValues: {
      name: "",
      category: "",
      provider: "",
      description: "",
      website: "",
      phone: "",
      email: "",
      price: "",
      status: "Ativo",
      recommended: false,
      notRecommended: false,
      coupons: "",
    }
  });
  
  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
  };

  const handleOpenTool = (tool) => {
    setSelectedTool(tool);
  };
  
  const handleCloseTool = () => {
    setSelectedTool(null);
    setNewComment("");
    setIsReplyingTo(null);
  };
  
  // Filter and sort tools based on search query and filters
  const filteredTools = useMemo(() => {
    return tools
      .filter(tool => {
        // Filtro de pesquisa
        const matchesSearch = 
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.provider.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Filtro por tipo
        const matchesType = 
          softwareTypeFilter === "all" || 
          tool.category === softwareTypeFilter;
        
        // Filtro por recomendação
        const matchesRecommendation = 
          recommendationFilter === "all" || 
          (recommendationFilter === "recommended" && tool.recommended) ||
          (recommendationFilter === "not-recommended" && tool.notRecommended);
        
        return matchesSearch && matchesType && matchesRecommendation;
      })
      .sort((a, b) => {
        let valA, valB;
        
        switch (sortField) {
          case "name":
            valA = a.name;
            valB = b.name;
            break;
          case "category":
            valA = a.category;
            valB = b.category;
            break;
          case "provider":
            valA = a.provider;
            valB = b.provider;
            break;
          case "rating":
            valA = a.rating;
            valB = b.rating;
            break;
          default:
            valA = a.name;
            valB = b.name;
        }
        
        if (sortDirection === "asc") {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
  }, [tools, searchQuery, softwareTypeFilter, recommendationFilter, sortField, sortDirection]);

  // Handler functions for CRUD operations
  const handleAddTool = (data) => {
    const newTool = {
      id: Date.now(),
      name: data.name,
      category: data.category,
      provider: data.provider,
      rating: 0,
      comments: 0,
      logo: data.name.substring(0, 2).toUpperCase(),
      price: data.price || "Sob consulta",
      recommended: data.recommended || false,
      notRecommended: data.notRecommended || false,
      description: data.description,
      website: data.website || "",
      phone: data.phone || "",
      email: data.email || "",
      status: data.status || "Ativo",
      coupons: data.coupons || "",
      contacts: [],
      comments_list: [],
      ratings_list: [],
      files: [],
      images: [],
      history: [
        { 
          id: Date.now(), 
          action: "Criação da ferramenta", 
          user: "Admin", 
          date: new Date().toLocaleDateString() 
        }
      ]
    };
    
    setTools([...tools, newTool]);
    toolForm.reset();
    setIsAddToolDialogOpen(false);
    toast.success("Ferramenta adicionada com sucesso!");
  };

  const handleDeleteTool = (id) => {
    setTools(tools.filter(tool => tool.id !== id));
    setToolToDelete(null);
    toast.success("Ferramenta excluída com sucesso!");
  };

  const handleAddComment = () => {
    if (newComment.trim() === "") {
      toast.error("O comentário não pode estar vazio");
      return;
    }

    if (selectedTool) {
      const newCommentObj = {
        id: Date.now(),
        user: "Admin",
        text: newComment,
        date: new Date().toLocaleDateString(),
        likes: 0,
        replies: [],
      };
      
      // Update the selected tool's comments
      const updatedTools = tools.map(tool => {
        if (tool.id === selectedTool.id) {
          const updatedTool = {
            ...tool,
            comments_list: [...tool.comments_list, newCommentObj],
            comments: tool.comments + 1,
            history: [...tool.history, {
              id: Date.now(),
              action: "Adição de comentário",
              user: "Admin",
              date: new Date().toLocaleDateString(),
              details: newComment.substring(0, 30) + (newComment.length > 30 ? "..." : "")
            }]
          };
          setSelectedTool(updatedTool);
          return updatedTool;
        }
        return tool;
      });
      
      setTools(updatedTools);
      toast.success("Comentário adicionado com sucesso!");
      setNewComment("");
    }
  };

  const handleDeleteComment = (commentId) => {
    if (!selectedTool) return;

    const updatedTools = tools.map(tool => {
      if (tool.id === selectedTool.id) {
        const updatedComments = tool.comments_list.filter(comment => comment.id !== commentId);
        const updatedTool = {
          ...tool,
          comments_list: updatedComments,
          comments: updatedComments.length,
          history: [...tool.history, {
            id: Date.now(),
            action: "Remoção de comentário",
            user: "Admin",
            date: new Date().toLocaleDateString()
          }]
        };
        setSelectedTool(updatedTool);
        return updatedTool;
      }
      return tool;
    });
    
    setTools(updatedTools);
    setCommentToDelete(null);
    toast.success("Comentário excluído com sucesso!");
  };

  const handleAddReply = (commentId) => {
    if (!replyText.trim()) {
      toast.error("A resposta não pode estar vazia");
      return;
    }

    if (selectedTool) {
      const newReply = {
        id: Date.now(),
        user: "Admin",
        text: replyText,
        date: new Date().toLocaleDateString(),
        likes: 0
      };

      const updatedTools = tools.map(tool => {
        if (tool.id === selectedTool.id) {
          const updatedCommentsList = tool.comments_list.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [...comment.replies, newReply]
              };
            }
            return comment;
          });
          
          const updatedTool = {
            ...tool,
            comments_list: updatedCommentsList,
            history: [...tool.history, {
              id: Date.now(),
              action: "Adição de resposta a comentário",
              user: "Admin",
              date: new Date().toLocaleDateString()
            }]
          };
          
          setSelectedTool(updatedTool);
          return updatedTool;
        }
        return tool;
      });
      
      setTools(updatedTools);
      toast.success("Resposta adicionada com sucesso!");
      setReplyText("");
      setIsReplyingTo(null);
    }
  };

  const handleAddContact = (data) => {
    if (selectedTool) {
      const newContact = {
        id: Date.now(),
        ...data
      };
      
      const updatedTools = tools.map(tool => {
        if (tool.id === selectedTool.id) {
          const updatedTool = {
            ...tool,
            contacts: [...tool.contacts, newContact],
            history: [...tool.history, {
              id: Date.now(),
              action: "Adição de contato",
              user: "Admin",
              date: new Date().toLocaleDateString(),
              details: `Contato: ${data.name}`
            }]
          };
          
          setSelectedTool(updatedTool);
          return updatedTool;
        }
        return tool;
      });
      
      setTools(updatedTools);
      toast.success("Contato adicionado com sucesso!");
      contactForm.reset();
      setIsContactDialogOpen(false);
    }
  };

  const handleDeleteContact = (contactId) => {
    if (!selectedTool) return;
    
    const contactName = selectedTool.contacts.find(c => c.id === contactId)?.name || "";

    const updatedTools = tools.map(tool => {
      if (tool.id === selectedTool.id) {
        const updatedContacts = tool.contacts.filter(contact => contact.id !== contactId);
        const updatedTool = {
          ...tool,
          contacts: updatedContacts,
          history: [...tool.history, {
            id: Date.now(),
            action: "Remoção de contato",
            user: "Admin",
            date: new Date().toLocaleDateString(),
            details: contactName ? `Contato: ${contactName}` : ""
          }]
        };
        
        setSelectedTool(updatedTool);
        return updatedTool;
      }
      return tool;
    });
    
    setTools(updatedTools);
    setContactToDelete(null);
    toast.success("Contato excluído com sucesso!");
  };

  const handleAddRating = (data) => {
    if (selectedTool) {
      const newRating = {
        id: Date.now(),
        user: "Admin",
        rating: data.rating,
        comment: data.comment,
        date: new Date().toLocaleDateString(),
        likes: 0,
      };
      
      const updatedTools = tools.map(tool => {
        if (tool.id === selectedTool.id) {
          // Calculate new average rating
          const ratings = [...tool.ratings_list, newRating];
          const sum = ratings.reduce((total, r) => total + r.rating, 0);
          const newAvgRating = ratings.length > 0 ? +(sum / ratings.length).toFixed(1) : 0;
          
          const updatedTool = {
            ...tool,
            ratings_list: ratings,
            rating: newAvgRating,
            history: [...tool.history, {
              id: Date.now(),
              action: "Adição de avaliação",
              user: "Admin",
              date: new Date().toLocaleDateString(),
              details: `Avaliação: ${data.rating}/5`
            }]
          };
          
          setSelectedTool(updatedTool);
          return updatedTool;
        }
        return tool;
      });
      
      setTools(updatedTools);
      toast.success("Avaliação adicionada com sucesso!");
      ratingForm.reset();
      setIsRatingDialogOpen(false);
    }
  };

  const handleDeleteRating = (ratingId) => {
    if (!selectedTool) return;

    const updatedTools = tools.map(tool => {
      if (tool.id === selectedTool.id) {
        const updatedRatings = tool.ratings_list.filter(rating => rating.id !== ratingId);
        
        // Recalculate average rating
        const sum = updatedRatings.reduce((total, r) => total + r.rating, 0);
        const newAvgRating = updatedRatings.length > 0 ? +(sum / updatedRatings.length).toFixed(1) : 0;
        
        const updatedTool = {
          ...tool,
          ratings_list: updatedRatings,
          rating: newAvgRating,
          history: [...tool.history, {
            id: Date.now(),
            action: "Remoção de avaliação",
            user: "Admin",
            date: new Date().toLocaleDateString()
          }]
        };
        
        setSelectedTool(updatedTool);
        return updatedTool;
      }
      return tool;
    });
    
    setTools(updatedTools);
    setRatingToDelete(null);
    toast.success("Avaliação excluída com sucesso!");
  };
  
  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("O arquivo não pode ter mais de 5MB");
      return;
    }
    
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de arquivo não permitido. Por favor, envie um arquivo PDF, DOC, DOCX, XLS, XLSX, ZIP ou TXT.");
      return;
    }
    
    if (selectedTool) {
      const newFile = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        size: (file.size / 1024 / 1024).toFixed(1) + " MB",
        date: new Date().toLocaleDateString()
      };
      
      const updatedTools = tools.map(tool => {
        if (tool.id === selectedTool.id) {
          const updatedTool = {
            ...tool,
            files: [...tool.files, newFile],
            history: [...tool.history, {
              id: Date.now(),
              action: "Upload de arquivo",
              user: "Admin",
              date: new Date().toLocaleDateString(),
              details: `Arquivo: ${file.name}`
            }]
          };
          
          setSelectedTool(updatedTool);
          return updatedTool;
        }
        return tool;
      });
      
      setTools(updatedTools);
      toast.success(`Arquivo "${file.name}" enviado com sucesso!`);
    }
  };

  const handleDeleteFile = (fileId) => {
    if (!selectedTool) return;
    
    const fileName = selectedTool.files.find(f => f.id === fileId)?.name || "";

    const updatedTools = tools.map(tool => {
      if (tool.id === selectedTool.id) {
        const updatedFiles = tool.files.filter(file => file.id !== fileId);
        const updatedTool = {
          ...tool,
          files: updatedFiles,
          history: [...tool.history, {
            id: Date.now(),
            action: "Remoção de arquivo",
            user: "Admin",
            date: new Date().toLocaleDateString(),
            details: fileName ? `Arquivo: ${fileName}` : ""
          }]
        };
        
        setSelectedTool(updatedTool);
        return updatedTool;
      }
      return tool;
    });
    
    setTools(updatedTools);
    setFileToDelete(null);
    toast.success("Arquivo excluído com sucesso!");
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem não pode ter mais de 2MB");
      return;
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de imagem não permitido. Por favor, envie uma imagem JPG, PNG, GIF ou WEBP.");
      return;
    }
    
    if (selectedTool) {
      // In a real app we'd upload to storage and get a URL
      // Here we'll create a placeholder URL for demo purposes
      const newImage = {
        id: Date.now(),
        url: `https://placehold.co/600x400?text=${file.name.split('.')[0].replace(/\s/g, '+')}`,
        alt: file.name,
      };
      
      const updatedTools = tools.map(tool => {
        if (tool.id === selectedTool.id) {
          const updatedTool = {
            ...tool,
            images: [...tool.images, newImage],
            history: [...tool.history, {
              id: Date.now(),
              action: "Upload de imagem",
              user: "Admin",
              date: new Date().toLocaleDateString(),
              details: `Imagem: ${file.name}`
            }]
          };
          
          setSelectedTool(updatedTool);
          return updatedTool;
        }
        return tool;
      });
      
      setTools(updatedTools);
      toast.success(`Imagem "${file.name}" enviada com sucesso!`);
    }
  };

  const handleDeleteImage = (imageId) => {
    if (!selectedTool) return;
    
    const imageName = selectedTool.images.find(img => img.id === imageId)?.alt || "";

    const updatedTools = tools.map(tool => {
      if (tool.id === selectedTool.id) {
        const updatedImages = tool.images.filter(image => image.id !== imageId);
        const updatedTool = {
          ...tool,
          images: updatedImages,
          history: [...tool.history, {
            id: Date.now(),
            action: "Remoção de imagem",
            user: "Admin",
            date: new Date().toLocaleDateString(),
            details: imageName ? `Imagem: ${imageName}` : ""
          }]
        };
        
        setSelectedTool(updatedTool);
        return updatedTool;
      }
      return tool;
    });
    
    setTools(updatedTools);
    setImageToDelete(null);
    toast.success("Imagem excluída com sucesso!");
  };

  const handleLike = (id, type) => {
    toast.success("Like adicionado!");
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Gerenciar Ferramentas</h1>
      
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-500">Total: {tools.length} ferramentas</p>
        <Button onClick={() => setIsAddToolDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Ferramenta
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Lista de Ferramentas</CardTitle>
          <CardDescription>
            Gerencie todas as ferramentas disponíveis na plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar ferramentas..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={softwareTypeFilter} onValueChange={setSoftwareTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de Ferramenta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="Gestão Empresarial">Gestão Empresarial</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Logística">Logística</SelectItem>
                  <SelectItem value="Análise de Dados">Análise de Dados</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={recommendationFilter} onValueChange={setRecommendationFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Recomendação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="recommended">Ferramentas Recomendadas</SelectItem>
                  <SelectItem value="not-recommended">Não Recomendadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                    Nome
                    {sortField === "name" && (
                      sortDirection === "asc" ? 
                        <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                        <ArrowDown className="ml-1 h-4 w-4 inline" />
                    )}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                    Categoria
                    {sortField === "category" && (
                      sortDirection === "asc" ? 
                        <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                        <ArrowDown className="ml-1 h-4 w-4 inline" />
                    )}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("provider")}>
                    Fornecedor
                    {sortField === "provider" && (
                      sortDirection === "asc" ? 
                        <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                        <ArrowDown className="ml-1 h-4 w-4 inline" />
                    )}
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("rating")}>
                    Avaliação
                    {sortField === "rating" && (
                      sortDirection === "asc" ? 
                        <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                        <ArrowDown className="ml-1 h-4 w-4 inline" />
                    )}
                  </TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium">
                      {tool.name}
                      <div className="flex gap-2 mt-1">
                        {tool.recommended && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            Recomendada
                          </Badge>
                        )}
                        {tool.notRecommended && (
                          <Badge variant="destructive">
                            Não Recomendado (Corre)
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{tool.category}</TableCell>
                    <TableCell>{tool.provider}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                        {tool.price}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{tool.rating}</span>
                        <span className="text-gray-400 ml-1">({tool.comments})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenTool(tool)}>
                          Ver Detalhes
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Ferramenta</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza de que deseja excluir a ferramenta "{tool.name}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteTool(tool.id)} className="bg-red-500 hover:bg-red-600">
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTools.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Nenhuma ferramenta encontrada com os filtros selecionados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Adicionar Nova Ferramenta */}
      <Dialog open={isAddToolDialogOpen} onOpenChange={setIsAddToolDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Ferramenta</DialogTitle>
            <DialogDescription>
              Preencha os dados para adicionar uma nova ferramenta ao catálogo.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={toolForm.handleSubmit(handleAddTool)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Ferramenta*</Label>
                <Input
                  id="name"
                  placeholder="Nome"
                  {...toolForm.register("name")}
                />
                {toolForm.formState.errors.name && (
                  <p className="text-sm text-red-500">{toolForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria*</Label>
                <Select 
                  onValueChange={(value) => toolForm.setValue("category", value)} 
                  defaultValue={toolForm.getValues("category")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gestão Empresarial">Gestão Empresarial</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Logística">Logística</SelectItem>
                    <SelectItem value="Análise de Dados">Análise de Dados</SelectItem>
                  </SelectContent>
                </Select>
                {toolForm.formState.errors.category && (
                  <p className="text-sm text-red-500">{toolForm.formState.errors.category.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">Fornecedor*</Label>
                <Input
                  id="provider"
                  placeholder="Fornecedor"
                  {...toolForm.register("provider")}
                />
                {toolForm.formState.errors.provider && (
                  <p className="text-sm text-red-500">{toolForm.formState.errors.provider.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  placeholder="Ex: R$ 99,90/mês"
                  {...toolForm.register("price")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="www.exemplo.com.br"
                  {...toolForm.register("website")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="contato@exemplo.com.br"
                  {...toolForm.register("email")}
                />
                {toolForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{toolForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(00) 0000-0000"
                  {...toolForm.register("phone")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  onValueChange={(value) => toolForm.setValue("status", value)} 
                  defaultValue={toolForm.getValues("status")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                    <SelectItem value="Em análise">Em análise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Switch
                  id="recommended"
                  checked={toolForm.watch("recommended")}
                  onCheckedChange={(checked) => {
                    toolForm.setValue("recommended", checked);
                    if (checked && toolForm.getValues("notRecommended")) {
                      toolForm.setValue("notRecommended", false);
                    }
                  }}
                />
                <Label htmlFor="recommended">Ferramenta Recomendada</Label>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Switch
                  id="notRecommended"
                  checked={toolForm.watch("notRecommended")}
                  onCheckedChange={(checked) => {
                    toolForm.setValue("notRecommended", checked);
                    if (checked && toolForm.getValues("recommended")) {
                      toolForm.setValue("recommended", false);
                    }
                  }}
                />
                <Label htmlFor="notRecommended">Não Recomendada (Corre)</Label>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Descrição*</Label>
                <Textarea
                  id="description"
                  placeholder="Descrição detalhada da ferramenta"
                  className="min-h-[100px]"
                  {...toolForm.register("description")}
                />
                {toolForm.formState.errors.description && (
                  <p className="text-sm text-red-500">{toolForm.formState.errors.description.message}</p>
                )}
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="coupons">Cupons e Descontos</Label>
                <Textarea
                  id="coupons"
                  placeholder="Informe cupons e descontos disponíveis"
                  className="min-h-[80px]"
                  {...toolForm.register("coupons")}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddToolDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Adicionar Ferramenta</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para detalhes da ferramenta */}
      {selectedTool && (
        <Dialog open={!!selectedTool} onOpenChange={handleCloseTool}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <div className="w-8 h-8 rounded-md bg-portal-accent text-white flex items-center justify-center text-lg font-bold mr-2">
                  {selectedTool.logo}
                </div>
                {selectedTool.name}
                <div className="flex gap-2 ml-4">
                  {selectedTool.recommended && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      Recomendada
                    </Badge>
                  )}
                  {selectedTool.notRecommended && (
                    <Badge variant="destructive">
                      Não Recomendado (Corre)
                    </Badge>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Dados da Ferramenta</TabsTrigger>
                  <TabsTrigger value="contacts">Contatos</TabsTrigger>
                  <TabsTrigger value="comments">Comentários</TabsTrigger>
                  <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                  <TabsTrigger value="files">Arquivos</TabsTrigger>
                  <TabsTrigger value="images">Imagens</TabsTrigger>
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                          <p className="mt-1 text-base">{selectedTool.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Categoria</h3>
                          <p className="mt-1 text-base">{selectedTool.category}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Fornecedor</h3>
                          <p className="mt-1 text-base">{selectedTool.provider}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Preço</h3>
                          <p className="mt-1 text-base">{selectedTool.price}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Website</h3>
                          <a href={`https://${selectedTool.website}`} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="mt-1 text-base flex items-center text-blue-600 hover:underline">
                            {selectedTool.website}
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                          <p className="mt-1 text-base">{selectedTool.phone}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email</h3>
                          <p className="mt-1 text-base">{selectedTool.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Status</h3>
                          <p className="mt-1 text-base">{selectedTool.status}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Avaliação</h3>
                          <div className="mt-1 flex items-center">
                            <span className="mr-2">{selectedTool.rating}/5</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${
                                    star <= Math.round(selectedTool.rating) 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
                          <p className="mt-1 text-base">{selectedTool.description}</p>
                        </div>
                        <div className="col-span-2">
                          <h3 className="text-sm font-medium text-gray-500">Cupons e Descontos</h3>
                          <pre className="mt-1 p-3 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">{selectedTool.coupons}</pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="contacts">
                  <Card>
                    <CardContent className="py-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Contatos</h3>
                        <Button size="sm" onClick={() => setIsContactDialogOpen(true)}>
                          <UserPlus className="h-4 w-4 mr-1" /> Adicionar Contato
                        </Button>
                      </div>
                      
                      {selectedTool.contacts && selectedTool.contacts.length > 0 ? (
                        <div className="space-y-4">
                          {selectedTool.contacts.map((contact) => (
                            <div key={contact.id} className="border p-4 rounded-md">
                              <div className="flex justify-between">
                                <h4 className="font-medium text-lg">{contact.name}</h4>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Excluir Contato</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza de que deseja excluir o contato "{contact.name}"? Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteContact(contact.id)} className="bg-red-500 hover:bg-red-600">
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                <div>
                                  <p className="text-sm text-gray-500">Função</p>
                                  <p>{contact.role}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Email</p>
                                  <p>{contact.email}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Telefone</p>
                                  <p>{contact.phone}</p>
                                </div>
                              </div>
                              {contact.notes && (
                                <div className="mt-2">
                                  <p className="text-sm text-gray-500">Observações</p>
                                  <p className="text-sm mt-1">{contact.notes}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-gray-500">
                          Nenhum contato cadastrado.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Dialog para adicionar novo contato */}
                  <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Contato</DialogTitle>
                        <DialogDescription>
                          Adicione informações detalhadas do contato.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={contactForm.handleSubmit(handleAddContact)}>
                        <div className="space-y-4 py-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nome*</Label>
                            <Input
                              id="name"
                              placeholder="Nome completo"
                              {...contactForm.register("name")}
                            />
                            {contactForm.formState.errors.name && (
                              <p className="text-sm text-red-500">{contactForm.formState.errors.name.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="role">Função*</Label>
                            <Input
                              id="role"
                              placeholder="Ex: Gestor de Contas, Suporte, etc."
                              {...contactForm.register("role")}
                            />
                            {contactForm.formState.errors.role && (
                              <p className="text-sm text-red-500">{contactForm.formState.errors.role.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email*</Label>
                            <Input
                              id="email"
                              placeholder="email@exemplo.com"
                              type="email"
                              {...contactForm.register("email")}
                            />
                            {contactForm.formState.errors.email && (
                              <p className="text-sm text-red-500">{contactForm.formState.errors.email.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Telefone*</Label>
                            <Input
                              id="phone"
                              placeholder="(00) 00000-0000"
                              {...contactForm.register("phone")}
                            />
                            {contactForm.formState.errors.phone && (
                              <p className="text-sm text-red-500">{contactForm.formState.errors.phone.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="notes">Observações</Label>
                            <Textarea
                              id="notes"
                              placeholder="Informações adicionais sobre o contato"
                              {...contactForm.register("notes")}
                            />
                          </div>
                        </div>
                        <DialogFooter className="mt-6">
                          <Button type="button" variant="outline" onClick={() => setIsContactDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button type="submit">Adicionar</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </TabsContent>
                
                <TabsContent value="comments">
                  <Card>
                    <CardContent className="py-6">
                      {selectedTool.comments_list && selectedTool.comments_list.length > 0 ? (
                        <div className="space-y-6 mb-6">
                          {selectedTool.comments_list.map((comment) => (
                            <div key={comment.id} className="border rounded-lg p-4">
                              <div className="flex justify-between">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                    {comment.user.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-medium">{comment.user}</p>
                                    <p className="text-sm text-gray-500">{comment.date}</p>
                                  </div>
                                </div>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Excluir Comentário</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza de que deseja excluir este comentário? Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteComment(comment.id)} className="bg-red-500 hover:bg-red-600">
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                              <p className="mt-3">{comment.text}</p>
                              <div className="mt-3 flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="text-gray-500" onClick={handleLike}>
                                  <ThumbsUp className="h-4 w-4 mr-1" /> {comment.likes}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-500"
                                  onClick={() => setIsReplyingTo(comment.id)}
                                >
                                  <MessageCircle className="h-4 w-4 mr-1" /> Responder
                                </Button>
                              </div>
                              
                              {isReplyingTo === comment.id && (
                                <div className="mt-4 ml-8 bg-gray-50 p-3 rounded-md">
                                  <div className="flex items-center mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                      {"A"}
                                    </div>
                                    <p className="font-medium text-sm">Admin</p>
                                  </div>
                                  <Textarea 
                                    placeholder="Digite sua resposta..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="min-h-[80px] mb-2"
                                  />
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => setIsReplyingTo(null)}
                                    >
                                      Cancelar
                                    </Button>
                                    <Button 
                                      size="sm"
                                      onClick={() => handleAddReply(comment.id)}
                                    >
                                      <MessageSquarePlus className="h-4 w-4 mr-1" /> Responder
                                    </Button>
                                  </div>
                                </div>
                              )}
                              
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="mt-4 ml-8 space-y-4">
                                  {comment.replies.map((reply) => (
                                    <div key={reply.id} className="border-l-2 pl-4">
                                      <div className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                          {reply.user.charAt(0)}
                                        </div>
                                        <div>
                                          <p className="font-medium">{reply.user}</p>
                                          <p className="text-xs text-gray-500">{reply.date}</p>
                                        </div>
                                      </div>
                                      <p className="mt-2 text-sm">{reply.text}</p>
                                      <Button variant="ghost" size="sm" className="text-gray-500 text-xs mt-1" onClick={handleLike}>
                                        <ThumbsUp className="h-3 w-3 mr-1" /> {reply.likes}
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500 mb-6">
                          Nenhum comentário disponível.
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <h3 className="font-medium mb-2">Adicionar comentário</h3>
                        <Textarea 
                          className="min-h-[100px]" 
                          placeholder="Digite seu comentário..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button className="mt-2" onClick={handleAddComment}>
                          <MessageSquarePlus className="mr-2 h-4 w-4" />
                          Enviar Comentário
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Avaliações</CardTitle>
                      <CardDescription>
                        Avaliação média: {selectedTool.rating}/5
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedTool.ratings_list && selectedTool.ratings_list.length > 0 ? (
                        <div className="space-y-4 mb-6">
                          {selectedTool.ratings_list.map((rating) => (
                            <div key={rating.id} className="border p-4 rounded-md">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                    {rating.user.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-medium">{rating.user}</p>
                                    <p className="text-sm text-gray-500">{rating.date}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star 
                                        key={star} 
                                        className={`h-4 w-4 ${star <= rating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                      />
                                    ))}
                                  </div>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Excluir Avaliação</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Tem certeza de que deseja excluir esta avaliação? Esta ação não pode ser desfeita.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteRating(rating.id)} className="bg-red-500 hover:bg-red-600">
                                          Excluir
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                              <p className="mt-2">{rating.comment}</p>
                              <Button variant="ghost" size="sm" className="text-gray-500 mt-2" onClick={handleLike}>
                                <ThumbsUp className="h-4 w-4 mr-1" /> {rating.likes}
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500 mb-6">
                          Nenhuma avaliação disponível.
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <Button className="w-full" onClick={() => setIsRatingDialogOpen(true)}>
                          <Star className="h-4 w-4 mr-2" /> Adicionar Avaliação
                        </Button>
                      </div>
                      
                      {/* Dialog para adicionar avaliação */}
                      <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Avaliar Ferramenta</DialogTitle>
                            <DialogDescription>
                              Compartilhe sua experiência com esta ferramenta.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={ratingForm.handleSubmit(handleAddRating)}>
                            <div className="space-y-4 py-2">
                              <div className="space-y-2">
                                <Label htmlFor="rating">Avaliação*</Label>
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((value) => (
                                    <Star
                                      key={value}
                                      className={`h-8 w-8 cursor-pointer ${
                                        value <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                      }`}
                                      onClick={() => {
                                        setRating(value);
                                        ratingForm.setValue("rating", value);
                                      }}
                                    />
                                  ))}
                                </div>
                                {ratingForm.formState.errors.rating && (
                                  <p className="text-sm text-red-500">{ratingForm.formState.errors.rating.message}</p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="comment">Comentário*</Label>
                                <Textarea
                                  id="comment"
                                  placeholder="Compartilhe sua experiência com esta ferramenta"
                                  {...ratingForm.register("comment")}
                                  className="min-h-[100px]"
                                />
                                {ratingForm.formState.errors.comment && (
                                  <p className="text-sm text-red-500">{ratingForm.formState.errors.comment.message}</p>
                                )}
                              </div>
                            </div>
                            <DialogFooter className="mt-6">
                              <Button type="button" variant="outline" onClick={() => setIsRatingDialogOpen(false)}>
                                Cancelar
                              </Button>
                              <Button type="submit">Enviar Avaliação</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="files">
                  <Card>
                    <CardContent className="py-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Arquivos</h3>
                        <div>
                          <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleUploadFile}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
                          />
                          <label htmlFor="file-upload">
                            <Button size="sm" as="span" className="cursor-pointer">
                              <FilePlus className="h-4 w-4 mr-1" /> Upload de Arquivo
                            </Button>
                          </label>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-4">
                        Tipos permitidos: PDF, DOC, DOCX, XLS, XLSX, ZIP, TXT (máx: 5MB)
                      </div>
                      
                      {selectedTool.files && selectedTool.files.length > 0 ? (
                        <div className="border rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Tamanho</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Ações</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedTool.files.map((file) => (
                                <TableRow key={file.id}>
                                  <TableCell className="font-medium flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                                    {file.name}
                                  </TableCell>
                                  <TableCell>{file.type.split('/')[1].toUpperCase()}</TableCell>
                                  <TableCell>{file.size}</TableCell>
                                  <TableCell>{file.date}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button variant="ghost" size="sm">Download</Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Excluir Arquivo</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Tem certeza de que deseja excluir o arquivo "{file.name}"? Esta ação não pode ser desfeita.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteFile(file.id)} className="bg-red-500 hover:bg-red-600">
                                              Excluir
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-10 text-gray-500">
                          Nenhum arquivo disponível.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="images">
                  <Card>
                    <CardContent className="py-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Imagens</h3>
                        <div>
                          <input
                            type="file"
                            id="image-upload"
                            className="hidden"
                            onChange={handleUploadImage}
                            accept="image/jpeg,image/png,image/gif,image/webp"
                          />
                          <label htmlFor="image-upload">
                            <Button size="sm" as="span" className="cursor-pointer">
                              <ImagePlus className="h-4 w-4 mr-1" /> Upload de Imagem
                            </Button>
                          </label>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-4">
                        Tipos permitidos: JPG, PNG, GIF, WEBP (máx: 2MB)
                      </div>
                      
                      {selectedTool.images && selectedTool.images.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedTool.images.map((image) => (
                            <div key={image.id} className="border rounded-md overflow-hidden">
                              <div className="relative group">
                                <img 
                                  src={image.url} 
                                  alt={image.alt} 
                                  className="w-full h-48 object-cover" 
                                />
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="destructive" size="sm" className="bg-red-500 hover:bg-red-600">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Excluir Imagem</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Tem certeza de que deseja excluir esta imagem? Esta ação não pode ser desfeita.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteImage(image.id)} className="bg-red-500 hover:bg-red-600">
                                          Excluir
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                              <div className="p-2">
                                <p className="text-sm font-medium">{image.alt}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-gray-500">
                          Nenhuma imagem disponível.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Histórico</CardTitle>
                      <CardDescription>
                        Registro de todas as alterações realizadas na ferramenta.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedTool.history && selectedTool.history.length > 0 ? (
                        <div className="border rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Ação</TableHead>
                                <TableHead>Usuário</TableHead>
                                <TableHead>Detalhes</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedTool.history.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.date}</TableCell>
                                  <TableCell>{item.action}</TableCell>
                                  <TableCell>{item.user}</TableCell>
                                  <TableCell>{item.details || "-"}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-10 text-gray-500">
                          Nenhum histórico disponível.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseTool}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Tools;
