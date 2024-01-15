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
const { currency } = useCurrency(props.transaction.amount);
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
      click: () => {
        console.log('Delete');
      },
    },
  ],
];
</script>

<template>
  <div
    class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-1">
        <UIcon name="i-heroicons-arrow-up-right" class="text-green-600" />
        <div>{{transaction.description}}</div>
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
          />
        </UDropdown>
      </div>
    </div>
  </div>
</template>
