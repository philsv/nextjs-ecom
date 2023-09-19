'use client'

import { useCartStore } from "store"
import { useState } from "react"

type AddCartTypes = {
    id: string
    name: string
    image: string
    quantity: number
    unit_amount: number
}

export default function AddCart({
    id,
    name,
    image,
    unit_amount,
    quantity,
}: AddCartTypes) {
    const cartStore = useCartStore()

    return (
        <button
            onClick={() => cartStore.addProduct({ id, image, unit_amount, quantity, name })}
            className="bg-teal-700 text-white py-2 px-4 rounded-md font-medium">
            Add to Cart
        </button>
    )
}