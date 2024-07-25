<template lang="pug">
  .shapeshift-preview
    h3.text-lg.font-bold.uppercase.mb-2(v-if="!hideName") {{ form.name }}
    template(v-if="!form.upgradeTier")
      p.text-slate-700 {{ form.examples.join(', ') }}, etc.
      p.flex.space-x-2.justify-between
        template(v-for="trait in traits")
          span(v-if="form[trait] > 0")
            span(v-if="form[trait] > 0") +
            span {{ form[trait] }} {{ ucFirst(trait) }} {{ form.attack }}
        span Evasion: {{ form.evasion }}
    BasicMarkdown(
      v-for="feature in form.features"
      :source="`**${feature.name}**: ${feature.description}`"
    )
</template>

<script>
  import GENERAL from '~/data/general';

  import { ucFirst } from '~/helpers/string';

  export default {
    name: 'SheetShapeshiftPreview',
    props: {
      form: {
        type: Object,
        required: true,
      },
      hideName: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        traits: [ ...GENERAL.traits ],
      };
    },
    methods: {
      ucFirst,
    },
  };
</script>
