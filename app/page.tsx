import Stripe from 'stripe';
import Product from './components/Product';

const getProducts = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-08-16',
  });
  const products = await stripe.products.list();

  return Promise.all(
    products.data.map(async (product) => {
      const price = await stripe.prices.list({
        product: product.id,
        limit: 1,
      });
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: price.data[0],
        image: product.images[0],
        currency: price.data[0]?.currency, // Handle potential undefined
      };
    })
  );
};

export default async function Home() {
  let products = [] as Array<any>;

  try {
    products = await getProducts();
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <main>
      {products.length > 0 ? (
        products.map((product) => (
          <Product key={product.id} {...product} />
        ))
      ) : (
        <p>No products available.</p>
      )}
    </main>
  );
}