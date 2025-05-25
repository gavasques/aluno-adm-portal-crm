
import { SystemMenu } from '@/types/permissions';

export class SystemMenuModel {
  public readonly id: string;
  public readonly menuKey: string;
  public readonly displayName: string;
  public readonly description?: string;
  public readonly icon?: string;
  public readonly createdAt: string;

  constructor(data: SystemMenu) {
    this.id = data.id;
    this.menuKey = data.menu_key;
    this.displayName = data.display_name;
    this.description = data.description;
    this.icon = data.icon;
    this.createdAt = data.created_at;
  }

  static fromApiData(data: SystemMenu): SystemMenuModel {
    return new SystemMenuModel(data);
  }

  static fromApiDataArray(data: SystemMenu[]): SystemMenuModel[] {
    return data.map(item => SystemMenuModel.fromApiData(item));
  }

  // Business logic
  public isAccessibleBy(allowedMenuKeys: string[]): boolean {
    return allowedMenuKeys.includes(this.menuKey);
  }

  public matches(searchTerm: string): boolean {
    const term = searchTerm.toLowerCase();
    return this.displayName.toLowerCase().includes(term) ||
           this.menuKey.toLowerCase().includes(term) ||
           (this.description?.toLowerCase().includes(term) ?? false);
  }

  // Conversion
  public toSelectOption() {
    return {
      value: this.menuKey,
      label: this.displayName,
      description: this.description,
    };
  }
}
