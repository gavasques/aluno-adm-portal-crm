
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { CRMFilters, LeadWithContacts, CRMPipelineColumn, CRMPipeline } from '@/types/crm.types';

// Estado global do CRM
interface CRMState {
  // Dados principais
  leadsWithContacts: LeadWithContacts[];
  leadsByColumn: Record<string, LeadWithContacts[]>;
  pipelines: CRMPipeline[];
  columns: CRMPipelineColumn[];
  
  // Estados de UI
  selectedPipelineId: string | null;
  filters: CRMFilters;
  isLoading: boolean;
  error: string | null;
  
  // Estados de operação
  selectedLeadId: string | null;
  isDragging: boolean;
  isFormOpen: boolean;
  isDetailOpen: boolean;
  
  // Real-time
  lastUpdate: number;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
}

// Ações do reducer
type CRMAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LEADS'; payload: LeadWithContacts[] }
  | { type: 'SET_LEADS_BY_COLUMN'; payload: Record<string, LeadWithContacts[]> }
  | { type: 'SET_PIPELINES'; payload: CRMPipeline[] }
  | { type: 'SET_COLUMNS'; payload: CRMPipelineColumn[] }
  | { type: 'SET_FILTERS'; payload: Partial<CRMFilters> }
  | { type: 'SET_SELECTED_PIPELINE'; payload: string | null }
  | { type: 'SET_SELECTED_LEAD'; payload: string | null }
  | { type: 'SET_DRAGGING'; payload: boolean }
  | { type: 'SET_FORM_OPEN'; payload: boolean }
  | { type: 'SET_DETAIL_OPEN'; payload: boolean }
  | { type: 'UPDATE_LEAD'; payload: LeadWithContacts }
  | { type: 'REMOVE_LEAD'; payload: string }
  | { type: 'MOVE_LEAD'; payload: { leadId: string; newColumnId: string } }
  | { type: 'SET_CONNECTION_STATUS'; payload: 'connected' | 'disconnected' | 'reconnecting' }
  | { type: 'REFRESH_DATA' };

// Estado inicial
const initialState: CRMState = {
  leadsWithContacts: [],
  leadsByColumn: {},
  pipelines: [],
  columns: [],
  selectedPipelineId: null,
  filters: {},
  isLoading: false,
  error: null,
  selectedLeadId: null,
  isDragging: false,
  isFormOpen: false,
  isDetailOpen: false,
  lastUpdate: Date.now(),
  connectionStatus: 'disconnected'
};

// Reducer principal
const crmReducer = (state: CRMState, action: CRMAction): CRMState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_LEADS':
      return { 
        ...state, 
        leadsWithContacts: action.payload,
        lastUpdate: Date.now(),
        isLoading: false,
        error: null
      };
    
    case 'SET_LEADS_BY_COLUMN':
      return { ...state, leadsByColumn: action.payload };
    
    case 'SET_PIPELINES':
      return { ...state, pipelines: action.payload };
    
    case 'SET_COLUMNS':
      return { ...state, columns: action.payload };
    
    case 'SET_FILTERS':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload } 
      };
    
    case 'SET_SELECTED_PIPELINE':
      return { 
        ...state, 
        selectedPipelineId: action.payload,
        filters: { ...state.filters, pipeline_id: action.payload || undefined }
      };
    
    case 'SET_SELECTED_LEAD':
      return { ...state, selectedLeadId: action.payload };
    
    case 'SET_DRAGGING':
      return { ...state, isDragging: action.payload };
    
    case 'SET_FORM_OPEN':
      return { ...state, isFormOpen: action.payload };
    
    case 'SET_DETAIL_OPEN':
      return { ...state, isDetailOpen: action.payload };
    
    case 'UPDATE_LEAD': {
      const updatedLeads = state.leadsWithContacts.map(lead =>
        lead.id === action.payload.id ? action.payload : lead
      );
      return {
        ...state,
        leadsWithContacts: updatedLeads,
        lastUpdate: Date.now()
      };
    }
    
    case 'REMOVE_LEAD': {
      const filteredLeads = state.leadsWithContacts.filter(
        lead => lead.id !== action.payload
      );
      return {
        ...state,
        leadsWithContacts: filteredLeads,
        lastUpdate: Date.now()
      };
    }
    
    case 'MOVE_LEAD': {
      const { leadId, newColumnId } = action.payload;
      const updatedLeads = state.leadsWithContacts.map(lead =>
        lead.id === leadId ? { ...lead, column_id: newColumnId } : lead
      );
      return {
        ...state,
        leadsWithContacts: updatedLeads,
        lastUpdate: Date.now()
      };
    }
    
    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };
    
    case 'REFRESH_DATA':
      return { ...state, lastUpdate: Date.now() };
    
    default:
      return state;
  }
};

// Context
interface CRMContextType {
  state: CRMState;
  actions: {
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setLeads: (leads: LeadWithContacts[]) => void;
    setLeadsByColumn: (leadsByColumn: Record<string, LeadWithContacts[]>) => void;
    setPipelines: (pipelines: CRMPipeline[]) => void;
    setColumns: (columns: CRMPipelineColumn[]) => void;
    setFilters: (filters: Partial<CRMFilters>) => void;
    setSelectedPipeline: (pipelineId: string | null) => void;
    setSelectedLead: (leadId: string | null) => void;
    setDragging: (isDragging: boolean) => void;
    setFormOpen: (isOpen: boolean) => void;
    setDetailOpen: (isOpen: boolean) => void;
    updateLead: (lead: LeadWithContacts) => void;
    removeLead: (leadId: string) => void;
    moveLead: (leadId: string, newColumnId: string) => void;
    setConnectionStatus: (status: 'connected' | 'disconnected' | 'reconnecting') => void;
    refreshData: () => void;
  };
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

// Provider
interface CRMProviderProps {
  children: React.ReactNode;
}

export const CRMProvider: React.FC<CRMProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(crmReducer, initialState);

  // Actions
  const actions = {
    setLoading: useCallback((loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: loading });
    }, []),

    setError: useCallback((error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    }, []),

    setLeads: useCallback((leads: LeadWithContacts[]) => {
      dispatch({ type: 'SET_LEADS', payload: leads });
      
      // Agrupar automaticamente por coluna
      const leadsByColumn = leads.reduce((acc, lead) => {
        if (lead.column_id) {
          if (!acc[lead.column_id]) acc[lead.column_id] = [];
          acc[lead.column_id].push(lead);
        }
        return acc;
      }, {} as Record<string, LeadWithContacts[]>);
      
      dispatch({ type: 'SET_LEADS_BY_COLUMN', payload: leadsByColumn });
    }, []),

    setLeadsByColumn: useCallback((leadsByColumn: Record<string, LeadWithContacts[]>) => {
      dispatch({ type: 'SET_LEADS_BY_COLUMN', payload: leadsByColumn });
    }, []),

    setPipelines: useCallback((pipelines: CRMPipeline[]) => {
      dispatch({ type: 'SET_PIPELINES', payload: pipelines });
    }, []),

    setColumns: useCallback((columns: CRMPipelineColumn[]) => {
      dispatch({ type: 'SET_COLUMNS', payload: columns });
    }, []),

    setFilters: useCallback((filters: Partial<CRMFilters>) => {
      dispatch({ type: 'SET_FILTERS', payload: filters });
    }, []),

    setSelectedPipeline: useCallback((pipelineId: string | null) => {
      dispatch({ type: 'SET_SELECTED_PIPELINE', payload: pipelineId });
    }, []),

    setSelectedLead: useCallback((leadId: string | null) => {
      dispatch({ type: 'SET_SELECTED_LEAD', payload: leadId });
    }, []),

    setDragging: useCallback((isDragging: boolean) => {
      dispatch({ type: 'SET_DRAGGING', payload: isDragging });
    }, []),

    setFormOpen: useCallback((isOpen: boolean) => {
      dispatch({ type: 'SET_FORM_OPEN', payload: isOpen });
    }, []),

    setDetailOpen: useCallback((isOpen: boolean) => {
      dispatch({ type: 'SET_DETAIL_OPEN', payload: isOpen });
    }, []),

    updateLead: useCallback((lead: LeadWithContacts) => {
      dispatch({ type: 'UPDATE_LEAD', payload: lead });
    }, []),

    removeLead: useCallback((leadId: string) => {
      dispatch({ type: 'REMOVE_LEAD', payload: leadId });
    }, []),

    moveLead: useCallback((leadId: string, newColumnId: string) => {
      dispatch({ type: 'MOVE_LEAD', payload: { leadId, newColumnId } });
    }, []),

    setConnectionStatus: useCallback((status: 'connected' | 'disconnected' | 'reconnecting') => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: status });
    }, []),

    refreshData: useCallback(() => {
      dispatch({ type: 'REFRESH_DATA' });
    }, [])
  };

  console.log('🏗️ [CRM_CONTEXT] Estado atual:', {
    leadsCount: state.leadsWithContacts.length,
    selectedPipeline: state.selectedPipelineId,
    isLoading: state.isLoading,
    connectionStatus: state.connectionStatus,
    lastUpdate: new Date(state.lastUpdate).toLocaleTimeString()
  });

  return (
    <CRMContext.Provider value={{ state, actions }}>
      {children}
    </CRMContext.Provider>
  );
};

// Hook para usar o context
export const useCRMContext = () => {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error('useCRMContext deve ser usado dentro de um CRMProvider');
  }
  return context;
};

// Hooks específicos para facilitar o uso
export const useCRMState = () => {
  const { state } = useCRMContext();
  return state;
};

export const useCRMActions = () => {
  const { actions } = useCRMContext();
  return actions;
};

export const useCRMLeads = () => {
  const { state } = useCRMContext();
  return {
    leads: state.leadsWithContacts,
    leadsByColumn: state.leadsByColumn,
    isLoading: state.isLoading,
    error: state.error
  };
};

export const useCRMFilters = () => {
  const { state, actions } = useCRMContext();
  return {
    filters: state.filters,
    selectedPipelineId: state.selectedPipelineId,
    setFilters: actions.setFilters,
    setSelectedPipeline: actions.setSelectedPipeline
  };
};
