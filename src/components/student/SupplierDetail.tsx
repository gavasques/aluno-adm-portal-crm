
import React, { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import SupplierHeader from "./supplier-detail/SupplierHeader";
import SupplierTabs from "./supplier-detail/SupplierTabs";

interface SupplierDetailProps {
  supplier: any;
  onBack: () => void;
  onUpdate: (updatedSupplier: any) => void;
}

const SupplierDetail: React.FC<SupplierDetailProps> = ({ supplier, onBack, onUpdate }) => {
  const [editedSupplier, setEditedSupplier] = useState({ ...supplier });
  const [activeTab, setActiveTab] = useState("dados");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Garantir que todas as propriedades necessárias existam
  if (!editedSupplier.images) editedSupplier.images = [];
  if (!editedSupplier.communications) editedSupplier.communications = [];
  if (!editedSupplier.brands) editedSupplier.brands = [];
  if (!editedSupplier.branches) editedSupplier.branches = [];
  if (!editedSupplier.contacts) editedSupplier.contacts = [];
  if (!editedSupplier.files) editedSupplier.files = [];
  if (!editedSupplier.ratings) editedSupplier.ratings = [];
  if (!editedSupplier.comments) editedSupplier.comments = [];

  const handleSave = () => {
    // Validar campos obrigatórios
    if (!editedSupplier.name || !editedSupplier.category) {
      toast.error("Nome e categoria são campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    
    // Simular delay de processamento
    setTimeout(() => {
      onUpdate(editedSupplier);
      setIsEditing(false);
      setIsSubmitting(false);
      toast.success("Dados do fornecedor atualizados com sucesso!", {
        position: "top-center",
        style: {
          background: "linear-gradient(to right, #8B5CF6, #6366F1)",
          color: "white",
          fontSize: "16px",
        },
      });
    }, 800);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setEditedSupplier({ ...editedSupplier, [id]: value });
  };

  // Update a specific property of the supplier
  const updateSupplierProperty = (property: string, value: any) => {
    setEditedSupplier({ ...editedSupplier, [property]: value });
  };

  return (
    <motion.div
      className="container mx-auto py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        background: "radial-gradient(circle at 50% 0%, rgba(251, 254, 251, 0.12), rgba(255, 255, 255, 0))"
      }}
    >
      <SupplierHeader supplier={editedSupplier} onBack={onBack} />
      
      <SupplierTabs 
        supplier={editedSupplier}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isEditing={isEditing}
        handleInputChange={handleInputChange}
        updateSupplierProperty={updateSupplierProperty}
      />
    </motion.div>
  );
};

export default SupplierDetail;
