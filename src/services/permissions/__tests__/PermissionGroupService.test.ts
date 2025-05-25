
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PermissionGroupService } from '../PermissionGroupService';
import { mockPermissionGroups } from '@/test/mocks/supabase';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
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
  },
}));

describe('PermissionGroupService', () => {
  let service: PermissionGroupService;
  let mockSupabase: any;

  beforeEach(async () => {
    service = new PermissionGroupService();
    const supabaseModule = await import('@/integrations/supabase/client');
    mockSupabase = vi.mocked(supabaseModule).supabase;
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all permission groups', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: mockPermissionGroups,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await service.getAll();

      expect(mockSupabase.from).toHaveBeenCalledWith('permission_groups');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.order).toHaveBeenCalledWith('name');
      expect(result).toEqual(mockPermissionGroups);
    });

    it('should handle errors gracefully', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await service.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return a specific permission group', async () => {
      const mockGroup = mockPermissionGroups[0];
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockGroup,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await service.getById('1');

      expect(mockSupabase.from).toHaveBeenCalledWith('permission_groups');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.eq).toHaveBeenCalledWith('id', '1');
      expect(result).toEqual(mockGroup);
    });
  });

  describe('create', () => {
    it('should create a new permission group', async () => {
      const newGroupData = {
        name: 'New Group',
        description: 'New group description',
        is_admin: false,
        allow_admin_access: false,
        menu_keys: ['dashboard', 'users'],
      };

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...newGroupData, id: '3' },
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await service.create(newGroupData);

      expect(result.success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('permission_groups');
      expect(mockQuery.insert).toHaveBeenCalledWith([{
        name: newGroupData.name,
        description: newGroupData.description,
        is_admin: newGroupData.is_admin,
        allow_admin_access: newGroupData.allow_admin_access,
      }]);
    });
  });

  describe('update', () => {
    it('should update an existing permission group', async () => {
      const updateData = {
        id: '1',
        name: 'Updated Group',
        description: 'Updated description',
        is_admin: false,
        allow_admin_access: true,
        menu_keys: ['dashboard'],
      };

      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: updateData,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await service.update(updateData);

      expect(result.success).toBe(true);
      expect(mockQuery.update).toHaveBeenCalledWith({
        name: updateData.name,
        description: updateData.description,
        is_admin: updateData.is_admin,
        allow_admin_access: updateData.allow_admin_access,
      });
    });
  });

  describe('delete', () => {
    it('should delete a permission group', async () => {
      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await service.delete('1');

      expect(result.success).toBe(true);
      expect(mockQuery.delete).toHaveBeenCalled();
      expect(mockQuery.eq).toHaveBeenCalledWith('id', '1');
    });
  });
});
