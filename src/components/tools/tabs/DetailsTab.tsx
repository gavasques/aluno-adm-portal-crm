
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Globe, Mail, Phone, Tag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tool } from "@/components/tools/ToolsTable";

interface DetailsTabProps {
  tool: Tool;
  isAdmin: boolean;
  onSave: (data: Partial<Tool>) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ tool, isAdmin, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: tool.name,
    description: tool.description,
    website: tool.website || "",
    email: tool.email || "",
    phone: tool.phone || "",
    coupons: tool.coupons || "",
    status: tool.status || "Ativo",
    recommended: tool.recommended || false,
    notRecommended: tool.notRecommended || false,
    canal: tool.canal || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSwitchChange = (field: string, checked: boolean) => {
    // Toggle logic: if enabling "recommended", disable "notRecommended" and vice versa
    if (field === "recommended" && checked) {
      setFormData((prev) => ({ ...prev, recommended: true, notRecommended: false }));
    } else if (field === "notRecommended" && checked) {
      setFormData((prev) => ({ ...prev, notRecommended: true, recommended: false }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: checked }));
    }
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: tool.name,
      description: tool.description,
      website: tool.website || "",
      email: tool.email || "",
      phone: tool.phone || "",
      coupons: tool.coupons || "",
      status: tool.status || "Ativo",
      recommended: tool.recommended || false,
      notRecommended: tool.notRecommended || false,
      canal: tool.canal || ""
    });
    setIsEditing(false);
  };

  const renderReadOnlyView = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
          <p className="text-gray-700">{tool.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-500 mb-2">Informações</h4>
            <div className="space-y-3">
              {tool.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-teal-500" />
                  <a
                    href={tool.website.startsWith("http") ? tool.website : `https://${tool.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {tool.website}
                  </a>
                </div>
              )}

              {tool.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-teal-500" />
                  <a 
                    href={`mailto:${tool.email}`}
                    className="hover:underline"
                  >
                    {tool.email}
                  </a>
                </div>
              )}

              {tool.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-teal-500" />
                  <span>{tool.phone}</span>
                </div>
              )}
              
              {tool.canal && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-teal-500" />
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                    {tool.canal}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-500 mb-2">Status e Recomendação</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={`${
                tool.status === "Ativo" 
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-gray-100 text-gray-800 border-gray-200"
              }`}>
                {tool.status}
              </Badge>
              
              {tool.recommended && (
                <Badge className="bg-teal-100 text-teal-800 border-teal-200">
                  Recomendado
                </Badge>
              )}
              
              {tool.notRecommended && (
                <Badge variant="destructive">
                  Não Recomendado
                </Badge>
              )}
            </div>
            
            {tool.coupons && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-500 mb-2">Cupons de Desconto</h4>
                <div className="bg-gray-50 p-3 rounded-md border">
                  <pre className="whitespace-pre-wrap text-sm">{tool.coupons}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {isAdmin && (
          <div className="pt-4">
            <Button onClick={() => setIsEditing(true)}>Editar Detalhes</Button>
          </div>
        )}
      </div>
    );
  };

  const renderEditView = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contato@exemplo.com"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
              />
            </div>
            
            <div>
              <Label htmlFor="canal">Canal</Label>
              <Select 
                value={formData.canal} 
                onValueChange={(value) => handleSelectChange("canal", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Amazon">Amazon</SelectItem>
                  <SelectItem value="Meli">Meli</SelectItem>
                  <SelectItem value="Magalu">Magalu</SelectItem>
                  <SelectItem value="Shopee">Shopee</SelectItem>
                  <SelectItem value="Ecommerce">Ecommerce</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Recomendação</Label>
              <div className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="recommended"
                    checked={formData.recommended}
                    onCheckedChange={(checked) => handleSwitchChange("recommended", checked)}
                  />
                  <Label htmlFor="recommended">Recomendado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notRecommended"
                    checked={formData.notRecommended}
                    onCheckedChange={(checked) => handleSwitchChange("notRecommended", checked)}
                  />
                  <Label htmlFor="notRecommended">Não Recomendado</Label>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="coupons">Cupons de Desconto</Label>
              <Textarea
                id="coupons"
                name="coupons"
                value={formData.coupons}
                onChange={handleChange}
                rows={3}
                placeholder="Um cupom por linha. Exemplo: CODIGO10 - 10% de desconto"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </div>
    );
  };

  return isEditing ? renderEditView() : renderReadOnlyView();
};

export default DetailsTab;
