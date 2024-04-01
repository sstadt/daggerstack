<template lang="pug">
  .container.p-8
    form(@submit.prevent="next").space-y-8
      InputSelect(v-model="selectedClass" :options="classOptions" label="class" required)
      InputText(v-model="selectedSubclass" label="subclass")
      InputText(v-model="selectedHeritage" label="heritage")
      BasicButton.block.ml-auto(type="submit") Next
</template>

<script>
  import classes from '~/data/classes';
  import { ucFirst } from '~/helpers/string';
  import { useBuilderStore } from '~/stores/builder';

  export default {
    name: 'BuilderStep1',
    data() {
      const classOptions = Object.keys(classes).map(className => ({
        label: ucFirst(className),
        value: className,
      }));
      const [firstOption] = classOptions;

      return {
        classOptions: classOptions,
        selectedClass: firstOption.value,
        selectedSubclass: '',
        selectedHeritage: ''
      };
    },
    setup() {
      const builderStore = useBuilderStore();

      return { builderStore };
    },
    mounted() {
      this.builderStore.createCharacter();
    },
    methods: {
      next() {
        this.builderStore.updateCharacter({
          baseClass: this.selectedClass,
          subclass: this.selectedSubclass,
          heritage: this.selectedHeritage,
        });

        this.$emit('next');
      },
    },
  };
</script>
