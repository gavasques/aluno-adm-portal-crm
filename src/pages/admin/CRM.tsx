import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { Plus, Search, Settings } from "lucide-react";

// Import our components
import SortableColumn from "@/components/admin/crm/SortableColumn";
import SortableLeadCard from "@/components/admin/crm/SortableLeadCard";
import NewLeadForm from "@/components/admin/crm/NewLeadForm";
import EditLeadForm from "@/components/admin/crm/EditLeadForm";
import LeadDetailDialog from "@/components/admin/crm/LeadDetailDialog";
import ColumnManager from "@/components/admin/crm/ColumnManager";
import KanbanView from "@/components/admin/crm/KanbanView";
import ListView from "@/components/admin/crm/ListView";

// Import our custom hook
import { useCRMState } from "@/hooks/useCRMState";

const CRM = () => {
  // Use our custom hook
  const {
    columns,
    filteredLeads,
    activeView,
    searchQuery,
    isEditingColumns,
    selectedLead,
    isEditingLead,
    leadToEdit,
    columnsModified,
    administrators,
    
    setActiveView,
    setSearchQuery,
    setIsEditingColumns, // Added this from useCRMState
    setIsEditingLead, // Added this from useCRMState
    
    openLeadDetails,
    openLeadEditForm,
    handleAddNewLead,
    handleSaveLeadEdit,
    addColumn,
    removeColumn,
    handleDragEnd,
    handleColumnReorder,
    startEditingColumns,
    cancelEditingColumns,
    saveColumnChanges
  } = useCRMState();

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'CRM / Gestão de Leads' }
  ];

  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin"
        className="mb-6"
      />

      <div className="flex flex-col mb-4">
        <h1 className="text-3xl font-bold text-portal-dark mb-4">CRM / Gestão de Leads</h1>
        <div className="flex gap-2 justify-start">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-neutral-900 hover:bg-neutral-800">
                <Plus className="mr-2 h-4 w-4" /> Novo Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Lead</DialogTitle>
              </DialogHeader>
              <NewLeadForm 
                administrators={administrators}
                onSubmit={handleAddNewLead}
              />
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={startEditingColumns}>
            <Settings className="mr-2 h-4 w-4" /> Colunas
          </Button>
          
          <ColumnManager
            isOpen={isEditingColumns}
            columns={columns}
            leads={filteredLeads}
            onOpenChange={columnsModified ? undefined : setIsEditingColumns}
            onAddColumn={addColumn}
            onRemoveColumn={removeColumn}
            onReorderColumns={handleColumnReorder}
            onSave={saveColumnChanges}
            onCancel={cancelEditingColumns}
          />
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="sticky top-0 z-20 bg-white py-2">
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center w-full">
              <div className="flex items-center gap-3">
                <div className="flex space-x-2">
                  <Button 
                    variant={activeView === "kanban" ? "default" : "outline"} 
                    onClick={() => setActiveView("kanban")} 
                    size="sm"
                  >
                    Kanban
                  </Button>
                  <Button 
                    variant={activeView === "list" ? "default" : "outline"} 
                    onClick={() => setActiveView("list")} 
                    size="sm"
                  >
                    Lista
                  </Button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    placeholder="Buscar leads..." 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                    className="pl-8 w-full border rounded-md py-2 px-3" 
                  />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {activeView === "kanban" ? (
            <KanbanView
              columns={columns}
              filteredLeads={filteredLeads}
              onDragEnd={handleDragEnd}
              openLeadDetails={openLeadDetails}
            />
          ) : (
            <ListView
              filteredLeads={filteredLeads}
              columns={columns}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              openLeadDetails={openLeadDetails}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Lead Detail Dialog */}
      <LeadDetailDialog 
        lead={selectedLead}
        columns={columns}
        onClose={() => openLeadDetails(null)}
        onEdit={(lead) => {
          openLeadEditForm(lead);
          openLeadDetails(null);
        }}
      />
      
      {/* Lead Edit Dialog */}
      <Dialog open={isEditingLead} onOpenChange={open => !open && setIsEditingLead(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Lead</DialogTitle>
          </DialogHeader>
          <EditLeadForm 
            lead={leadToEdit}
            administrators={administrators}
            onSubmit={handleSaveLeadEdit}
            onCancel={() => setIsEditingLead(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CRM;
