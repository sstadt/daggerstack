<template lang="pug">
  BasicDrawer(title="New Item" ref="itemEditor")
    form.space-y-4.px-4(@submit.prevent="createItem")
      InputText(type="text" label="Name" v-model="itemName")
      InputTextarea(type="text" label="Description" v-model="itemDescription")
      .space-y-2
        InputCheckbox(v-model="itemHasCharges" label="Has Charges")
        transition(name="slide-fade-left")
          .space-y-4(v-if="itemHasCharges")
            .flex.space-x-4
              InputCounter(
                label="charges"
                v-model="itemCharges"
                :max="3"
                :min="1"
              )
              InputSelect.flex-grow(
                label="recharge on"
                v-model="itemRechargeOn"
                :options="restOptions"
              )
      InputSelect(
        label="Additional Options"
        v-model="itemType"
        :options="itemTypeOptions"
      )
      transition(name="fade" mode="out-in")
        .space-y-4(v-if="itemType === 'consumable'")
          .flex.space-x-2
            InputSelect.shrink-0(
              label="recharge"
              v-model="resourceType"
              :options="resourceOptions"
              class="w-7/12"
            )
            InputText(
              label="amount"
              v-model="resourceAmount"
              placeholder="1d4"
            )
        .space-y-4(v-else-if="itemType === 'recipe'")
          InputText(label="craft item" v-model="craftItemSearch")
          .flex.space-x-4
            InputCounter(label="Cost" v-model="craftItemCost")
            InputSelect.flex-grow(
              label="Resource"
              v-model="craftItemResource"
              :options="resourceOptions"
            )
        .space-y-4(v-else-if="itemType === 'relic'")
          InputText(label="feature name" v-model="featureName")
          InputTextarea(label="feature description" v-model="featureDescription")
          .space-y-2
            label.uppercase.font-bold.text-slate-500 Modifiers
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
        .space-y-4(v-else-if="itemType === 'attachment'")
          BasicAlert Configured item charges will be usable on attachment target instead of this item
          InputSelect(label="Attach to" v-model="attachType" :options="attachTypeOptions")
          InputText(label="feature name" v-model="featureName")
          InputTextarea(label="feature description" v-model="featureDescription")
          .space-y-2
            label.uppercase.font-bold.text-slate-500 Modifiers
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
        .space-y-4(v-else-if="itemType === 'downtime'")
          InputSelect(label="on" v-model="restType" :options="restOptions")
          .flex.space-x-2
            InputSelect.shrink-0(
              label="recharge"
              v-model="resourceType"
              :options="resourceOptions"
              class="w-7/12"
            )
            InputText(
              label="amount"
              v-model="resourceAmount"
              placeholder="1d4"
            )
      .flex.justify-between.items-center
        InputToggle(label="Public" v-model="itemPublic")
        BasicButton(type="submit") Save
</template>

<script>
  export default {
    name: 'CollectionItems',
  };
</script>

<script setup>
  import resourceStrings from '~/config/resourceStrings';
  import upgradeOptions from '~/config/upgradeOptions';
  import { newBuff } from '~/helpers/constructors';

  const itemEditor = ref(null);

  const itemName = ref('');
  const itemDescription = ref('');
  const itemPublic = ref(false);
  const itemHasCharges = ref(false);
  const itemCharges = ref(3);
  const itemChargesDescription = ref('');

  const itemRechargeOn = ref('shortRest');
  const restOptions = [
    { label: 'Short Rest', value: 'shortRest' },
    { label: 'Long Rest', value: 'longRest' },
    { label: 'Any Rest', value: 'anyRest' },
  ];

  const itemType = ref('');
  const itemTypeOptions = [
    { label: 'Consumable', value: 'consumable' }, // configure optional resource recharge
    { label: 'Recipe', value: 'recipe' }, // choose another item to craft and a resource cost
    { label: 'Relic', value: 'relic' }, // allows adding of modfiers
    { label: 'Attachment', value: 'attachment' }, // applies charges to parent, allows creation of feature
    { label: 'Downtime', value: 'downtime' }, // recharge resources automatically on downtime activity
  ];

  const modify = ref([]);
  const featureName = ref('');
  const featureDescription = ref('');

  const craftItemSearch = ref('');
  const craftItemCost = ref(0);
  const craftItemResource = ref('goldHandful');
  const resourceOptions = Object.keys(resourceStrings).map((key) => {
    return {
      label: resourceStrings[key],
      value: key,
    };
  });

  const attachType = ref('');
  const attachTypeOptions = [
    { label: 'Weapon', value: 'weapon' },
    { label: 'Melee Weapon', value: 'meleeWeapon' },
    { label: 'Armor', value: 'armor' },
  ];

  const restType = ref('');
  const resourceType = ref('');
  const resourceAmount = ref('');


  const removeModifier = (index) => {
    modify.value.splice(index, 1);
  };

  const addModifier = () => {
    modify.value.push(newBuff());
  };

  const loadItem = () => {
    itemName.value = '';
    itemDescription.value = '';
    itemPublic.value = false;
    itemType.value = '';
    itemCharges.value = 0;
    itemChargesDescription.value = 0;

    craftItemSearch.value = '';
    craftItemCost.value = 0;
    craftItemResource.value = 'goldHandful';

    resourceType.value = '';
    resourceAmount.value = '';
    restType.value = '';
  };

  const open = (item) => {
    loadItem(item);
    itemEditor.value.open();
  };

  defineExpose({ open });
</script>
