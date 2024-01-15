<script setup lang="ts">
import { transactionCategories, transactionType } from '../constants';
const props = defineProps({
  modalValue: Boolean,
});
const emit = defineEmits(['update:modalValue']);

// define a computed value or writable computed
const isOpen = computed({
  get: () => props.modalValue,
  set: (newValue) => emit('update:modalValue', newValue),
});

const state = ref({
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
});
</script>

<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header> Add Transaction </template>

      <UForm :state="state">
        <UFormGroup
          :required="true"
          label="Transaction Type"
          name="type"
          class="mb-4"
        >
          <USelect
            placeholder="Select the transaction type"
            :options="transactionType"
            v-model="state.type"
          />
        </UFormGroup>

        <UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
          <UInput type="number" placeholder="Amount" v-model.number="state.amount" />
        </UFormGroup>

        <UFormGroup
          label="Transaction Date"
          :required="true"
          name="created_at"
          class="mb-4"
        >
          <UInput
            type="date"
            placeholder="i-heroicons-calender-days-20-solid"
            v-model="state.created_at"
          />
        </UFormGroup>

        <UFormGroup
          label="Description"
          hint="Optional"
          name="description"
          class="mb-4"
        >
          <UInput placeholder="Description" v-model="state.description" />
        </UFormGroup>

        <UFormGroup
          :required="true"
          label="Category"
          name="category"
          class="mb-4"
        >
          <USelect
            placeholder="Category"
            :options="transactionCategories"
            v-model="state.category"
          />
        </UFormGroup>

        <UButton type="submit" color="black" variant="solid" label="Save" />
      </UForm>
    </UCard>
  </UModal>
</template>
