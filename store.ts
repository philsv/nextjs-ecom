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
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            cart: [],
            isOpen: false,
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            addProduct: (product) => set((state) => {

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
                    return { cart: [...state.cart, { ...product, quantity: 1 }] }
                }
            }),
        }),
        { name: 'cart-store' }
    )
)