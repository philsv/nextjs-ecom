'use client'

import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { useCartStore } from 'store'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)


export default function Checkout() {
    const cartStore = useCartStore()
    const router = useRouter()
    const [clientSecret, setClientSecret] = useState<string>("")

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch('/api/payment_intents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: cartStore.cart,
                paymentIntentId: cartStore.paymentIntent,
            })
        }).then((res) => {
            if (res.status === 403) {
                return router.push('/api/auth/signin')
            }
            return res.json()
        }).then((data) => {
            setClientSecret(data.paymentIntentId.client_secret)
            cartStore.setPaymentIntent(data.paymentIntent.id)
        })
    }, [])

    return (
        <div>
            <h1>Checkout</h1>
        </div>
    )

}