import { renderHook, act } from '@testing-library/react';
import { useToast } from './useToast';
import { describe, it, expect } from 'vitest';

describe('useToast hook', () => {
  it('should initialize with default toast state', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toast).toEqual({
      message: '',
      detail: '',
      type: 'info',
      open: false,
    });
  });

  it('should show a success toast', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.showSuccessToast('Success message', 'Detail message');
    });
    expect(result.current.toast).toEqual({
      message: 'Success message',
      detail: 'Detail message',
      type: 'success',
      open: true,
    });
  });

  it('should show an error toast', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.showErrorToast('Error message');
    });
    expect(result.current.toast).toEqual({
      message: 'Error message',
      detail: '',
      type: 'error',
      open: true,
    });
  });

  it('should close the toast', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.showToast('Info message', 'info');
      result.current.closeToast();
    });
    expect(result.current.toast.open).toBe(false);
  });
});
