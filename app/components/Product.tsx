import Image from 'next/image';

interface ProductProps {
  name: string;
  description: string;
  image: string;
  price: {
    currency: string;
    unit_amount: number;
  };
}

export default function Product({ name, description, image, price }: ProductProps) {
  return (
    <div>
      <Image src={image} alt={name} width={400} height={200} />
      <h1>
        {name} - {description}
      </h1>
      <p>
        {price.currency.toUpperCase()} {price.unit_amount / 100}
      </p>
    </div>
  );
}