
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import PipelinesList from './PipelinesList';
import ColumnsManager from './ColumnsManager';
import { CRMPipeline } from '@/types/crm.types';
import { motion, AnimatePresence } from 'framer-motion';

interface PipelineManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PipelineManagerDialog = ({ open, onOpenChange }: PipelineManagerDialogProps) => {
  const [selectedPipeline, setSelectedPipeline] = useState<CRMPipeline | null>(null);
  const [activeTab, setActiveTab] = useState('pipelines');
  const { pipelines, loading, fetchPipelines } = useCRMPipelines();

  const handlePipelineSelect = (pipeline: CRMPipeline) => {
    setSelectedPipeline(pipeline);
    setActiveTab('columns');
  };

  const handleRefresh = () => {
    fetchPipelines();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'pipelines') {
      setSelectedPipeline(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 border-0 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="h-full flex flex-col"
        >
          {/* Header with Glassmorphism Effect */}
          <DialogHeader className="px-8 py-6 border-b border-white/20 bg-white/60 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Gerenciar Pipelines
                </DialogTitle>
                <p className="text-gray-600 mt-1 font-medium">
                  Configure e organize seus fluxos de trabalho
                </p>
              </div>
              <Badge 
                variant="outline" 
                className="bg-white/80 border-blue-200 text-blue-700 font-semibold px-3 py-1"
              >
                {pipelines.length} {pipelines.length === 1 ? 'Pipeline' : 'Pipelines'}
              </Badge>
            </div>
          </DialogHeader>
          
          {/* Modern Tabs with Enhanced Styling */}
          <div className="flex-1 flex flex-col px-8 py-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/60 backdrop-blur-sm border border-white/30 p-1 rounded-xl shadow-lg">
                <TabsTrigger 
                  value="pipelines"
                  className="rounded-lg font-semibold transition-all data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 text-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    Pipelines
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="columns" 
                  disabled={!selectedPipeline}
                  className="rounded-lg font-semibold transition-all data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 text-gray-600 disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    Colunas
                    {selectedPipeline && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full ml-1 truncate max-w-20">
                        {selectedPipeline.name}
                      </span>
                    )}
                  </div>
                </TabsTrigger>
              </TabsList>
              
              {/* Content Area with Smooth Transitions */}
              <div className="flex-1 mt-6 overflow-hidden">
                <AnimatePresence mode="wait">
                  <TabsContent value="pipelines" className="h-full mt-0">
                    <motion.div
                      key="pipelines"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <PipelinesList
                        pipelines={pipelines}
                        loading={loading}
                        onPipelineSelect={handlePipelineSelect}
                        onRefresh={handleRefresh}
                      />
                    </motion.div>
                  </TabsContent>
                  
                  <TabsContent value="columns" className="h-full mt-0">
                    {selectedPipeline && (
                      <motion.div
                        key="columns"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <ColumnsManager
                          pipeline={selectedPipeline}
                          onBack={() => setActiveTab('pipelines')}
                          onRefresh={handleRefresh}
                        />
                      </motion.div>
                    )}
                  </TabsContent>
                </AnimatePresence>
              </div>
            </Tabs>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default PipelineManagerDialog;
