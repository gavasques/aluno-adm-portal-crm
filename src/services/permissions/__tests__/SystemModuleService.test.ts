
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SystemModuleService } from '../SystemModuleService';
import { mockSystemModules } from '@/test/mocks/supabase';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
    }),
    rpc: vi.fn(),
  },
}));

describe('SystemModuleService', () => {
  let service: SystemModuleService;
  let mockSupabase: any;

  beforeEach(() => {
    service = new SystemModuleService();
    mockSupabase = vi.mocked(await import('@/integrations/supabase/client')).supabase;
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all system modules with actions', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: mockSystemModules,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await service.getAll();

      expect(mockSupabase.from).toHaveBeenCalledWith('system_modules');
      expect(mockQuery.select).toHaveBeenCalledWith(`
        *,
        actions:module_actions(*)
      `);
      expect(result).toEqual(mockSystemModules);
    });
  });

  describe('getByCategory', () => {
    it('should return modules grouped by category', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: mockSystemModules,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await service.getByCategory();

      expect(result).toEqual({
        management: mockSystemModules,
      });
    });
  });

  describe('validateModuleAccess', () => {
    it('should validate module action access', async () => {
      const mockModules = [
        {
          module_key: 'suppliers',
          actions: ['create', 'read'],
        },
      ];

      mockSupabase.rpc.mockResolvedValue({
        data: mockModules,
        error: null,
      });

      const result = await service.validateModuleAccess('suppliers', 'create');

      expect(result).toBe(true);
    });

    it('should return false for unauthorized action', async () => {
      const mockModules = [
        {
          module_key: 'suppliers',
          actions: ['read'],
        },
      ];

      mockSupabase.rpc.mockResolvedValue({
        data: mockModules,
        error: null,
      });

      const result = await service.validateModuleAccess('suppliers', 'delete');

      expect(result).toBe(false);
    });
  });
});
