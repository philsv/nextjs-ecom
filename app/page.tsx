import Stripe from 'stripe';
import Product from './components/Product';
import { GetServerSideProps } from 'next';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-08-16',
});

const getProducts = async () => {
  const products = await stripe.products.list();

  return await Promise.all(
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
        currency: price.data[0].currency,
      };
    })
  );
};

interface HomeProps {
  products: {
    id: string;
    name: string;
    description: string;
    price: {
      currency: string;
      unit_amount: number;
    };
    image: string;
  }[];
}

const Home: React.FC<HomeProps> = ({ products }) => {
  return (
    <main>
      {products.map((product) => (
        <Product key={product.id} {...product} />
      ))}
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await getProducts();

  return {
    props: { products },
  };
};

export default Home;