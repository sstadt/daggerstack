<template lang="pug">
  DialogConfirm(ref="confirmDialog" @confirm="confirmDelete")
  BasicDrawer(:title="id ? 'Edit Weapon' : 'New Weapon'" ref="editor")
    form.space-y-4.px-4(@submit.prevent="saveItem")
      .flex.space-x-2
        InputText.flex-grow(
          type="text"
          label="Name"
          v-model="itemName"
          :errors="v$.itemName ? v$.itemName.errors : []"
          required
        )
        InputSelect(label="Tier" v-model="itemTier" :options="tierOptions" required)
      .flex.space-x-2
        InputSelect.flex-grow(
          label="Slot"
          class="w-1/2"
          v-model="itemSlot"
          :options="slotOptions"
          required
        )
        InputSelect.flex-grow(
          label="Burden"
          class="w-1/2"
          v-model="itemBurden"
          :options="burdenOptions"
          required
        )
      .flex.space-x-2
        InputSelect.flex-grow(
          label="Trait"
          class="w-1/2"
          v-model="itemTrait"
          :options="traitOptions"
          required
        )
        InputSelect.flex-grow(
          label="Range"
          class="w-1/2"
          v-model="itemRange"
          :options="rangeOptions"
          required
        )
      .flex.space-x-2
        InputSelect.flex-grow(
          label="Damage"
          v-model="itemDamage"
          :options="damageOptions"
          required
        )
        InputCounter(
          label="Bonus"
          v-model="itemDamageBonus"
          :max="20"
          :min="-20"
        )
        InputSelect.flex-grow(
          label="Type"
          v-model="itemDamageType"
          :options="damageTypeOptions"
          required
        )
      InputText(type="text" label="Feature Name" v-model="featureName")
      InputTextarea(type="text" label="Feature Description" v-model="featureDescription")
      .space-y-2
        label.uppercase.font-bold.text-slate-500 Feature Modifiers
        .space-y-2
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
              button.text-2xl.py-2(@click="removeModifier(index)")
                span.sr-only Remove Modifier
                NuxtIcon(name="trash")
          BasicButton(priority="secondary" size="sm" icon @click="addModifier")
            NuxtIcon(name="plus")
      .flex.justify-between.items-center
        InputToggle(label="Public" v-model="itemPublic")
      .mt-auto.space-y-2
        BasicButton.w-full(type="submit" :disabled="!formValid") Save
        BasicButton.w-full(
          v-if="id"
          type="button"
          priority="secondary"
          @click="deleteItem"
        ) Delete
</template>

<script>
  export default {
    name: 'HomebrewDrawerWeapon',
  };
</script>

<script setup>
  import GENERAL from '~/data/general';

  import { useVuelidate } from '@vuelidate/core';
  import { required } from '@vuelidate/validators';

  import upgradeOptions from '~/config/upgradeOptions';
  import { newBuff } from '~/helpers/constructors';
  import { clone } from '~/helpers/utility';
  import { createSelectOptions } from '~/helpers/array';

  const emit = defineEmits(['save', 'delete']);

  const {
    id,
    userId,
    itemName,
    itemPublic,
    featureName,
    featureDescription,
    modify,
    editor,
    confirmDialog,
    removeModifier,
    addModifier,
  } = useHomebrewDrawer();

  const slotOptions = createSelectOptions(['primary', 'secondary']);
  const traitOptions = createSelectOptions(GENERAL.traits);
  const rangeOptions = createSelectOptions(GENERAL.range);
  const damageOptions = createSelectOptions(GENERAL.dice, false);
  const damageTypeOptions = createSelectOptions(['physical', 'magical']);
  const tierOptions = createSelectOptions([1, 2, 3, 4], false);
  const burdenOptions = [
    { label: 'One-handed', value: 1 },
    { label: 'Two-handed', value: 2 },
  ];

  const itemSlot = ref('primary');
  const itemTrait = ref('agility');
  const itemRange = ref('Melee');
  const itemDamage = ref('d8');
  const itemDamageBonus = ref(0);
  const itemDamageType = ref('physical');
  const itemTier = ref(1);
  const itemBurden = ref(1);

  const v$ = useVuelidate(
    { itemName: { required } },
    { itemName },
  );

  const formValid = computed(() => {
    const basicsValid = itemName.value !== '';

    return basicsValid;
  });

  const deleteItem = () => {
    confirmDialog.value
      .ask(`Are you sure you want to delete ${itemName.value}? This cannot be undone.`);
  };

  const confirmDelete = () => {
    editor.value.close();
    emit('delete', id.value);
  };

  const open = (item) => {
    loadItem(item);
    editor.value.open();
  };

  const loadItem = (item) => {
    const dmgArr = item ? item.damage.split(/[+-]/) : ['d8'];
    const [ dmgDie, dmgMod ] = dmgArr;

    itemName.value = item?.name || '';
    itemPublic.value = item?.public || false;
    itemSlot.value = item?.slot || 'primary';
    itemTrait.value = item?.trait || 'agility';
    itemRange.value = item?.range || 'Melee';
    itemDamage.value = dmgDie;
    itemDamageBonus.value = dmgMod || 0;
    itemDamageType.value = item?.damageType || 'physical';
    itemTier.value = item?.tier || 1;
    itemBurden.value = item?.burden || 1;
    featureName.value = item?.feature?.name || '';
    featureDescription.value = item?.feature?.description || '';

    // load modifiers
    if (item?.feature?.name) {
      const modifiers = [];

      for (let [key, value] of Object.entries(item.feature.modify)) {
        modifiers.push({
          stat: key,
          score: value,
        });
      }

      modify.value = modifiers;
    } else {
      modify.value = [];
    }

    // store db values for existing items
    id.value = item?.id ? item.id : null;
    userId.value = item?.user_id ? item.user_id : null;
  };

  const saveItem = async () => {
    const formValid = await v$.value.$validate();
    if (!formValid) return;

    const damageBonus = itemDamageBonus.value > 0
      ? `+${itemDamageBonus.value}`
      : itemDamageBonus.value < 0 ? String(itemDamageBonus.value) : '';
    const weapon = {
      name: itemName.value,
      public: itemPublic.value,
      slot: itemSlot.value,
      trait: itemTrait.value,
      range: itemRange.value,
      damage: `${itemDamage.value}${damageBonus}`,
      damageType: itemDamageType.value,
      tier: itemTier.value,
      burden: itemBurden.value,
      feature: null,
    };

    if (featureName.value !== '' && featureDescription.value !== '') {
      weapon.feature = {
        name: featureName.value,
        description: featureDescription.value,
        modify: {},
      };

      if (modify.value.length > 0) {
        modify.value.forEach((mod) => {
          weapon.feature.modify[mod.stat] = mod.score;
        });
      }
    }

    if (id.value) weapon.id = id.value;
    if (userId.value) weapon.user_id = userId.value;

    emit('save', weapon);
    editor.value.close();
  };

  defineExpose({ open });
</script>
