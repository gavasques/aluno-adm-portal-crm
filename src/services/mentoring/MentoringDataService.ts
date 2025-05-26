
import { MentoringCatalog, CreateMentoringCatalogData } from '@/types/mentoring.types';

export class MentoringDataService {
  private catalogs: MentoringCatalog[] = [];

  getCatalogs(): MentoringCatalog[] {
    return [...this.catalogs];
  }

  getCatalogById(id: string): MentoringCatalog | null {
    return this.catalogs.find(c => c.id === id) || null;
  }

  createCatalog(data: CreateMentoringCatalogData): MentoringCatalog {
    const newCatalog: MentoringCatalog = {
      id: `catalog-${Date.now()}`,
      ...data,
      totalSessions: data.numberOfSessions,
      tags: [],
      active: data.active ?? true,
      status: data.status ?? 'Ativa',
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
      status: data.status ?? this.catalogs[index].status,
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
