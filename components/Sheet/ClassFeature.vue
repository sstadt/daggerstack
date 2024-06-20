<template lang="pug">
  BasicCard(title="Class Features")
    .py-4(v-for="feature in features")
      h3.font-bold.mb-2.text-xl {{ feature.name }}
      BasicMarkdown(:source="feature.description")
</template>

<script>
  import CLASSES from '~/data/classes';

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
        const classData = CLASSES[this.character.baseClass];
        const multiclass = this.character.levelSelections.find((selection) => selection.type === 'multiclass');
        const multiclassData = multiclass ? CLASSES[multiclass.options.class] : null;

        return multiclassData
          ? [ ...classData.classFeatures ].concat(multiclassData.classFeatures)
          : [ ...classData.classFeatures ];
      },
    },
  };
</script>
