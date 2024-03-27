<template lang="pug">
  .container.p-8
    h2.text-center.text-2xl.font-black.uppercase.mb-2 Take
    InputTextarea(v-model="items")
    h2.text-center.text-2xl.font-black.uppercase.mb-4.mt-8 Choose
    InputSelect.mb-4(:options="choice1" label="choose" hide-label)
    InputSelect.mb-8(:options="choice2" label="choose" hide-label)
    BasicButton.block.ml-auto(@click="$emit('next')") Next
</template>

<script>
  import { createSelectOptions } from '~/helpers/array';

  const list1 = ['a minor health potion', 'a minor stamina potion'];
  const list2 = ['a stone totem from your mentor', 'a secret key'];

  export default {
    name: 'BuilderStep3',
    data() {
      return {
        choice1: createSelectOptions(list1),
        choice2: createSelectOptions(list2),
        items: 'a torch, 50ft of rope, basic supplies, and a handful of gold',
      };
    },
  };
</script>
