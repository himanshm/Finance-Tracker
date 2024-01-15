export const useCurrency = (amount: number | Ref<number>) => {
  const currency = computed(() => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(isRef(amount) ? amount.value : amount);
  });
  return {
    currency,
  };
};