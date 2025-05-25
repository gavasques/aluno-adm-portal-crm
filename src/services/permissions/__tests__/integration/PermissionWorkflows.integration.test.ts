
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PermissionServiceFactory } from '../../PermissionServiceFactory';

// Mock completo do Supabase para testes de integração
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
    getUser: vi.fn(),
  },
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient,
}));

describe('Permission System Integration Tests', () => {
  let permissionGroupService: any;
  let systemMenuService: any;
  let validationService: any;

  beforeEach(() => {
    // Obter instâncias dos serviços via factory
    permissionGroupService = PermissionServiceFactory.getPermissionGroupService();
    systemMenuService = PermissionServiceFactory.getSystemMenuService();
    validationService = PermissionServiceFactory.getPermissionValidationService();
    
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Complete Permission Group Workflow', () => {
    it('should create, validate, and manage a complete permission group lifecycle', async () => {
      // Mock data para o fluxo completo
      const mockGroup = {
        id: '1',
        name: 'Test Group',
        description: 'Test Description',
        is_admin: false,
        allow_admin_access: false,
      };

      const mockMenus = [
        { id: '1', menu_key: 'dashboard', display_name: 'Dashboard' },
        { id: '2', menu_key: 'users', display_name: 'Users' },
      ];

      // Setup mocks para o fluxo completo
      mockSupabaseClient.from.mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockGroup, error: null }),
        order: vi.fn().mockResolvedValue({ data: mockMenus, error: null }),
      });

      // 1. Criar grupo de permissão
      const createResult = await permissionGroupService.create({
        name: 'Test Group',
        description: 'Test Description',
        is_admin: false,
        allow_admin_access: false,
        menu_keys: ['dashboard', 'users'],
      });

      expect(createResult.success).toBe(true);

      // 2. Buscar menus do sistema
      const menus = await systemMenuService.getAll();
      expect(menus).toHaveLength(2);

      // 3. Validar permissões
      mockSupabaseClient.rpc.mockResolvedValue({
        data: [{ menu_key: 'dashboard' }],
        error: null,
      });

      const hasAccess = await validationService.canAccessMenu('dashboard');
      expect(hasAccess).toBe(true);
    });

    it('should handle permission validation workflow', async () => {
      // Setup para validação de admin
      mockSupabaseClient.rpc.mockImplementation((functionName) => {
        if (functionName === 'is_admin') {
          return Promise.resolve({ data: true, error: null });
        }
        if (functionName === 'get_allowed_menus') {
          return Promise.resolve({
            data: [{ menu_key: 'admin' }, { menu_key: 'dashboard' }],
            error: null,
          });
        }
        return Promise.resolve({ data: null, error: null });
      });

      // Testar se é admin
      const isAdmin = await validationService.isAdmin();
      expect(isAdmin).toBe(true);

      // Testar acesso a menus
      const canAccessAdmin = await validationService.canAccessMenu('admin');
      expect(canAccessAdmin).toBe(true);

      const canAccessDashboard = await validationService.canAccessMenu('dashboard');
      expect(canAccessDashboard).toBe(true);

      const canAccessRestricted = await validationService.canAccessMenu('restricted');
      expect(canAccessRestricted).toBe(false);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle database errors gracefully across services', async () => {
      // Simular erro de banco de dados
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database connection failed' },
        }),
      });

      // Testar tratamento de erro
      const groups = await permissionGroupService.getAll();
      expect(groups).toEqual([]);

      const menus = await systemMenuService.getAll();
      expect(menus).toEqual([]);
    });

    it('should validate data integrity across service calls', async () => {
      const invalidData = {
        name: '', // Nome vazio
        description: 'Test',
        is_admin: 'not-boolean', // Tipo incorreto
      };

      const validation = await validationService.validatePermissionGroupData(invalidData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Integration Tests', () => {
    it('should handle multiple concurrent operations efficiently', async () => {
      const startTime = Date.now();

      // Simular múltiplas operações concorrentes
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      });

      mockSupabaseClient.rpc.mockResolvedValue({ data: [], error: null });

      // Executar operações em paralelo
      const operations = await Promise.all([
        permissionGroupService.getAll(),
        systemMenuService.getAll(),
        validationService.canAccessMenu('dashboard'),
        validationService.isAdmin(),
      ]);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Verificar que todas as operações foram concluídas
      expect(operations).toHaveLength(4);
      
      // Verificar performance razoável (menos de 100ms para mocks)
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Service Factory Integration', () => {
    it('should maintain singleton pattern across multiple calls', () => {
      const service1 = PermissionServiceFactory.getPermissionGroupService();
      const service2 = PermissionServiceFactory.getPermissionGroupService();
      const service3 = PermissionServiceFactory.getSystemMenuService();
      const service4 = PermissionServiceFactory.getSystemMenuService();

      // Verificar que as instâncias são as mesmas (singleton)
      expect(service1).toBe(service2);
      expect(service3).toBe(service4);
      expect(service1).not.toBe(service3);
    });

    it('should provide all required services', () => {
      const permissionGroupService = PermissionServiceFactory.getPermissionGroupService();
      const systemMenuService = PermissionServiceFactory.getSystemMenuService();
      const systemModuleService = PermissionServiceFactory.getSystemModuleService();
      const validationService = PermissionServiceFactory.getPermissionValidationService();

      expect(permissionGroupService).toBeDefined();
      expect(systemMenuService).toBeDefined();
      expect(systemModuleService).toBeDefined();
      expect(validationService).toBeDefined();
    });
  });
});
