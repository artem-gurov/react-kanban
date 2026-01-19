import { renderHook, waitFor, act } from '@testing-library/react';
import { useBoardContext } from '../useBoardContext';
import { BoardProvider } from '../BoardContext';

describe('useBoardContext', () => {
  it('throws error when used outside BoardProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useBoardContext());
    }).toThrow('useBoardContext must be used within BoardProvider');

    consoleSpy.mockRestore();
  });

  it('returns context when used within BoardProvider', () => {
    const { result } = renderHook(() => useBoardContext(), {
      wrapper: BoardProvider,
    });

    expect(result.current).toBeDefined();
    expect(result.current.boards).toBeDefined();
    expect(result.current.dispatch).toBeDefined();
  });

  it('provides access to boards state', () => {
    const { result } = renderHook(() => useBoardContext(), {
      wrapper: BoardProvider,
    });

    expect(Array.isArray(result.current.boards)).toBe(true);
  });

  it('provides dispatch function', () => {
    const { result } = renderHook(() => useBoardContext(), {
      wrapper: BoardProvider,
    });

    expect(typeof result.current.dispatch).toBe('function');
  });

  describe('State Updates', () => {
    it('updates boards when ADD_BOARD is dispatched', () => {
      const { result } = renderHook(() => useBoardContext(), {
        wrapper: BoardProvider,
      });

      const initialLength = result.current.boards.length;

      act(() => {
        result.current.dispatch({
          type: 'ADD_BOARD',
          payload: { name: 'New Board' },
        });
      });

      waitFor(() => {
        expect(result.current.boards.length).toBe(initialLength + 1);
      });
    });

    it('updates board name when UPDATE_BOARD is dispatched', async () => {
      const { result } = renderHook(() => useBoardContext(), {
        wrapper: BoardProvider,
      });

      const firstBoard = result.current.boards[0];

      if (firstBoard) {
        act(() => {
          result.current.dispatch({
            type: 'UPDATE_BOARD',
            payload: { boardId: firstBoard.id, name: 'Updated Name' },
          });
        });

        await waitFor(() => {
          const updatedBoard = result.current.boards.find(
            (b) => b.id === firstBoard.id
          );
          expect(updatedBoard?.name).toBe('Updated Name');
        });
      }
    });
  });
});
