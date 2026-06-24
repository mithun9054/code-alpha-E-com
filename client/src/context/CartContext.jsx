import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const raw = localStorage.getItem('cart');
    return raw ? safeParse(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (product, quantity = 1) => {
    if (!product?._id) return;

    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }

      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity,
        },
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    const q = Number(quantity);
    if (!productId) return;

    if (Number.isNaN(q) || q < 1) {
      setCartItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }

    setCartItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: q } : i))
    );
  };

  const removeItem = (productId) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => setCartItems([]);

  const itemCount = useMemo(() => cartItems.reduce((sum, i) => sum + i.quantity, 0), [cartItems]);
  const total = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity * i.price, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      itemCount,
      total,
    }),
    [cartItems, itemCount, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

