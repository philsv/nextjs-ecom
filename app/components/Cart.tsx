'use client'

import Image from 'next/image'
import { useCartStore } from 'store'
import formatPrice from 'util/PriceFormat'
import { IoAddCircle, IoRemoveCircle } from 'react-icons/io5'
import basket from 'public/basket.png'


export default function Cart() {
    const cartStore = useCartStore()
    return (
        <div onClick={() => cartStore.toggleCart()}
            className="fixed w-full h-screen left-0 top-0 bg-black/25">
            <div onClick={(e) => e.stopPropagation()}
                className="bg-white absolute right-0 top-0 w-1/4 h-screen p-12 overflow-y-scroll text-gray-700">
                {cartStore.cart.map((item) => (
                    <div key={item.id} className="flex py-4 gap-4">
                        <Image
                            className="rounded-md"
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                        />
                        <div>
                            <h3>{item.name}</h3>

                            <div className="flex gap-2 items-center">
                                <h2>{item.quantity}</h2>

                                <button onClick={() =>
                                    cartStore.removeProduct({
                                        id: item.id,
                                        image: item.image,
                                        name: item.name,
                                        unit_amount: item.unit_amount,
                                        quantity: item.quantity,
                                    })
                                }
                                >
                                    <IoRemoveCircle />
                                </button>

                                <button onClick={() =>
                                    cartStore.addProduct({
                                        id: item.id,
                                        image: item.image,
                                        name: item.name,
                                        unit_amount: item.unit_amount,
                                        quantity: item.quantity,
                                    })
                                }
                                >
                                    <IoAddCircle />
                                </button>

                            </div>

                            <p className="text-sm">
                                {formatPrice(item.unit_amount, "USD")}
                            </p>
                        </div>
                    </div>
                ))}
                {cartStore.cart.length > 0 && (
                    <button className="py-2 mt-4 bg-teal-700 w-full rounded-md text-white">
                        Checkout
                    </button>
                )}
                {cartStore.cart.length === 0 && (
                    <div className="flex flex-col items-center gap-12 text-2xl font-medium">
                        <h1>Your cart is empty</h1>
                        <Image
                            src={basket}
                            alt="Empty cart"
                            width={110}
                            height={110}
                        />
                        <p className="text-center text-sm">Add some products from our new arrivals</p>
                    </div>
                )}
            </div>
        </div >
    )
}