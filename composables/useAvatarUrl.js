export const useAvatarUrl = () => {
  // Get the current user metadata - which contains the name of the avatar image
  // get the public url of the image
  // Watch the user for any chnages, if the user sign-in or sign-out - so always display the proper image of the user

  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const getPublicUrl = () => {
    if (!user.value?.user_metadata?.avatar_url) return null;

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(user.value?.user_metadata?.avatar_url);

    return data.publicUrl;
  };

  const url = ref(getPublicUrl());

  watch(user, () => (url.value = getPublicUrl()), { immediate: true });

  return { url };
};
