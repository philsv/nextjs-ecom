import Image from 'next/image';
import formatPrice from 'util/PriceFormat';
import Link from 'next/link';
import { ProductProps } from 'types/ProductTypes';


export default function Product({ 
  id, 
  name, 
  description, 
  image, 
  unit_amount,
  currency,
  metadata,
}: ProductProps) {
  return (
    <Link href={{ 
      pathname: `/product/${id}`,
      query: { name, image, unit_amount, currency, id, description, metadata },
      }} passHref>
      <div className="font-medium py-2">
        <Image src={image} alt={name} width={1600} height={1600} className="object-cover" />
        <h1>{name}</h1>
        {/* If the price is not available, don't show anything otherwise show the formatted price */}
        <h2 className="text-sm text-teal-700">{unit_amount && formatPrice(unit_amount, "USD")}</h2>
      </div>
    </Link>
  );
}