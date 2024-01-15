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

// Define the type for the grouped transactions
interface GroupedTransactions {
  [key: string]: Transaction[];
}

const selectedView = ref(transactionViewOptions[1]);
const supabase = useSupabaseClient();
const transactions = ref<Transaction[]>([]);
const isLoading = ref(false);

const income = computed(() =>
  transactions.value.filter((transaction) => transaction.type === 'Income')
);

const expense = computed(() =>
  transactions.value.filter((transaction) => transaction.type === 'Expense')
);

const incomeCount = computed(() => income.value.length);
const expenseCount = computed(() => expense.value.length);

const incomeTotal = computed(() =>
  income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
);

const expenseTotal = computed(() =>
  expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
);

const fetchTransactions = async (): Promise<Transaction[]> => {
  isLoading.value = true;
  try {
    const { data } = useAsyncData('transactions', async () => {
      const { data, error } = await supabase
        .from('transactions-FinanaceFolio')
        .select();

      if (error) return [];
      return data as Transaction[];
    });

    return data.value || []; // Fallback to empty array if data.value is nullish
  } finally {
    isLoading.value = false;
  }
};

const refreshTransactions = async () =>
  (transactions.value = await fetchTransactions());

await refreshTransactions();

const transactionsGroupedByDate = computed(() => {
  // Define grouped with the correct type
  let grouped: GroupedTransactions = {};

  for (const transaction of transactions.value) {
    const date = new Date(transaction.created_at).toISOString().split('T')[0];

    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
  }
  return grouped;
});
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
      :amount="incomeTotal"
      :last-amount="3000"
      :loading="isLoading"
    />
    <!-- Expenses Trend -->
    <AppTrend
      color="red"
      title="Expenses"
      :amount="expenseTotal"
      :last-amount="8000"
      :loading="isLoading"
    />
    <!-- Savings Trend -->
    <AppTrend
      color="green"
      title="Savings"
      :amount="4000"
      :last-amount="5000"
      :loading="isLoading"
    />
    <!-- Investment Trend -->
    <AppTrend
      color="red"
      title="Investments"
      :amount="9000"
      :last-amount="11000"
      :loading="isLoading"
    />
  </section>

  <section class="flex justify-between mb-10">
    <div>
      <h2 text-2xl font-extrabold>Transactions</h2>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ incomeCount }} incomes and {{ expenseCount }} expenses in this period.
      </div>
    </div>
    <div>
      <UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" />
    </div>
  </section>
  <section v-if="!isLoading">
    <div
      v-for="(transactionsOnDay, date) in transactionsGroupedByDate"
      :key="date"
      class="mb-10"
    >
      <DailyTransactionSummary
        :date="(date as string)"
        :transactions="transactionsOnDay"
      />
      <AppTransaction
        v-for="transaction in transactionsOnDay"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="refreshTransactions()"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>
