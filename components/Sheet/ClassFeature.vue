<template lang="pug">
  BasicCard(title="Class Features")
    .py-4(v-for="feature in features")
      h3.font-bold.mb-2.text-xl {{ feature.name }}
      BasicMarkdown(:source="feature.description")
</template>

<script>
  import classes from '~/data/classes';

  export default {
    name: 'SheetClassFeature',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    computed: {
      features() {
        const characterClass = classes[this.character.baseClass];

        return characterClass.classFeatures;
      },
    },
  };
</script>
