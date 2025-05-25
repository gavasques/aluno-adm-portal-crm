
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { MentoringCatalog, StudentMentoringEnrollment, MentoringSession, MentoringMaterial } from '@/types/mentoring.types';
import { MentoringFilters } from '../types/contracts.types';

interface MentoringState {
  catalogs: MentoringCatalog[];
  enrollments: StudentMentoringEnrollment[];
  sessions: MentoringSession[];
  materials: MentoringMaterial[];
  loading: boolean;
  error: string | null;
  filters: MentoringFilters;
}

type MentoringAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CATALOGS'; payload: MentoringCatalog[] }
  | { type: 'SET_ENROLLMENTS'; payload: StudentMentoringEnrollment[] }
  | { type: 'SET_SESSIONS'; payload: MentoringSession[] }
  | { type: 'SET_MATERIALS'; payload: MentoringMaterial[] }
  | { type: 'ADD_CATALOG'; payload: MentoringCatalog }
  | { type: 'UPDATE_CATALOG'; payload: { id: string; data: Partial<MentoringCatalog> } }
  | { type: 'DELETE_CATALOG'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<MentoringFilters> };

const initialState: MentoringState = {
  catalogs: [],
  enrollments: [],
  sessions: [],
  materials: [],
  loading: false,
  error: null,
  filters: {}
};

function mentoringReducer(state: MentoringState, action: MentoringAction): MentoringState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CATALOGS':
      return { ...state, catalogs: action.payload };
    case 'SET_ENROLLMENTS':
      return { ...state, enrollments: action.payload };
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };
    case 'SET_MATERIALS':
      return { ...state, materials: action.payload };
    case 'ADD_CATALOG':
      return { ...state, catalogs: [...state.catalogs, action.payload] };
    case 'UPDATE_CATALOG':
      return {
        ...state,
        catalogs: state.catalogs.map(catalog =>
          catalog.id === action.payload.id
            ? { ...catalog, ...action.payload.data }
            : catalog
        )
      };
    case 'DELETE_CATALOG':
      return {
        ...state,
        catalogs: state.catalogs.filter(catalog => catalog.id !== action.payload)
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    default:
      return state;
  }
}

interface MentoringContextType {
  state: MentoringState;
  dispatch: React.Dispatch<MentoringAction>;
}

const MentoringContext = createContext<MentoringContextType | undefined>(undefined);

export const useMentoringContext = () => {
  const context = useContext(MentoringContext);
  if (!context) {
    throw new Error('useMentoringContext must be used within a MentoringProvider');
  }
  return context;
};

interface MentoringProviderProps {
  children: ReactNode;
}

export const MentoringProvider: React.FC<MentoringProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(mentoringReducer, initialState);

  return (
    <MentoringContext.Provider value={{ state, dispatch }}>
      {children}
    </MentoringContext.Provider>
  );
};
