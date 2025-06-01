
import React from 'react';
import { CRMLead } from '@/types/crm.types';
import { 
  Building2, 
  ShoppingCart, 
  Package, 
  Target,
  DollarSign,
  Calendar,
  Globe,
  MapPin,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LeadDetailOverviewProps {
  lead: CRMLead;
}

export const LeadDetailOverview = ({ lead }: LeadDetailOverviewProps) => {
  const InfoCard = ({ 
    icon: Icon, 
    title, 
    content, 
    color = "blue" 
  }: { 
    icon: any; 
    title: string; 
    content: React.ReactNode; 
    color?: string; 
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg"
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-${color}-100`}>
          <Icon className={`h-5 w-5 text-${color}-600`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <div className="text-gray-700">{content}</div>
        </div>
      </div>
    </motion.div>
  );

  const YesNoIndicator = ({ value, trueText = "Sim", falseText = "Não" }: { value: boolean; trueText?: string; falseText?: string }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
      value 
        ? 'bg-green-100 text-green-800' 
        : 'bg-gray-100 text-gray-600'
    }`}>
      {value ? trueText : falseText}
    </span>
  );

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-blue-50/30 to-purple-50/30 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações da Empresa */}
        <InfoCard
          icon={Building2}
          title="Informações da Empresa"
          color="blue"
          content={
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tem empresa:</span>
                <YesNoIndicator value={lead.has_company} />
              </div>
              {lead.amazon_state && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estado (Amazon):</span>
                  <span className="font-medium">{lead.amazon_state}</span>
                </div>
              )}
              {lead.amazon_tax_regime && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Regime Tributário:</span>
                  <span className="font-medium">{lead.amazon_tax_regime}</span>
                </div>
              )}
            </div>
          }
        />

        {/* Amazon e E-commerce */}
        <InfoCard
          icon={ShoppingCart}
          title="Amazon e E-commerce"
          color="orange"
          content={
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Vende na Amazon:</span>
                <YesNoIndicator value={lead.sells_on_amazon} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trabalha com FBA:</span>
                <YesNoIndicator value={lead.works_with_fba} />
              </div>
              {lead.amazon_store_link && (
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Link da Loja:</span>
                  <a 
                    href={lead.amazon_store_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm break-all"
                  >
                    {lead.amazon_store_link}
                  </a>
                </div>
              )}
            </div>
          }
        />

        {/* Produtos e Negócio */}
        <InfoCard
          icon={Package}
          title="Produtos e Negócio"
          color="green"
          content={
            <div className="space-y-3">
              {lead.what_sells && (
                <div>
                  <span className="text-sm text-gray-600 block mb-1">O que vende:</span>
                  <p className="text-sm">{lead.what_sells}</p>
                </div>
              )}
              {lead.keep_or_new_niches && (
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Nichos:</span>
                  <p className="text-sm">{lead.keep_or_new_niches}</p>
                </div>
              )}
            </div>
          }
        />

        {/* Qualificação */}
        <InfoCard
          icon={Target}
          title="Qualificação"
          color="purple"
          content={
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Busca marca própria:</span>
                <YesNoIndicator value={lead.seeks_private_label} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pronto para investir 3k:</span>
                <YesNoIndicator value={lead.ready_to_invest_3k} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Teve contato com LV:</span>
                <YesNoIndicator value={lead.had_contact_with_lv} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Calendly agendado:</span>
                <YesNoIndicator value={lead.calendly_scheduled} />
              </div>
            </div>
          }
        />

        {/* Datas Importantes */}
        {(lead.scheduled_contact_date || lead.created_at) && (
          <InfoCard
            icon={Calendar}
            title="Datas Importantes"
            color="indigo"
            content={
              <div className="space-y-3">
                {lead.scheduled_contact_date && (
                  <div>
                    <span className="text-sm text-gray-600 block mb-1">Próximo contato:</span>
                    <span className="font-medium">
                      {format(new Date(lead.scheduled_contact_date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Criado em:</span>
                  <span className="font-medium">
                    {format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </span>
                </div>
              </div>
            }
          />
        )}

        {/* Links e Calendly */}
        {lead.calendly_link && (
          <InfoCard
            icon={Globe}
            title="Links"
            color="teal"
            content={
              <div>
                <span className="text-sm text-gray-600 block mb-1">Link do Calendly:</span>
                <a 
                  href={lead.calendly_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm break-all"
                >
                  {lead.calendly_link}
                </a>
              </div>
            }
          />
        )}
      </div>

      {/* Observações */}
      {(lead.notes || lead.main_doubts) && (
        <div className="mt-6 space-y-4">
          {lead.main_doubts && (
            <InfoCard
              icon={FileText}
              title="Principais Dúvidas"
              color="amber"
              content={
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.main_doubts}</p>
              }
            />
          )}
          
          {lead.notes && (
            <InfoCard
              icon={FileText}
              title="Observações"
              color="gray"
              content={
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
              }
            />
          )}
        </div>
      )}

      {/* Tags */}
      {lead.tags && lead.tags.length > 0 && (
        <div className="mt-6">
          <InfoCard
            icon={Target}
            title="Tags"
            color="pink"
            content={
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: tag.color + '20', 
                      color: tag.color,
                      border: `1px solid ${tag.color}40`
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};
