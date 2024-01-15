<script setup lang="ts">
interface Transaction {
  amount: number;
  type: string;
}
const props = defineProps<{
  date: string;
  transactions: Transaction[];
}>();

const sum = computed(() => {
  let sum = 0;
  if (props.transactions) {
    for (const transaction of props.transactions) {
      if (transaction.type === 'Income') {
        sum += transaction.amount;
      } else {
        sum -= transaction.amount;
      }
    }
  }
  return sum;
});

const { currency } = useCurrency(sum);
</script>

<template>
  <div
    class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold"
  >
    <div class="flex items-center justify-between">
      {{ date }}
    </div>
    <div class="flex items-center justify-end mr-10">{{ currency }}</div>
  </div>
</template>

