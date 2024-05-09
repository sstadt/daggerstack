<template lang="pug">
  .builder-page
    Head
      Title Daggerstack.com - Character Builder
    CharacterBuilder(v-if="dataLoaded")
</template>

<script>
  export default {
    name: 'BuilderPage',
    data() {
      return {
        dataLoaded: false,
      };
    },
    setup() {
      const builderStore = useBuilderStore();

      return { builderStore };
    },
    mounted() {
      if (this.$route.query.new) {
        this.builderStore.newCharacter();
      }

      this.dataLoaded = true;
    },
  };
</script>
