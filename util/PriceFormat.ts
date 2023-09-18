const formatPrice = (price: number, currency_type: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency_type,
  }).format(price / 100);
}

export default formatPrice;