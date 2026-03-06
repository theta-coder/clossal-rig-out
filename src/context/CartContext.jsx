import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// Simple UUID generator for session
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function CartProvider({ children }) {
    const { token } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [sessionId, setSessionId] = useState(() => {
        let savedSession = localStorage.getItem('urban-threads-session-id');
        if (!savedSession) {
            savedSession = generateUUID();
            localStorage.setItem('urban-threads-session-id', savedSession);
        }
        return savedSession;
    });

    const getHeaders = () => {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    };

    useEffect(() => {
        fetchCart();
    }, [sessionId, token]);

    const fetchCart = async () => {
        try {
            const url = new URL(`${API_URL}/cart`);
            url.searchParams.append('session_id', sessionId);

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: getHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    setCartItems(data.data.items || []);
                    setCartTotal(data.data.total || 0);

                    const count = (data.data.items || []).reduce((acc, item) => acc + item.quantity, 0);
                    setCartCount(count);
                }
            } else {
                console.error("Cart fetch failed");
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        }
    };

    const addToCart = async (product) => {
        try {
            // Safely extract string properties if the color/size happens to be an object from the Product catalog payload
            let itemColor = product.color;
            if (!itemColor && product.colors && product.colors.length > 0) {
                itemColor = typeof product.colors[0] === 'string' ? product.colors[0] : product.colors[0].color_name;
            }

            let itemSize = product.size;
            if (!itemSize && product.sizes && product.sizes.length > 0) {
                itemSize = typeof product.sizes[0] === 'string' ? product.sizes[0] : product.sizes[0].size;
            }
            if (!itemSize) itemSize = 'M';

            const response = await fetch(`${API_URL}/cart/items`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    session_id: sessionId,
                    product_id: product.id,
                    variant_id: product.variant_id ?? null,
                    size: itemSize,
                    color: itemColor,
                    quantity: product.quantity || 1
                })
            });

            if (response.ok) {
                await fetchCart(); // Refresh cart from server
                setIsCartOpen(true);
            } else {
                const errData = await response.json();
                console.error("Cart addition failed server validation:", errData);
            }
        } catch (error) {
            console.error("Failed to add to cart", error);
        }
    };

    const removeFromCart = async (itemId, size, color) => {
        try {
            const cartItem = cartItems.find(item => item.id === itemId && item.size === size);
            const targetId = cartItem ? cartItem.id : itemId;

            const url = new URL(`${API_URL}/cart/items/${targetId}`);
            const response = await fetch(url.toString(), {
                method: 'DELETE',
                headers: getHeaders()
            });

            if (response.ok) {
                await fetchCart(); // Refresh
            }
        } catch (error) {
            console.error("Failed to remove from cart", error);
        }
    };

    const updateQuantity = async (itemId, size, color, amount) => {
        try {
            const cartItem = cartItems.find(item => item.id === itemId && item.size === size);
            if (!cartItem) return;

            const targetId = cartItem.id;
            const newQuantity = Math.max(1, cartItem.quantity + amount);

            const response = await fetch(`${API_URL}/cart/items/${targetId}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({
                    quantity: newQuantity
                })
            });

            if (response.ok) {
                await fetchCart(); // Refresh
            }
        } catch (error) {
            console.error("Failed to update quantity", error);
        }
    };

    const clearCart = async () => {
        try {
            const url = new URL(`${API_URL}/cart`);
            url.searchParams.append('session_id', sessionId);

            const response = await fetch(url.toString(), {
                method: 'DELETE',
                headers: getHeaders()
            });

            if (response.ok) {
                setCartItems([]);
                setCartTotal(0);
                setCartCount(0);
            }
        } catch (error) {
            console.error("Failed to clear cart", error);
        }
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
