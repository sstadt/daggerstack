<template lang="pug">
  .py-4
    .flex.items-center.justify-between
      InputToggle(
        v-model="enabled"
        :label="`Enable ${name}`"
        hide-label
      )
      p.text-xl.mx-3.h-full
        Transition(name="fade" mode="out-in")
          span(v-if="!expanded") {{ name }}
          span.text-slate-400(v-else) editing...
      button.pl-3.text-xl.ml-auto(@click="toggle")
        NuxtIcon(:name="expanded ? 'times' : 'edit'")
    Transition(name="slide-fade-right")
      .pt-2.space-y-2(v-if="expanded")
        InputText(v-model="name")
        p.text-right(v-if="buff.scar") Hope Slot {{ buff.modify.hopeSlot }} (scar)
        div(v-else)
          TransitionGroup(name="slide-fade-right")
            .flex.space-x-2.items-center(v-for="(mod, index) in modify" :key="index")
              InputSelect(
                label="Upgrade"
                v-model="modify[index].stat"
                :options="upgradeOptions"
                hide-label
              )
              InputCounter(
                label="Modifier"
                v-model="modify[index].score"
                hide-label
                :min="-20"
                :max="20"
              )
              button.text-2xl.py-2(
                :disabled="modify.length < 2"
                :class="{ 'opacity-40': modify.length < 2 }"
                @click="removeModifier(index)"
              )
                span.sr-only Remove Modifier
                NuxtIcon(name="trash")
        .flex.justify-between
          BasicButton(v-if="!buff.scar" priority="secondary" size="sm" icon @click="addModifier")
            NuxtIcon(name="plus")
          .flex.ml-auto
            BasicButton(
              priority="secondary"
              size="sm"
              rounded="left"
              icon
              @click="remove"
            )
              span.sr-only Delete Effect
              NuxtIcon(name="trash")
            BasicButton(
              size="sm"
              rounded="right"
              icon
              :disabled="saveDisabled"
              @click="save"
            )
              span.sr-only Save Effect
              NuxtIcon(name="check")
</template>

<script>
  import { newBuff } from '~/helpers/constructors';
  import upgradeOptions from '~/config/upgradeOptions';

  export default {
    name: 'SheetBuff',
    props: {
      character: {
        type: Object,
        required: true,
      },
      buff: {
        type: Object,
        required: true,
      },
    },
    data() {
      const modifierKeys = Object.keys(this.buff.modify);
      const modify = modifierKeys.length > 0
        ? modifierKeys.map((key) => newBuff({ stat: key, score: this.buff.modify[key] }))
        : [ newBuff() ];

      return {
        name: this.buff.name,
        enabled: this.buff.enabled,
        modify,
        expanded: this.buff.name === '',
      };
    },
    computed: {
      upgradeOptions() {
        const experienceOptions = this.character.experience.map((experience) => {
          return {
            label: `${experience.name} (experience)`,
            value: `experience-${experience.id}`,
          }
        });

        return upgradeOptions.concat(experienceOptions);
      },
      saveDisabled() {
        if (this.name === '') return true;

        return this.modify.filter((mod) => mod.stat !== '').length === 0;
      },
    },
    methods: {
      toggle() {
        this.expanded = !this.expanded;
      },
      addModifier() {
        this.modify.push(newBuff());
      },
      removeModifier(index) {
        this.modify.splice(index, 1);
      },
      remove() {
        this.$emit('remove');
      },
      save() {
        const buff = {
          id: this.buff.id,
          name: this.name,
          enabled: this.enabled,
          scar: this.buff.scar,
          modify: {},
        };

        this.modify.forEach((mod) => {
          if (mod.stat !== '') {
            buff.modify[mod.stat] = mod.score;
          }
        });

        this.$emit('save', buff);
        this.expanded = false;
      },
    },
    watch: {
      enabled(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.save();
        }
      },
    },
  };
</script>
