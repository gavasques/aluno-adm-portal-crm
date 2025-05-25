
// Export all permission models
export { PermissionGroupModel } from './PermissionGroup.model';
export { SystemMenuModel } from './SystemMenu.model';

// Import the models for the factory
import { PermissionGroupModel } from './PermissionGroup.model';
import { SystemMenuModel } from './SystemMenu.model';

// Export model utilities
export class PermissionModelFactory {
  static createPermissionGroup(data: any): PermissionGroupModel {
    return PermissionGroupModel.fromApiData(data);
  }

  static createSystemMenu(data: any): SystemMenuModel {
    return SystemMenuModel.fromApiData(data);
  }

  static createPermissionGroupList(data: any[]): PermissionGroupModel[] {
    return data.map(item => PermissionGroupModel.fromApiData(item));
  }

  static createSystemMenuList(data: any[]): SystemMenuModel[] {
    return SystemMenuModel.fromApiDataArray(data);
  }
}
