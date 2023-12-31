import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = {
    name: string
    id: string
    image: string
    description?: string
    unit_amount: number
    quantity: number
}

type CartState = {
    isOpen: boolean
    cart: CartItem[]
    toggleCart: () => void
    addProduct: (product: CartItem) => void
    removeProduct: (product: CartItem) => void
    paymentIntent: string
    onCheckout: string
    setPaymentIntent: (paymentIntent: string) => void
    setOnCheckout: (onCheckout: string) => void
}

// Persist cart state in local storage and rehydrate on page load if it exists
export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            cart: [],
            isOpen: false,
            paymentIntent: '',
            onCheckout: "cart",
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            addProduct: (product) => set((state) => {
                // Check if item exists in cart and add quantity by 1
                const existingItem = state.cart.find(cartItem => cartItem.id === product.id)

                if (existingItem) {
                    const updatedCart = state.cart.map(cartItem => {
                        if (cartItem.id === product.id) {
                            return { ...cartItem, quantity: cartItem.quantity + 1 }
                        }
                        return cartItem
                    })
                    return { cart: updatedCart }
                } else {
                    // Add item to cart
                    return { cart: [...state.cart, { ...product, quantity: 1 }] }
                }
            }),
            removeProduct: (product) => set((state) => {
                // Check if item exists in cart and remove quantity by 1
                const existingItem = state.cart.find(cartItem => cartItem.id === product.id)

                if (existingItem && existingItem.quantity > 1) {
                    const updatedCart = state.cart.map(cartItem => {
                        if (cartItem.id === product.id) {
                            return { ...cartItem, quantity: cartItem.quantity - 1 }
                        }
                        return cartItem
                    }).filter(cartItem => cartItem.quantity > 0)
                    return { cart: updatedCart }
                } else {
                    // Remove item from cart
                    const filteredCart = state.cart.filter(cartItem => cartItem.id !== product.id)
                    return { cart: filteredCart }
                }
            }),
            setPaymentIntent: (paymentIntent) => set(() => ({ paymentIntent: paymentIntent })),
            setOnCheckout: (onCheckout) => set(() => ({ onCheckout: onCheckout })),
        }),
        { name: 'cart-store' }
    )
)