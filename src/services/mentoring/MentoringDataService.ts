
import { MentoringCatalog, CreateMentoringCatalogData, MentoringExtensionOption } from '@/types/mentoring.types';
import { expandedMentoringCatalog } from '@/data/expandedMentoringData';
import { calculateSessionsFromFrequency } from '@/utils/mentoringCalculations';

export class MentoringDataService {
  private catalogs: MentoringCatalog[] = [...expandedMentoringCatalog];

  getCatalogs(): MentoringCatalog[] {
    return this.catalogs.map(catalog => ({
      ...catalog,
      extensions: catalog.extensions || [
        {
          id: `ext-1-${catalog.id}`,
          months: 3,
          price: catalog.price * 0.3,
          totalSessions: calculateSessionsFromFrequency(3, catalog.frequency || 'Semanal'),
          description: `Extensão de 3 meses para ${catalog.name}`,
          checkoutLinks: {
            mercadoPago: 'https://mercadopago.com/checkout/ext-3-months',
            hubla: 'https://hubla.com/checkout/ext-3-months',
            hotmart: 'https://hotmart.com/checkout/ext-3-months'
          }
        },
        {
          id: `ext-2-${catalog.id}`,
          months: 6,
          price: catalog.price * 0.5,
          totalSessions: calculateSessionsFromFrequency(6, catalog.frequency || 'Semanal'),
          description: `Extensão de 6 meses para ${catalog.name}`,
          checkoutLinks: {
            mercadoPago: 'https://mercadopago.com/checkout/ext-6-months',
            hubla: 'https://hubla.com/checkout/ext-6-months'
          }
        }
      ]
    }));
  }

  getCatalogById(id: string): MentoringCatalog | null {
    return this.catalogs.find(c => c.id === id) || null;
  }

  createCatalog(data: CreateMentoringCatalogData): MentoringCatalog {
    const newCatalog: MentoringCatalog = {
      id: `catalog-${Date.now()}`,
      name: data.name,
      type: data.type,
      instructor: data.instructor,
      durationMonths: data.durationMonths,
      frequency: data.frequency || 'Semanal',
      numberOfSessions: data.numberOfSessions || calculateSessionsFromFrequency(data.durationMonths, data.frequency || 'Semanal'),
      totalSessions: data.numberOfSessions || calculateSessionsFromFrequency(data.durationMonths, data.frequency || 'Semanal'),
      price: data.price,
      description: data.description,
      tags: [],
      active: data.active ?? true,
      status: data.status ?? 'Ativa',
      extensions: data.extensions || [],
      checkoutLinks: data.checkoutLinks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.catalogs.push(newCatalog);
    return newCatalog;
  }

  updateCatalog(id: string, data: Partial<CreateMentoringCatalogData>): boolean {
    const index = this.catalogs.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.catalogs[index] = {
      ...this.catalogs[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return true;
  }

  deleteCatalog(id: string): boolean {
    const index = this.catalogs.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.catalogs.splice(index, 1);
    return true;
  }
}
