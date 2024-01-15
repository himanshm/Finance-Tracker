<script setup lang="ts">
const props = defineProps({
    modalValue: Boolean
})
const emit= defineEmits(['update:modalValue'])

// define a computed value or writable computed
const isOpen = computed({
    get: () => props.modalValue,
    set: (newValue) => emit('update:modalValue', newValue) 
})
</script>

<template>
    <UModal v-model="isOpen">
        <UCard>
          <template #header> Add Transaction </template>
          <div>Hello</div>
        </UCard>
      </UModal>
</template>