<template>
  <UFOrm
    :state="state"
    :schema="schema">
    <UFormGroup
      class="mb-4"
      label="Full Name"
      name="name">
      <UInput v-model="state.fullName" />
    </UFormGroup>

    <UFormGroup
      class="mb-4"
      label="Email"
      name="email"
      help="You will receive a confirmation email on both the old and new addresses if you modify the email address.">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="save"
      :pending="pending" />
  </UFOrm>
</template>

<script setup>
  import { z } from 'zod';

  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const { toastSuccess, toastError } = useAppToast();
  const pending = ref(false);

  const state = ref({
    fullName: '',
    email: user.value?.email,
  });

  const schema = z.object({
    fullName: z.string().min(2).optional(),
    email: z.string().email(),
  });
</script>
