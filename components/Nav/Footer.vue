<template lang="pug">
  .bg-violet-800.py-2.text-white
    .container.max-w-5xl.flex.justify-between.items-center
      .flex.divide-x
        .pr-4
          NuxtLink(to="/") Home
        .px-4(v-if="user")
          NuxtLink(to="/character") Characters
        .pl-4
          NuxtLink(to="/about") About
      .flex.space-x-2
        a.p-2(:href="discordLink")
          NuxtIcon(name="discord")
        a.p-2(:href="patreonLink")
          NuxtIcon(name="patreon")
</template>

<script>
  import { mapState } from 'pinia';

  import { DISCORD_INVITE_URL, PATREON_URL } from '~/config/app';

  export default {
    name: 'NavFooter',
    data() {
      return {
        discordLink: DISCORD_INVITE_URL,
        patreonLink: PATREON_URL,
      };
    },
    computed: {
      ...mapState(useUserStore, ['user']),
    },
  };
</script>
