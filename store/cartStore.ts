// store/cartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  size?: string;
  color?: string;
  sku?: string;
  stock?: number;
  slug?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (i) =>
            i.productId === newItem.productId &&
            i.size === newItem.size &&
            i.color === newItem.color
        );

        if (existingIndex >= 0) {
          const updatedItems = [...items];
          const existing = updatedItems[existingIndex];
          const newQty = Math.min(existing.quantity + newItem.quantity, existing.stock ?? 99);
          updatedItems[existingIndex] = { ...existing, quantity: newQty };
          set({ items: updatedItems, isOpen: true });
        } else {
          set({ items: [...items, newItem], isOpen: true });
        }
      },

      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(i.productId === productId && i.size === size && i.color === color)
          ),
        }));
      },

      updateQuantity: (productId, quantity, size, color) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.size === size && i.color === color
              ? { ...i, quantity: Math.min(quantity, i.stock ?? 99) }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce(
          (sum, i) => sum + (i.discountPrice ?? i.price) * i.quantity,
          0
        ),
    }),
    {
      name: 'shapla-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
