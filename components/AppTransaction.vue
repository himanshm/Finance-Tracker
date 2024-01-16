<script setup lang="ts">
import type { PropType } from 'vue';

// Define the structure of the transaction object as an interface
interface Transaction {
  id: number;
  created_at: string;
  amount: number;
  type: string;
  description: string;
  category: string;
}

const props = defineProps({
  transaction: {
    type: Object as PropType<Transaction>,
    required: true,
  },
});

const emit = defineEmits(['deleted']);
const isIncome = computed(() => props.transaction.type === 'Income');

const icon = computed(() =>
  isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left'
);

const iconColor = computed(() => (isIncome.value ? 'text-green-600' : 'text-red-600'));

const { currency } = useCurrency(props.transaction.amount);

const isLoading = ref(false);
const toast = useToast(); //  use the useToast composable to add notifications to app
const supabase = useSupabaseClient();
const deleteTransaction = async () => {
  isLoading.value = true;

  try {
    await supabase.from('transactions-FinanaceFolio').delete().eq('id', props.transaction.id);
    toast.add({
      title: 'Transaction Deleted',
      icon: 'i-heroicons-check-circle',
    });

    emit('deleted', props.transaction.id);
  } catch (error) {
    toast.add({
      title: 'Transaction Deleted',
      icon: 'i-heroicons-exclamation-circle',
    });
  } finally {
    isLoading.value = false;
  }
};
const items = [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => {
        console.log('Edit');
      },
    },
  ],
  [
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: deleteTransaction,
    },
  ],
];
</script>

<template>
  <div
    class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
  >
    <div class="flex items-center justify-between space-x-6 col-span-2">
      <div class="flex items-center space-x-1">
        <UIcon :name="icon" :class="[iconColor]" />
        <div>{{ transaction.description }}</div>
      </div>
      <div>
        <div>
          <UBadge v-if="transaction.category" :label="transaction.category" color="white" />
        </div>
      </div>
    </div>
    <div class="flex items-center justify-end space-x-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton
            color="white"
            variant="ghost"
            trailing-icon="i-heroicons-ellipsis-horizontal"
            :loading="isLoading"
          />
        </UDropdown>
      </div>
    </div>
  </div>
</template>
