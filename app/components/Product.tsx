import Image from 'next/image';
import formatPrice from 'util/PriceFormat';

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
      <Image src={image} alt={name} width={1600} height={1600} className="object-cover" />
      <h1>{name} - {description}</h1>
      {/* If the price is not available, don't show anything otherwise show the formatted price */}
      <h2>{price && formatPrice(price.unit_amount, "USD")}</h2>
    </div>
  );
}