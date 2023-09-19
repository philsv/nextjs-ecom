"use client"

import { Session } from "next-auth"
import { signIn, signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import Cart from "./Cart"
import { useCartStore } from "store"
import { HiOutlineShoppingBag } from "react-icons/hi2"


export default function Nav({ user }: Session) {
    const cartStore = useCartStore()
    return (
        <nav className="flex justify-between items-center py-12">
            <Link href="/">🤗</Link>
            <ul className="flex items-center gap-12">
                {/* Toggle the cart */}
                <li onClick={() => cartStore.toggleCart()} className="flex item-center text-3xl relative curser-pointer">
                    <HiOutlineShoppingBag />
                    <span className="bg-teal-700 text-white text-sm font-bold w-5 h-5 rounded-full absolute left-4 bottom-4 flex items-center justify-center">
                        {cartStore.cart.length}
                    </span>
                </li>
                {/* If the user is logged in, show the sign out button */}
                {!user && (
                    <li className="bg-teal-600 text-white py-2 px-4 rounded-md">
                        <button onClick={() => signIn()}>Sign In</button>
                    </li>
                )}
                {user && (
                    <li> 
                        <Image
                            src={user?.image as string}
                            alt={user.name as string}
                            width={48}
                            height={48}
                            className="rounded-full"
                        />
                        <button className="bg-teal-600 text-white py-2 px-4 rounded-md" onClick={() => signOut()}>Sign Out</button>
                    </li>
                )}
            </ul>
            {cartStore.isOpen && <Cart />}
        </nav>
    )
}