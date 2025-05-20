
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, Edit } from "lucide-react";
import StatusBadge from "@/components/ui/status-badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tool } from "../ToolsTable";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface DetailsTabProps {
  tool: Tool;
  isAdmin: boolean;
  onSave: (data: any) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ tool, isAdmin, onSave }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  
  const editToolForm = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
        category: z.string().min(2, "Categoria é obrigatória"),
        provider: z.string().min(2, "Fornecedor é obrigatório"),
        description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
        website: z.string().url("Website deve ser uma URL válida").or(z.string().min(0)),
        phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
        email: z.string().email("E-mail inválido"),
        status: z.enum(["Ativo", "Inativo"]),
        coupons: z.string().optional(),
      })
    ),
    defaultValues: {
      name: tool.name,
      category: tool.category,
      provider: tool.provider,
      description: tool.description,
      website: tool.website,
      phone: tool.phone,
      email: tool.email,
      status: tool.status,
      coupons: tool.coupons,
    }
  });
  
  const handleSaveToolEdit = (data) => {
    onSave(data);
    setIsEditing(false);
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        {isAdmin && !isEditing && (
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" /> Editar
            </Button>
          </div>
        )}
        
        {isAdmin && isEditing ? (
          <form onSubmit={editToolForm.handleSubmit(handleSaveToolEdit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Nome*</Label>
                <Input 
                  id="name"
                  {...editToolForm.register("name")} 
                  className="mt-1"
                />
                {editToolForm.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {editToolForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="category">Categoria*</Label>
                <Select 
                  defaultValue={editToolForm.getValues("category")}
                  onValueChange={(value) => editToolForm.setValue("category", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gestão Empresarial">Gestão Empresarial</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Logística">Logística</SelectItem>
                    <SelectItem value="Análise de Dados">Análise de Dados</SelectItem>
                  </SelectContent>
                </Select>
                {editToolForm.formState.errors.category && (
                  <p className="text-sm text-red-500 mt-1">
                    {editToolForm.formState.errors.category.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="provider">Fornecedor*</Label>
                <Input 
                  id="provider"
                  {...editToolForm.register("provider")} 
                  className="mt-1"
                />
                {editToolForm.formState.errors.provider && (
                  <p className="text-sm text-red-500 mt-1">
                    {editToolForm.formState.errors.provider.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="status">Status*</Label>
                <Select 
                  defaultValue={editToolForm.getValues("status")}
                  onValueChange={(value) => editToolForm.setValue("status", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website"
                  {...editToolForm.register("website")} 
                  className="mt-1"
                />
                {editToolForm.formState.errors.website && (
                  <p className="text-sm text-red-500 mt-1">
                    {editToolForm.formState.errors.website.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Telefone*</Label>
                <Input 
                  id="phone"
                  {...editToolForm.register("phone")} 
                  className="mt-1"
                />
                {editToolForm.formState.errors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {editToolForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email*</Label>
                <Input 
                  id="email"
                  {...editToolForm.register("email")} 
                  className="mt-1"
                />
                {editToolForm.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {editToolForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Descrição*</Label>
                <Textarea 
                  id="description"
                  {...editToolForm.register("description")}
                  className="mt-1" 
                  rows={4}
                />
                {editToolForm.formState.errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {editToolForm.formState.errors.description.message}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <Label htmlFor="coupons">Cupons e Descontos</Label>
                <Textarea 
                  id="coupons"
                  {...editToolForm.register("coupons")}
                  className="mt-1" 
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nome</h3>
              <p className="mt-1 text-base">{tool.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Categoria</h3>
              <p className="mt-1 text-base">{tool.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Fornecedor</h3>
              <p className="mt-1 text-base">{tool.provider}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1 text-base">
                <StatusBadge isActive={tool.status === "Ativo"} />
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Website</h3>
              <a href={`https://${tool.website}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-1 text-base flex items-center text-blue-600 hover:underline">
                {tool.website}
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
              <p className="mt-1 text-base">{tool.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-base">{tool.email}</p>
            </div>
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
              <p className="mt-1 text-base">{tool.description}</p>
            </div>
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Cupons e Descontos</h3>
              <pre className="mt-1 p-3 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">{tool.coupons}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DetailsTab;
