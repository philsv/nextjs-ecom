'use client'

import Image from 'next/image'
import { useCartStore } from 'store'
import formatPrice from 'util/PriceFormat'
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai'
import basket from 'public/basket.png'
import { motion, AnimatePresence } from 'framer-motion'


export default function Cart() {

    const cartStore = useCartStore()

    const totalPrice = cartStore.cart.reduce((acc, item) => {
        return acc + item.unit_amount * item.quantity
    }, 0)

    return (
        // Overlay for the cart
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => cartStore.toggleCart()}
            className="fixed w-full h-screen left-0 top-0 bg-black/25">
            <motion.div
                layout
                onClick={(e) => e.stopPropagation()}
                className="bg-white absolute right-0 top-0 w-1/4 h-screen p-12 overflow-y-scroll text-gray-700">

                {/** Button to close the cart */}
                {cartStore.cart.map((item) => (
                    <motion.div
                        layout
                        key={item.id}
                        className="flex py-4 gap-4">
                        <Image
                            className="rounded-md"
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                        />
                        <motion.div layout>
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
                                    <AiOutlineMinusCircle />
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
                                    <AiOutlinePlusCircle />
                                </button>

                            </div>

                            <p className="text-sm">
                                {formatPrice(item.unit_amount, "USD")}
                            </p>
                        </motion.div>
                    </motion.div>
                ))}

                {cartStore.cart.length > 0 && (
                    <motion.div layout>
                        <p>Total: {formatPrice(totalPrice, "USD")}</p>
                        <button className="py-2 mt-4 bg-teal-700 w-full rounded-md text-white">
                            Checkout
                        </button>
                    </motion.div>
                )}
                <AnimatePresence>
                    {cartStore.cart.length === 0 && (
                        <motion.div
                            animate={{ scale: 1, opacity: 0.75 }}
                            initial={{ scale: 0.5, opacity: 0 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="flex flex-col items-center gap-12 text-2xl font-medium">
                            <h1>Your cart is empty</h1>
                            <Image
                                src={basket}
                                alt="Empty cart"
                                width={110}
                                height={110}
                            />
                            <p className="text-center text-sm">Add some products from our new arrivals</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    )
}