
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PermissionValidationService } from '../PermissionValidationService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    rpc: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe('PermissionValidationService', () => {
  let service: PermissionValidationService;
  let mockSupabase: any;

  beforeEach(() => {
    service = new PermissionValidationService();
    mockSupabase = vi.mocked(await import('@/integrations/supabase/client')).supabase;
    vi.clearAllMocks();
  });

  describe('isAdmin', () => {
    it('should return true for admin user', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: true,
        error: null,
      });

      const result = await service.isAdmin();

      expect(mockSupabase.rpc).toHaveBeenCalledWith('is_admin');
      expect(result).toBe(true);
    });

    it('should return false for non-admin user', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: false,
        error: null,
      });

      const result = await service.isAdmin();

      expect(result).toBe(false);
    });
  });

  describe('hasAdminAccess', () => {
    it('should delegate to isAdmin method', async () => {
      const isAdminSpy = vi.spyOn(service, 'isAdmin').mockResolvedValue(true);

      const result = await service.hasAdminAccess();

      expect(isAdminSpy).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('canAccessMenu', () => {
    it('should return true if menu is allowed', async () => {
      const mockMenus = [
        { menu_key: 'dashboard' },
        { menu_key: 'users' },
      ];

      mockSupabase.rpc.mockResolvedValue({
        data: mockMenus,
        error: null,
      });

      const result = await service.canAccessMenu('dashboard');

      expect(result).toBe(true);
    });

    it('should return false if menu is not allowed', async () => {
      const mockMenus = [
        { menu_key: 'dashboard' },
      ];

      mockSupabase.rpc.mockResolvedValue({
        data: mockMenus,
        error: null,
      });

      const result = await service.canAccessMenu('admin');

      expect(result).toBe(false);
    });
  });

  describe('validatePermissionGroupData', () => {
    it('should validate correct permission group data', async () => {
      const validData = {
        name: 'Test Group',
        description: 'Test description',
        is_admin: false,
        allow_admin_access: false,
      };

      const result = await service.validatePermissionGroupData(validData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return errors for invalid data', async () => {
      const invalidData = {
        name: '', // Required field empty
        is_admin: 'not-a-boolean', // Wrong type
      };

      const result = await service.validatePermissionGroupData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
