const formatPrice = (unit_amount: number, currency_type: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency_type,
  // sourcery skip: binary-operator-identity
  }).format(unit_amount / 100);
}

export default formatPrice;