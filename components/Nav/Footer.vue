<template lang="pug">
  .bg-violet-800.py-2.text-white
    .container.max-w-5xl.flex.justify-between.items-center
      .flex.divide-x
        div(v-for="(link, index) in siteLinks" :class="getSiteLinkClass(index)")
          NuxtLink(:to="link.url") {{ link.title }}
      .flex.space-x-2
        a.p-2(v-for="link in socialLinks" :href="link.url")
          span.sr-only {{ link.title }}
          NuxtIcon(:name="link.icon")
</template>

<script>
  export default {
    name: 'NavFooter',
  };
</script>

<script setup>
  import { DISCORD_INVITE_URL, PATREON_URL } from '~/config/app';

  const siteLinks = [
    { url: '/about', title: 'About' },
    { url: '/privacy-policy', title: 'Privacy' },
  ];

  const socialLinks = [
    { url: DISCORD_INVITE_URL, title: 'Join us on Discord', icon: 'discord' },
    { url: PATREON_URL, title: 'Support Daggerstack', icon: 'patreon' },
  ];

  const getSiteLinkClass = (index) => {
    return {
      'pl-4': index >= siteLinks.length - 1,
      'pr-4': index === 0,
      'px-4': index > 0 && index < siteLinks.length,
    };
  };
</script>
