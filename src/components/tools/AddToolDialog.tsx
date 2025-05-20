
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tool } from "./ToolsTable";

interface AddToolDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTool: (tool: Omit<Tool, "id">) => void;
  categories: string[];
}

const AddToolDialog: React.FC<AddToolDialogProps> = ({
  isOpen,
  onClose,
  onAddTool,
  categories
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    provider: "",
    description: "",
    website: "",
    phone: "",
    email: "",
    status: "Ativo",
    coupons: "",
    recommended: false,
    notRecommended: false,
    logo: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    // If "recommended" is switched on, turn off "notRecommended" and vice versa
    if (name === "recommended" && checked) {
      setFormData({ ...formData, recommended: checked, notRecommended: false });
    } else if (name === "notRecommended" && checked) {
      setFormData({ ...formData, notRecommended: checked, recommended: false });
    } else {
      setFormData({ ...formData, [name]: checked });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create the new tool object
    const newTool: Omit<Tool, "id"> = {
      ...formData,
      rating: 0,
      comments: 0,
      contacts: [],
      comments_list: [],
      ratings_list: [],
      files: [],
      images: []
    };
    
    onAddTool(newTool);
    
    // Reset form
    setFormData({
      name: "",
      category: "",
      provider: "",
      description: "",
      website: "",
      phone: "",
      email: "",
      status: "Ativo",
      coupons: "",
      recommended: false,
      notRecommended: false,
      logo: ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Ferramenta</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Ferramenta *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="provider">Fornecedor *</Label>
              <Input
                id="provider"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleSelectChange("category", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="Nova Categoria">Nova Categoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logo">Iniciais/Logo *</Label>
              <Input
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                maxLength={1}
                placeholder="Ex: S para Shopify"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                type="url"
                placeholder="https://..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coupons">Cupons de Desconto</Label>
              <Input
                id="coupons"
                name="coupons"
                value={formData.coupons}
                onChange={handleChange}
                placeholder="Ex: SHOP10, PROMO20"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="recommended"
                  checked={formData.recommended}
                  onCheckedChange={(checked) => handleSwitchChange("recommended", checked)}
                />
                <Label htmlFor="recommended">Recomendada</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="notRecommended"
                  checked={formData.notRecommended}
                  onCheckedChange={(checked) => handleSwitchChange("notRecommended", checked)}
                />
                <Label htmlFor="notRecommended">Não Recomendada</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Adicionar Ferramenta</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddToolDialog;
