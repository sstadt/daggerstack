<template lang="pug">
  button.bg-emerald-500.py-4.px-6.text-lg.rounded-md.text-white.uppercase.font-bold.shadow-md.border.border-emerald-400.transition-colors(
    class="hover:shadow-lg active:shadow-lg hover:bg-emerald-600"
  )
    slot
</template>

<script>
  export default {
    name: 'BasicButton',
  };
</script>
