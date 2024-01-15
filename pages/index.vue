<script setup lang="ts">
import { transactionViewOptions } from '../constants';

// Define the type for a transaction (adjust the properties according to your data model)
interface Transaction {
  id: number;
  created_at: string;
  amount: number;
  type: string;
  description: string;
  category: string;
}

const selectedView = ref(transactionViewOptions[1]);
const supabase = useSupabaseClient();
const transactions = ref<Transaction[]>([]);

const { data, pending } = useAsyncData('transactions', async () => {
  const { data, error } = await supabase
    .from('transactions-FinanaceFolio')
    .select();

  // Ensure data is not null before assigning it
  if (data) {
    return data;
  } else {
    // Log and throw the error to be handled by useAsyncData's error handling
    console.error(error);
    throw new Error('Failed to fetch transactions');
  }
});
// We use `watch` to update the transactions ref whenever data changes. This is necessary because data is a reactive source, and we want to keep transactions in sync with it.

watch(
  data,
  (newData) => {
    transactions.value = newData || [];
  },
  { immediate: true }
);
</script>

<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <USelectMenu :options="transactionViewOptions" v-model="selectedView" />
    </div>
  </section>

  <section
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
  >
    <!-- Income Trend -->
    <AppTrend
      color="green"
      title="Income"
      :amount="4000"
      :last-amount="3000"
      :loading="false"
    />
    <!-- Expenses Trend -->
    <AppTrend
      color="red"
      title="Expenses"
      :amount="4000"
      :last-amount="8000"
      :loading="false"
    />
    <!-- Savings Trend -->
    <AppTrend
      color="green"
      title="Savings"
      :amount="4000"
      :last-amount="5000"
      :loading="false"
    />
    <!-- Investment Trend -->
    <AppTrend
      color="red"
      title="Investments"
      :amount="9000"
      :last-amount="11000"
      :loading="false"
    />
  </section>
  <section>
    <AppTransaction
      v-for="transaction in transactions"
      :key="transaction.id"
      :transaction="transaction"
    />
  </section>
</template>
