<template lang="pug">
  transition(:name="pageTransition" mode="out-in")
    .space-y-6(v-if="settingsLoaded && selectedForm")
      div
        h2.text-center.text-2xl.font-black.uppercase.relative
          | {{ selectedForm.name }}
          BasicButton.absolute.left-6.flex.items-center.justify-center(
            size="sm"
            priority="secondary"
            class="top-1/2 -translate-y-1/2"
            icon
            @click="shapeshift(null)"
          )
            .sr-only Choose Form
            NuxtIcon(name="back")
        p.text-center.text-slate-500 {{ selectedForm.examples.join(', ') }}, etc.
      .px-3.flex.items-center
        TraitDisplay.px-2(
          title="evasion"
          class="w-1/3"
          :score="selectedForm.evasion"
        )
        .w-px.h-20.mx-2.bg-slate-300
        TraitDisplay.px-2(
          title="armor"
          class="w-1/3"
          :score="characterArmor"
        )
        .flex.items-start.justify-center.flex-grow
          InputCheckboxCounter.grid.grid-cols-3.grid-rows-3.gap-1(
            v-model="currentArmor"
            :max="maxArmor"
            :enabled="armorSlots"
          )
      BasicCard(title="Features")
        .flex.space-x-2.justify-between.text-xl.py-4(v-if="primaryTrait")
          p +{{ selectedForm[primaryTrait] }} {{ ucFirst(primaryTrait) }}
          p Attack: {{ selectedForm.attack }}
        .space-y-4
          BasicMarkdown.text-xl(
            v-for="feature in selectedForm.features"
            :source="`**${feature.name}** ${feature.description}`"
          )
    .space-y-6(v-else-if="settingsLoaded")
      BasicCard(
        v-for="category in forms"
        :title="`Level ${category.level} Wildshape`"
        expand
      )
        .divide-y
          button.py-4.px-8.space-y-2.w-full.text-left(
            v-for="(form, index) in category.forms"
            class="focus:bg-slate-100 lg:px-0"
            @click="shapeshift(form)"
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
            BasicMarkdown(
              v-for="feature in form.features"
              :source="`**${feature.name}** ${feature.description}`"
            )
</template>

<script>
  import GENERAL from '~/data/general';
  import CLASSES from '~/data/classes';

  import { ucFirst } from '~/helpers/string';
  import { calculateModifiers, getFeaturesByAttribute } from '~/helpers/character';

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
        selectedForm: null,
        currentArmor: this.character.armor.current,
        maxArmor: GENERAL.maxArmorSlots,
        settingsLoaded: false,
      }
    },
    setup() {
      const charactersStore = useCharactersStore();
      const sheetStore = useSheetStore();

      return { charactersStore, sheetStore };
    },
    computed: {
      pageTransition() {
        return this.selectedForm ? 'paginate-right' : 'paginate-left';
      },
      baseClass() {
        return CLASSES[this.character.baseClass];
      },
      forms() {
        return this.baseClass
          ? this.baseClass.alternateForms
              .filter((form) => form.level <= this.character.level)
          : [];
      },
      armorSlots() {
        const base = this.character.armor.slots;
        const features = getFeaturesByAttribute(this.character, 'armorSlot');

        return base + calculateModifiers(features, 'armorSlot');
      },
      characterEvasion() {
        return this.selectedForm ? this.selectedForm.armor : 0;
      },
      characterArmor() {
        return this.selectedForm ? this.selectedForm.armor : 0;
      },
      primaryTrait() {
        if (!this.selectedForm) return null;

        let trait = null;
        let score = -999;

        this.traits.forEach((t) => {
          if (this.selectedForm[t] > score) {
            trait = t;
            score = this.selectedForm[t];
            return;
          }
        });

        return trait;
      },
    },
    mounted() {
      this.selectedForm = this.sheetStore.settings.selectedForm;
      this.settingsLoaded = true;
    },
    methods: {
      ucFirst,
      shapeshift(form) {
        this.selectedForm = form;
      },
    },
    watch: {
      currentArmor(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.character.armor.current = newVal;
          this.charactersStore.saveCharacter(this.character);
        }
      },
      selectedForm(newVal, oldVal) {
        if (this.settingsLoaded && newVal !== oldVal) {
          this.sheetStore.saveSetting({ selectedForm: newVal });
        }
      },
    },
  };
</script>
