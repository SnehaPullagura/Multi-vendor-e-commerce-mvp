import { create } from "zustand";
import { Wishlist, WishlistItem } from "@/types/commerce_extensions";
import { api } from "@/lib/api";
import { useToastStore } from "./useToastStore";

interface WishlistState {
  wishlist: Wishlist | null;
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (productId: string, variantId?: string) => Promise<boolean>;
  removeItem: (itemId: string) => Promise<boolean>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: null,
  isLoading: false,

  fetchWishlist: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get("/wishlist");
      if (res.data.success) {
        set({ wishlist: res.data.data });
      }
    } catch {
      // Guest or error
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (productId: string, variantId?: string) => {
    try {
      const res = await api.post("/wishlist/items", {
        product_id: productId,
        product_variant_id: variantId,
      });
      if (res.data.success) {
        useToastStore.getState().addToast({
          type: "success",
          title: "Saved to Wishlist",
          message: "You can view and manage your saved items anytime.",
        });
        await get().fetchWishlist();
        return true;
      }
      return false;
    } catch (err: any) {
      useToastStore.getState().addToast({
        type: "error",
        title: "Could not save",
        message: err.response?.data?.message || "Please sign in to save items.",
      });
      return false;
    }
  },

  removeItem: async (itemId: string) => {
    try {
      const res = await api.delete(`/wishlist/items/${itemId}`);
      if (res.data.success) {
        await get().fetchWishlist();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
}));
