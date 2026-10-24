// store/wishlistStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface WishlistItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  discountPrice?: number;
  slug: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toggle: (item: WishlistItem) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        if (!get().isWishlisted(item.productId)) {
          set((state) => ({ items: [...state.items, item] }));
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      isWishlisted: (productId) => get().items.some((i) => i.productId === productId),

      toggle: (item) => {
        if (get().isWishlisted(item.productId)) {
          get().removeItem(item.productId);
        } else {
          get().addItem(item);
        }
      },
    }),
    {
      name: 'shapla-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
