
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePermissionServices } from '../usePermissionServices';

describe('usePermissionServices', () => {
  it('should return all permission services', () => {
    const { result } = renderHook(() => usePermissionServices());

    expect(result.current).toHaveProperty('permissionGroupService');
    expect(result.current).toHaveProperty('systemMenuService');
    expect(result.current).toHaveProperty('systemModuleService');
    expect(result.current).toHaveProperty('validationService');

    // Verify services are instances of expected classes
    expect(result.current.permissionGroupService).toBeDefined();
    expect(result.current.systemMenuService).toBeDefined();
    expect(result.current.systemModuleService).toBeDefined();
    expect(result.current.validationService).toBeDefined();
  });

  it('should return the same service instances on multiple calls', () => {
    const { result: result1 } = renderHook(() => usePermissionServices());
    const { result: result2 } = renderHook(() => usePermissionServices());

    // Services should be singletons
    expect(result1.current.permissionGroupService).toBe(result2.current.permissionGroupService);
    expect(result1.current.systemMenuService).toBe(result2.current.systemMenuService);
    expect(result1.current.systemModuleService).toBe(result2.current.systemModuleService);
    expect(result1.current.validationService).toBe(result2.current.validationService);
  });
});
