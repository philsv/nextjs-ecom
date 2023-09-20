'use client'

import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { useCartStore } from 'store'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)


export default function Checkout() {
    const cartStore = useCartStore()
    const router = useRouter()

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch('/api/payment_intents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: cartStore.cart,
                payment_intent_id: cartStore.paymentIntent,
            })
        }).then((res) => {
            if (res.status === 403) {
                return router.push('/api/auth/signin')
            }
            return res.json()
        }).then((data) => {
            console.log(data)
        })
    }, [])

    return (
        <div>
            <h1>Checkout</h1>
        </div>
    )

}