'use client'

import Image from 'next/image'
import { useCartStore } from 'store'

export default function Cart() {
    const cartStore = useCartStore()
    return (
        <div className="cart">
            <Image src="/cart.svg" alt="cart" width="30" height="30" />
            <span className="cart-count">{cartStore.isOpen}</span>
        </div>
    )
}