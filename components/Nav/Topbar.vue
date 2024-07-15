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
            li(@click="() => userMenuOpen = false")
              NuxtLink.inline-block.px-4.py-2.w-full.whitespace-nowrap(
                class="hover:bg-slate-600"
                to="/character"
              ) Character List
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
    data() {
      return {
        userMenuOpen: false,
      };
    },
    setup() {
      const userStore = useUserStore();
      const toastStore = useToastStore();
      return { userStore, toastStore };
    },
    methods: {
      toggleUserMenu() {
        this.userMenuOpen = !this.userMenuOpen;
      },
      logOut() {
        this.userMenuOpen = false;
        this.$refs.confirm
          .ask('Are you sure you want to log out?');
      },
      async confirmLogOut() {
        const error = await this.userStore.logOut();

        if (error) {
          this.toastStore.addMessage({ body: error.message });
        } else {
          this.$router.push('/');
        }
      },
    },
  };
</script>
