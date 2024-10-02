<template lang="pug">
  .p-8
    img.mt-8(:src="constructionImage")
</template>

<script>
  export default {
    name: 'CollectionArmor',
  };
</script>

<script setup>
  import constructionImage from '~/assets/images/under-construction.jpeg';
</script>
