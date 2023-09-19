import Image from 'next/image';
import { ProductProps } from 'types/ProductTypes';
import formatPrice from 'util/PriceFormat';
import AddCart from './AddCart';

type SearchParamTypes = {
    searchParams: ProductProps
}

export default async function Product({ searchParams }: SearchParamTypes) {
    return (
        <div className="flex justify-between gapp-24 p-12 text-gray-700">
            <Image
                src={searchParams.image}
                alt={searchParams.name}
                width={600}
                height={600}
                className="object-cover"
            />
            <div className="font-medium text-gray-700 px-4">
                <h1 className="text-2xl py-2">{searchParams.name}</h1>
                <h2 className="py-2">{searchParams.description}</h2>
                <p className="py-2">{searchParams.metadata}</p>

                <div className="flex gap-2">
                    <h2 className="text-sm text-teal-700">{searchParams.unit_amount && formatPrice(searchParams.unit_amount, "USD")}</h2>
                </div>
                <AddCart {...searchParams} />
            </div>
        </div>
    );
}