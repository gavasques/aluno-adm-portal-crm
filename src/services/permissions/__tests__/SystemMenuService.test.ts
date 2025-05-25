
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SystemMenuService } from '../SystemMenuService';
import { mockSystemMenus } from '@/test/mocks/supabase';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
    }),
    rpc: vi.fn(),
  },
}));

describe('SystemMenuService', () => {
  let service: SystemMenuService;
  let mockSupabase: any;

  beforeEach(() => {
    service = new SystemMenuService();
    mockSupabase = vi.mocked(await import('@/integrations/supabase/client')).supabase;
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all system menus', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: mockSystemMenus,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await service.getAll();

      expect(mockSupabase.from).toHaveBeenCalledWith('system_menus');
      expect(result).toEqual(mockSystemMenus);
    });
  });

  describe('getByKeys', () => {
    it('should return menus by keys', async () => {
      const keys = ['dashboard', 'users'];
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: mockSystemMenus,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await service.getByKeys(keys);

      expect(mockQuery.in).toHaveBeenCalledWith('menu_key', keys);
      expect(result).toEqual(mockSystemMenus);
    });

    it('should return empty array for empty keys', async () => {
      const result = await service.getByKeys([]);
      expect(result).toEqual([]);
    });
  });

  describe('getAllowedMenusForUser', () => {
    it('should return allowed menu keys for user', async () => {
      const mockMenuKeys = [
        { menu_key: 'dashboard' },
        { menu_key: 'users' },
      ];

      mockSupabase.rpc.mockResolvedValue({
        data: mockMenuKeys,
        error: null,
      });

      const result = await service.getAllowedMenusForUser();

      expect(mockSupabase.rpc).toHaveBeenCalledWith('get_allowed_menus');
      expect(result).toEqual(['dashboard', 'users']);
    });
  });

  describe('validateMenuAccess', () => {
    it('should validate menu access for user', async () => {
      const mockMenuKeys = [
        { menu_key: 'dashboard' },
        { menu_key: 'users' },
      ];

      mockSupabase.rpc.mockResolvedValue({
        data: mockMenuKeys,
        error: null,
      });

      const result = await service.validateMenuAccess('dashboard');

      expect(result).toBe(true);
    });

    it('should return false for unauthorized menu', async () => {
      const mockMenuKeys = [
        { menu_key: 'dashboard' },
      ];

      mockSupabase.rpc.mockResolvedValue({
        data: mockMenuKeys,
        error: null,
      });

      const result = await service.validateMenuAccess('admin');

      expect(result).toBe(false);
    });
  });
});
