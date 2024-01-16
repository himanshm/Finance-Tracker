<script setup lang="ts">
import { transactionCategories, transactionType, categories } from '../constants';
import { z } from 'zod';
const props = defineProps({
  modalValue: Boolean,
});
const emit = defineEmits(['update:modalValue']);

// define a computed value or writable computed
const isOpen = computed({
  get: () => props.modalValue,
  set: (newValue) => emit('update:modalValue', newValue),
});

const defaultSchema = z.object({
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive('Amount needs to be more than 0.'),
});
const incomeSchema = z.object({
  type: z.literal('Income'),
});

const expenseSchema = z.object({
  type: z.literal('Expense'),
  category: z.enum(categories),
});

const investmentSchema = z.object({
  type: z.literal('Investment'),
});
const savingSchema = z.object({
  type: z.literal('Saving'),
});

const schema = z.intersection(
  z.discriminatedUnion('type', [incomeSchema, expenseSchema, investmentSchema, savingSchema]),
  defaultSchema
);

const form = ref();

const save = async () => {
  form.value.validate();
};

// An interface for the state
interface State {
  type: string | undefined;
  amount: number;
  created_at: string | undefined;
  description: string | undefined;
  category: string | undefined;
}

const state = ref<State>({
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
});

const isCategoryVisible = computed(() => state.value.type === 'Expense');
</script>

<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header> Add Transaction </template>

      <UForm :state="state" :schema="schema" ref="form" @submit.prevent="save">
        <UFormGroup :required="true" label="Transaction Type" name="type" class="mb-4">
          <USelect placeholder="Select the transaction type" :options="transactionType" v-model="state.type" />
        </UFormGroup>

        <UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
          <UInput type="number" placeholder="Amount" v-model.number="state.amount" />
        </UFormGroup>

        <UFormGroup label="Transaction Date" :required="true" name="created_at" class="mb-4">
          <UInput type="date" placeholder="i-heroicons-calender-days-20-solid" v-model="state.created_at" />
        </UFormGroup>

        <UFormGroup label="Description" hint="Optional" name="description" class="mb-4">
          <UInput placeholder="Description" v-model="state.description" />
        </UFormGroup>

        <UFormGroup :required="true" label="Category" name="category" class="mb-4" v-if="isCategoryVisible">
          <USelect placeholder="Category" :options="transactionCategories" v-model="state.category" />
        </UFormGroup>

        <UButton type="submit" color="black" variant="solid" label="Save" />
      </UForm>
    </UCard>
  </UModal>
</template>
