
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PermissionServiceFactory } from '../../PermissionServiceFactory';

// Mock Supabase para testes de fluxo de dados
const mockSupabaseClient = {
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
  }),
  rpc: vi.fn(),
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    }),
  },
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient,
}));

describe('Permission Data Flow Integration Tests', () => {
  let permissionGroupService: any;
  let systemMenuService: any;
  let systemModuleService: any;
  let validationService: any;

  beforeEach(() => {
    permissionGroupService = PermissionServiceFactory.getPermissionGroupService();
    systemMenuService = PermissionServiceFactory.getSystemMenuService();
    systemModuleService = PermissionServiceFactory.getSystemModuleService();
    validationService = PermissionServiceFactory.getPermissionValidationService();
    vi.clearAllMocks();
  });

  describe('Complete CRUD Data Flow', () => {
    it('should maintain data consistency through complete CRUD operations', async () => {
      const testGroup = {
        name: 'Integration Test Group',
        description: 'Created during integration testing',
        is_admin: false,
        allow_admin_access: false,
        menu_keys: ['dashboard', 'suppliers'],
      };

      // 1. CREATE - Criar grupo
      mockSupabaseClient.from.mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...testGroup, id: 'test-id-1' },
          error: null,
        }),
      });

      const createResult = await permissionGroupService.create(testGroup);
      expect(createResult.success).toBe(true);

      // 2. READ - Buscar grupo criado
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...testGroup, id: 'test-id-1' },
          error: null,
        }),
      });

      const retrievedGroup = await permissionGroupService.getById('test-id-1');
      expect(retrievedGroup).toBeDefined();
      expect(retrievedGroup.name).toBe(testGroup.name);

      // 3. UPDATE - Atualizar grupo
      const updateData = {
        id: 'test-id-1',
        name: 'Updated Integration Test Group',
        description: 'Updated during integration testing',
        is_admin: false,
        allow_admin_access: true,
        menu_keys: ['dashboard', 'suppliers', 'partners'],
      };

      mockSupabaseClient.from.mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: updateData,
          error: null,
        }),
      });

      const updateResult = await permissionGroupService.update(updateData);
      expect(updateResult.success).toBe(true);

      // 4. DELETE - Remover grupo
      mockSupabaseClient.from.mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      });

      const deleteResult = await permissionGroupService.delete('test-id-1');
      expect(deleteResult.success).toBe(true);
    });
  });

  describe('Cross-Service Data Validation', () => {
    it('should validate data consistency between menus and permissions', async () => {
      // Mock menus disponíveis
      const availableMenus = [
        { id: '1', menu_key: 'dashboard', display_name: 'Dashboard' },
        { id: '2', menu_key: 'suppliers', display_name: 'Suppliers' },
        { id: '3', menu_key: 'partners', display_name: 'Partners' },
      ];

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: availableMenus,
          error: null,
        }),
      });

      const menus = await systemMenuService.getAll();
      expect(menus).toHaveLength(3);

      // Testar permissões para menus específicos
      mockSupabaseClient.rpc.mockResolvedValue({
        data: [{ menu_key: 'dashboard' }, { menu_key: 'suppliers' }],
        error: null,
      });

      const allowedMenuKeys = await systemMenuService.getAllowedMenusForUser();
      expect(allowedMenuKeys).toContain('dashboard');
      expect(allowedMenuKeys).toContain('suppliers');
      expect(allowedMenuKeys).not.toContain('partners');
    });

    it('should validate module permissions consistency', async () => {
      const availableModules = [
        {
          id: '1',
          module_key: 'suppliers',
          module_name: 'Suppliers Management',
          actions: [
            { action_key: 'create', action_name: 'Create' },
            { action_key: 'read', action_name: 'Read' },
            { action_key: 'update', action_name: 'Update' },
          ],
        },
      ];

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: availableModules,
          error: null,
        }),
      });

      const modules = await systemModuleService.getAll();
      expect(modules).toHaveLength(1);
      expect(modules[0].actions).toHaveLength(3);

      // Testar validação de ação específica
      mockSupabaseClient.rpc.mockResolvedValue({
        data: [{ module_key: 'suppliers', actions: ['create', 'read'] }],
        error: null,
      });

      const canCreate = await systemModuleService.validateModuleAccess('suppliers', 'create');
      const canUpdate = await systemModuleService.validateModuleAccess('suppliers', 'update');

      expect(canCreate).toBe(true);
      expect(canUpdate).toBe(false);
    });
  });

  describe('Transaction-like Operations', () => {
    it('should handle complex permission updates atomically', async () => {
      // Simular operação complexa que envolve múltiplos serviços
      const permissionData = {
        id: 'test-group-id',
        name: 'Complex Permission Group',
        description: 'Group with complex permissions',
        is_admin: false,
        allow_admin_access: false,
        menu_keys: ['dashboard', 'suppliers', 'partners'],
      };

      // Mock para verificar se todos os menus existem
      mockSupabaseClient.from.mockImplementation((table) => {
        if (table === 'system_menus') {
          return {
            select: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({
              data: [
                { menu_key: 'dashboard' },
                { menu_key: 'suppliers' },
                { menu_key: 'partners' },
              ],
              error: null,
            }),
          };
        }
        
        return {
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: permissionData,
            error: null,
          }),
        };
      });

      // 1. Verificar se menus existem
      const menuKeys = ['dashboard', 'suppliers', 'partners'];
      const existingMenus = await systemMenuService.getByKeys(menuKeys);
      expect(existingMenus).toHaveLength(3);

      // 2. Atualizar grupo de permissão
      const updateResult = await permissionGroupService.update(permissionData);
      expect(updateResult.success).toBe(true);

      // 3. Validar que as permissões foram aplicadas
      mockSupabaseClient.rpc.mockResolvedValue({
        data: [
          { menu_key: 'dashboard' },
          { menu_key: 'suppliers' },
          { menu_key: 'partners' },
        ],
        error: null,
      });

      const hasAccessToDashboard = await validationService.canAccessMenu('dashboard');
      const hasAccessToSuppliers = await validationService.canAccessMenu('suppliers');
      const hasAccessToPartners = await validationService.canAccessMenu('partners');

      expect(hasAccessToDashboard).toBe(true);
      expect(hasAccessToSuppliers).toBe(true);
      expect(hasAccessToPartners).toBe(true);
    });
  });

  describe('Error Recovery and Rollback', () => {
    it('should handle partial failures gracefully', async () => {
      // Simular falha parcial durante operação complexa
      let callCount = 0;
      
      mockSupabaseClient.from.mockImplementation(() => {
        callCount++;
        if (callCount === 2) {
          // Segunda chamada falha
          return {
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Update failed' },
            }),
          };
        }
        
        return {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        };
      });

      // Tentar operação que falhará parcialmente
      const groups = await permissionGroupService.getAll();
      expect(groups).toEqual([]);

      const updateResult = await permissionGroupService.update({
        id: 'test-id',
        name: 'Test',
        description: 'Test',
        is_admin: false,
        allow_admin_access: false,
        menu_keys: [],
      });

      expect(updateResult.success).toBe(false);
    });
  });
});
