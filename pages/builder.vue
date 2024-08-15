<template lang="pug">
  .builder-page
    Head
      Title Daggerstack.com - Character Builder
    CharacterBuilder(v-if="dataLoaded")
    .flex.flex-col.items-center.justify-center.h-full-minus-nav(v-else)
      BasicLoader
</template>

<script>
  import { mapState } from 'pinia';

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

      if (this.loaded) this.dataLoaded = true;
    },
    computed: {
      ...mapState(useUserStore, ['loaded']),
    },
    watch: {
      loaded(newVal, oldVal) {
        if (newVal !== oldVal && newVal === true) {
          this.dataLoaded = true;
        }
      },
    },
  };
</script>
