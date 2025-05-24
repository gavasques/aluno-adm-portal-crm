
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Partner } from "@/types/partner.types";
import { motion } from "framer-motion";
import { Users, Mail, Phone, User } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface ContactsTabProps {
  partner: Partner;
}

const ContactsTab: React.FC<ContactsTabProps> = ({ partner }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="space-y-4">
      {partner.contacts && partner.contacts.length > 0 ? (
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {partner.contacts.map((contact, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white border-l-4 border-l-emerald-500 border border-emerald-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center mb-2 md:mb-0">
                  <div className="bg-emerald-100 p-2 rounded-full mr-3">
                    <User className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{contact.name}</h3>
                    <p className="text-sm text-emerald-700">{contact.role}</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="flex items-center text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1 rounded transition-colors">
                        <Mail className="h-3 w-3 mr-2" />
                        <span className="truncate max-w-[150px]">{contact.email}</span>
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-auto">
                      <p className="text-sm">Enviar email para: {contact.email}</p>
                    </HoverCardContent>
                  </HoverCard>
                  
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="flex items-center text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1 rounded transition-colors">
                        <Phone className="h-3 w-3 mr-2" />
                        <span>{contact.phone}</span>
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-auto">
                      <p className="text-sm">Ligar para: {contact.phone}</p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-10 px-6 bg-white/80 rounded-lg border border-dashed border-emerald-200"
        >
          <Users className="h-12 w-12 mx-auto text-emerald-300 mb-3" />
          <p className="text-gray-500 mb-3">
            Nenhum contato cadastrado para este parceiro.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ContactsTab;
