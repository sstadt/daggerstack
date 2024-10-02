<template lang="pug">
  .w-full.bg-black.-my-px
    .max-w-5xl.container.flex.justify-between.items-center.text-white
      NuxtLink.title.inline-block.py-2(to="/") Daggerstack
      .relative(v-if="userStore.user")
        button.h-full.py-2(@click="toggleUserMenu")
          | {{ userStore.user.user_metadata.display_name }}
          NuxtIcon.ml-2(:name="userMenuOpen ? 'chevron-up' : 'chevron-down'")
        Transition(name="fade")
          ul.absolute.bottom-0.right-0.translate-y-full.bg-slate-800.shadow.z-20.divide-y.divide-slate-700.text-right(
            v-if="userMenuOpen"
          )
            li(
              v-for="link in menuLinks"
              @click="() => userMenuOpen = false"
            )
              NuxtLink.inline-block.px-4.py-2.w-full.whitespace-nowrap(
                class="hover:bg-slate-600"
                :to="link.url"
              ) {{ link.label }}
            li
              .px-4.py-2.w-full.whitespace-nowrap(
                class="hover:bg-slate-600"
                @click="logOut"
              ) Log Out
    DialogConfirm(ref="confirm" @confirm="confirmLogOut")
</template>

<script>
  export default {
    name: 'NavTopbar',
  };
</script>

<script setup>
  const router = useRouter();
  const userStore = useUserStore();
  const toastStore = useToastStore();

  const userMenuOpen = ref(false);
  const confirm = ref(null);

  const menuLinks = ref([
    { url: '/character', label: 'Character List' },
    { url: '/homebrew', label: 'Browse Homebrew' },
    { url: '/homebrew/collection', label: 'My Homebrew' },
  ]);

  const toggleUserMenu = () => {
    userMenuOpen.value = !userMenuOpen.value;
  };

  const logOut = () => {
    userMenuOpen.value = false;
    confirm.value.ask('Are you sure you want to log out?');
  };

  const confirmLogOut = async () => {
    const error = await userStore.logOut();

    if (error) {
      toastStore.addMessage({ body: error.message });
    } else {
      router.push('/');
    }
  };
</script>
