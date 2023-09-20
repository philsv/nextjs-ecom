'use client'

import { useCartStore } from "store"
import { AddCartTypes } from 'types/AddCartTypes';



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
            className="bg-teal-700 text-white py-2 px-5 rounded-md font-medium mt-2">
            Add to Cart
        </button>
    )
}