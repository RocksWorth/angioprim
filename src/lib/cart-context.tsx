'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number; // Price in cents
  quantity: number;
  options: {
    paperType?: string;
    finish?: string;
    sides?: 'single' | 'double';
    size?: string;
    [key: string]: any;
  };
  image: string;
}

export interface ShippingAddress {
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface ShippingRate {
  id: string;
  name: string;
  description: string;
  price: number; // Price in cents
  estimatedDays: string;
  carrier: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  shippingAddress: ShippingAddress | null;
  shippingRates: ShippingRate[];
  selectedShippingRate: ShippingRate | null;
  isLoadingRates: boolean;
  subtotal: number;
  tax: number;
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'SET_SHIPPING_ADDRESS'; payload: ShippingAddress }
  | { type: 'SET_SHIPPING_RATES'; payload: ShippingRate[] }
  | { type: 'SET_SELECTED_SHIPPING_RATE'; payload: ShippingRate }
  | { type: 'SET_LOADING_RATES'; payload: boolean }
  | { type: 'CALCULATE_TOTALS' };

const initialState: CartState = {
  items: [],
  isOpen: false,
  shippingAddress: null,
  shippingRates: [],
  selectedShippingRate: null,
  isLoadingRates: false,
  subtotal: 0,
  tax: 0,
  total: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        item => 
          item.productId === action.payload.productId && 
          JSON.stringify(item.options) === JSON.stringify(action.payload.options)
      );
      
      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }
      
      return { ...state, items: newItems };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0),
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        shippingRates: [],
        selectedShippingRate: null,
      };
    
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    
    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.payload };
    
    case 'SET_SHIPPING_ADDRESS':
      return { ...state, shippingAddress: action.payload };
    
    case 'SET_SHIPPING_RATES':
      return { ...state, shippingRates: action.payload };
    
    case 'SET_SELECTED_SHIPPING_RATE':
      return { ...state, selectedShippingRate: action.payload };
    
    case 'SET_LOADING_RATES':
      return { ...state, isLoadingRates: action.payload };
    
    case 'CALCULATE_TOTALS': {
      const subtotal = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      
      // Canadian tax calculation (simplified - in real app, use proper tax service)
      const taxRate = state.shippingAddress?.province === 'ON' ? 0.13 : 0.05; // HST vs GST
      const tax = Math.round(subtotal * taxRate);
      
      const shippingCost = state.selectedShippingRate?.price || 0;
      const total = subtotal + tax + shippingCost;
      
      return { ...state, subtotal, tax, total };
    }
    
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  getShippingRates: (address: ShippingAddress) => Promise<void>;
  selectShippingRate: (rate: ShippingRate) => void;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('versatileprint-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        parsedCart.items.forEach((item: CartItem) => {
          dispatch({ type: 'ADD_ITEM', payload: item });
        });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('versatileprint-cart', JSON.stringify({ items: state.items }));
    dispatch({ type: 'CALCULATE_TOTALS' });
  }, [state.items, state.selectedShippingRate, state.shippingAddress]);

  const addItem = useCallback((item: Omit<CartItem, 'id'>) => {
    const cartItem: CartItem = {
      ...item,
      id: `${item.productId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    dispatch({ type: 'ADD_ITEM', payload: cartItem });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const toggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' });
  }, []);

  const setCartOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_CART_OPEN', payload: open });
  }, []);

  const setShippingAddress = useCallback((address: ShippingAddress) => {
    dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: address });
  }, []);

  const getShippingRates = useCallback(async (address: ShippingAddress) => {
    dispatch({ type: 'SET_LOADING_RATES', payload: true });
    
    try {
      const response = await fetch('/api/shipping-rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          items: state.items,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch shipping rates');
      }
      
      const { rates } = await response.json();
      dispatch({ type: 'SET_SHIPPING_RATES', payload: rates });
      
      // Auto-select cheapest rate
      if (rates.length > 0) {
        const cheapestRate = rates.reduce((prev: ShippingRate, current: ShippingRate) =>
          prev.price < current.price ? prev : current
        );
        dispatch({ type: 'SET_SELECTED_SHIPPING_RATE', payload: cheapestRate });
      }
    } catch (error) {
      console.error('Error fetching shipping rates:', error);
      // Fallback to flat rate shipping
      const fallbackRates: ShippingRate[] = [
        {
          id: 'standard',
          name: 'Standard Shipping',
          description: '5-7 business days',
          price: 999, // $9.99
          estimatedDays: '5-7 business days',
          carrier: 'Canada Post',
        },
        {
          id: 'express',
          name: 'Express Shipping',
          description: '2-3 business days',
          price: 1999, // $19.99
          estimatedDays: '2-3 business days',
          carrier: 'Canada Post',
        },
      ];
      dispatch({ type: 'SET_SHIPPING_RATES', payload: fallbackRates });
      dispatch({ type: 'SET_SELECTED_SHIPPING_RATE', payload: fallbackRates[0] });
    } finally {
      dispatch({ type: 'SET_LOADING_RATES', payload: false });
    }
  }, [state.items]);

  const selectShippingRate = useCallback((rate: ShippingRate) => {
    dispatch({ type: 'SET_SELECTED_SHIPPING_RATE', payload: rate });
  }, []);

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    setCartOpen,
    setShippingAddress,
    getShippingRates,
    selectShippingRate,
  }), [
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    setCartOpen,
    setShippingAddress,
    getShippingRates,
    selectShippingRate,
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
