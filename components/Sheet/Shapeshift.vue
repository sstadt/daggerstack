<template lang="pug">
  .space-y-6
    BasicCard(
      v-for="category in forms"
      :title="`Level ${category.level}`"
      expand
    )
      .divixe-y
        button.py-4.px-8.space-y-2.w-full.text-left(
          v-for="(form, index) in category.forms"
          class="focus:bg-slate-100"
          @click="shapeshift"
        )
          h3.text-lg.font-bold.uppercase.mb-2 {{ form.name }}
          p.text-slate-700 {{ form.examples.join(', ') }}, etc.
          p.flex.space-x-2.justify-between
            template(v-for="trait in traits")
              span(v-if="form[trait] > 0")
                span(v-if="form[trait] > 0") +
                span {{ form[trait] }} {{ ucFirst(trait) }} - {{ form.attack }}
            span Evasion: {{ form.evasion }}
            span Armor: {{ form.armor }}
          p(v-for="feature in form.features")
            strong {{ feature.name }}:
            | {{ feature.description }}
</template>

<script>
  import CLASSES from '~/data/classes';

  import { ucFirst } from '~/helpers/string';

  export default {
    name: 'SheetShapeshift',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        traits: ['agility', 'strength', 'finesse', 'instinct', 'presence', 'knowledge'],
      }
    },
    computed: {
      baseClass() {
        return CLASSES[this.character.baseClass];
      },
      forms() {
        return this.baseClass
          ? this.baseClass.alternateForms
              .filter((form) => form.level <= this.character.level)
          : [];
      },
    },
    methods: {
      ucFirst,
      shapeshift() {
        // TODO: select form and show alternate display
      },
    },
  };
</script>
