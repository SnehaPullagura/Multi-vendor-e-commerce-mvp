import { create } from "zustand";
import { CartData } from "@/types";
import { api } from "@/lib/api";
import { useToastStore } from "./useToastStore";

interface CartState {
  cart: CartData | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (variantId: string, quantity?: number) => Promise<boolean>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get("/cart");
      if (res.data.success) {
        set({ cart: res.data.data });
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (variantId: string, quantity: number = 1) => {
    try {
      set({ isLoading: true });
      const res = await api.post("/cart/items", {
        variant_id: variantId,
        quantity,
      });
      if (res.data.success) {
        set({ cart: res.data.data });
        useToastStore.getState().addToast({
          type: "success",
          title: "Added to Cart",
          message: "Item was added to your shopping bag.",
        });
        return true;
      }
      return false;
    } catch (err: any) {
      useToastStore.getState().addToast({
        type: "error",
        title: "Could not add item",
        message: err.response?.data?.message || "Stock unavailable or invalid request.",
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateItemQuantity: async (itemId: string, quantity: number) => {
    try {
      const res = await api.put(`/cart/items/${itemId}`, { quantity });
      if (res.data.success) {
        set({ cart: res.data.data });
      }
    } catch (err: any) {
      useToastStore.getState().addToast({
        type: "error",
        title: "Quantity Update Failed",
        message: err.response?.data?.message || "Could not update item quantity.",
      });
    }
  },

  removeItem: async (itemId: string) => {
    try {
      const res = await api.delete(`/cart/items/${itemId}`);
      if (res.data.success) {
        set({ cart: res.data.data });
        useToastStore.getState().addToast({
          type: "info",
          title: "Item Removed",
          message: "Item removed from your cart.",
        });
      }
    } catch (err: any) {
      console.error("Failed to remove item:", err);
    }
  },

  clearCart: async () => {
    try {
      const res = await api.delete("/cart");
      if (res.data.success) {
        set({ cart: res.data.data });
      }
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  },
}));
