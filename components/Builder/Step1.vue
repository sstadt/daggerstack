<template lang="pug">
  .container.p-8
    form(@submit.prevent="next").space-y-8
      InputSelect(
        v-model="selectedClass"
        :options="classOptions"
        label="class"
        required
      )
      InputText(
        v-model="selectedSubclass"
        :errors="v$.selectedSubclass.$errors"
        label="subclass"
        required
      )
      InputText(
        v-model="selectedHeritage"
        :errors="v$.selectedHeritage.$errors"
        label="heritage"
        required
      )
      BasicButton.block.ml-auto(type="submit") Next
</template>

<script>
  import { useVuelidate } from '@vuelidate/core';
  import { required } from '@vuelidate/validators';

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
    validations() {
      return {
        selectedSubclass: { required },
        selectedHeritage: { required },
      };
    },
    setup() {
      const builderStore = useBuilderStore();

      return {
        builderStore,
        v$: useVuelidate(),
      };
    },
    mounted() {
      this.builderStore.createCharacter();
    },
    methods: {
      async next() {
        const formValid = await this.v$.$validate();

        if (formValid) {
          this.builderStore.updateCharacter({
            baseClass: this.selectedClass,
            subclass: this.selectedSubclass,
            heritage: this.selectedHeritage,
          });

          this.$emit('next');
        }
      },
    },
  };
</script>
