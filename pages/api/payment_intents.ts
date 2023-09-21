import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { AddCartTypes } from 'types/AddCartTypes';
import { PrismaClient } from '@prisma/client';
import { ProductProps } from 'types/ProductTypes';


interface UserProps {
    id: string;
}

const prisma = new PrismaClient()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-08-16"
})

const calculateOrderAmount = (items: AddCartTypes[]) => {
    return items.reduce((acc, product) => {
        return acc + product.quantity * parseFloat(product.unit_amount.toString());
    }, 0)
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const userSession = await getServerSession(req, res, authOptions)
    const user = userSession?.user as UserProps

    // Check if user is authenticated
    if (!user) {
        res.status(403).json({ error: 'You must be signed in to make a purchase' })
        return
    }

    // Extract the payment intent id from the request body
    const { items, paymentIntentId } = req.body
    console.log('items', items)
    console.log('paymentIntentId', paymentIntentId)

    // Create the order data
    const orderData = {
        user: { connect: { id: user?.id } },
        amount: calculateOrderAmount(items),
        currency: 'usd',
        status: 'pending',
        paymentIntentId: paymentIntentId,
        products: {
            create: items.map((product: ProductProps) => ({
                name: product.name,
                description: product.description || null,
                quantity: product.quantity,
                unit_amount: parseFloat(product.unit_amount.toString()),
                image: product.image,
                total_amount: product.quantity * parseFloat(product.unit_amount.toString()),
            }))
        }
    }

    // Check if the payment intent exists update the order
    if (paymentIntentId) {
        try {

            const currentIntent = await stripe.paymentIntents.retrieve(
                paymentIntentId
            )
            console.log('currentIntent', currentIntent)
            if (currentIntent) {
                const updatedIntent = await stripe.paymentIntents.update(
                    paymentIntentId,
                    { amount: calculateOrderAmount(items) }
                )

                // Fetch order with product ids
                const existingOrder = await prisma.order.findUnique({
                    where: { paymentIntentId: updatedIntent.id },
                    include: { products: true }
                })
                if (!existingOrder) {
                    res.status(400).json({ error: 'Invalid Payment Intent' })
                    return;
                }

                // Update existing order
                const updatedOrder = await prisma.order.update({
                    where: { id: existingOrder?.id },
                    data: {
                        amount: calculateOrderAmount(items),
                        products: {
                            deleteMany: {},
                            create: items.map((product: ProductProps) => ({
                                name: product.name,
                                description: product.description || null,
                                quantity: product.quantity,
                                unit_amount: parseFloat(product.unit_amount.toString()),
                                image: product.image,
                                total_amount: product.quantity * parseFloat(product.unit_amount.toString()),
                            })),
                        },
                    },
                })
                res.status(200).json({ paymentIntent: updatedIntent })
                return;

            } else {
                // Create new order with prisma
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: calculateOrderAmount(items),
                    currency: 'USD',
                    automatic_payment_methods: { enabled: true },
                })

                orderData.paymentIntentId = paymentIntent.id

                const newOrder = await prisma.order.create({
                    data: orderData,
                })
                res.status(200).json({ paymentIntent })
                return;
            }
        } catch (error) {
            console.error('Error updating or creating payment intent:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    }
}
