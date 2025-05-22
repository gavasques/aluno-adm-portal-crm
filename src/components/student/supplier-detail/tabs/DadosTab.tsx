
import React from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { container, item, CATEGORIAS, formatCNPJ } from "../SupplierTabUtils";

interface DadosTabProps {
  supplier: any;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const DadosTab: React.FC<DadosTabProps> = ({ supplier, isEditing, handleInputChange }) => {
  return (
    <ScrollArea className="h-[500px] pr-4">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div variants={item}>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome*</label>
          <Input
            id="name"
            value={supplier.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            required
            className="border-violet-200 focus-visible:ring-violet-500 bg-white/70 shadow-sm"
          />
        </motion.div>

        <motion.div variants={item}>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoria*</label>
          <select
            id="category"
            value={supplier.category}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full rounded-md border border-violet-200 bg-white/70 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10 shadow-sm"
          >
            {CATEGORIAS.map(categoria => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </motion.div>

        <motion.div variants={item} className="relative">
          <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
          <Input
            id="cnpj"
            value={supplier.cnpj}
            onChange={(e) => {
              // Formatar o CNPJ
              const formattedValue = formatCNPJ(e.target.value);
              handleInputChange({
                ...e,
                target: { ...e.target, id: 'cnpj', value: formattedValue }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            disabled={!isEditing}
            placeholder="00.000.000/0000-00"
            className="border-violet-200 focus-visible:ring-violet-500 bg-white/70 shadow-sm"
          />
          {isEditing && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-2 -right-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs px-2 py-1 rounded-full shadow-md"
            >
              Editando
            </motion.div>
          )}
        </motion.div>

        <motion.div variants={item}>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            id="type"
            value={supplier.type}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full rounded-md border border-violet-200 bg-white/70 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10 shadow-sm"
          >
            <option value="Distribuidor">Distribuidor</option>
            <option value="Fabricante">Fabricante</option>
            <option value="Importador">Importador</option>
            <option value="Atacadista">Atacadista</option>
            <option value="Varejista">Varejista</option>
            <option value="Representante">Representante</option>
          </select>
        </motion.div>

        <motion.div className="md:col-span-2" variants={item}>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
          <Input
            id="address"
            value={supplier.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Rua, número, bairro - cidade/estado"
            className="border-violet-200 focus-visible:ring-violet-500 bg-white/70 shadow-sm"
          />
        </motion.div>

        <motion.div variants={item}>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <Input
            id="email"
            type="email"
            value={supplier.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="email@exemplo.com"
            className="border-violet-200 focus-visible:ring-violet-500 bg-white/70 shadow-sm"
          />
        </motion.div>

        <motion.div variants={item}>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <Input
            id="phone"
            value={supplier.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="(00) 00000-0000"
            className="border-violet-200 focus-visible:ring-violet-500 bg-white/70 shadow-sm"
          />
        </motion.div>

        <motion.div className="md:col-span-2" variants={item}>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <Input
            id="website"
            value={supplier.website}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="www.example.com"
            className="border-violet-200 focus-visible:ring-violet-500 bg-white/70 shadow-sm"
          />
        </motion.div>

        <motion.div className="md:col-span-2" variants={item}>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="status"
            value={supplier.isActive ? "true" : "false"}
            onChange={(e) => {
              const syntheticEvent = {
                ...e,
                target: { ...e.target, id: 'isActive', value: e.target.value === "true" }
              } as unknown as React.ChangeEvent<HTMLSelectElement>;
              handleInputChange(syntheticEvent);
            }}
            disabled={!isEditing}
            className="w-full rounded-md border border-violet-200 bg-white/70 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10 shadow-sm"
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </motion.div>
      </motion.div>
    </ScrollArea>
  );
};

export default DadosTab;
