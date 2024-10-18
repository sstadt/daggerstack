<template lang="pug">
  .max-w-5xl.container.p-8
    form(@submit.prevent="next").space-y-8
      h2.text-center.text-2xl.font-black.uppercase.mb-2 Starting Equipment
      .space-y-4
        transition-group(name="slide-fade-left")
          InventoryWeapon.cursor-pointer(
            v-for="(weapon, index) in weapons"
            :key="weapon.id"
            :weapon="weaponsStore.weapon(weapon.itemId)"
            @click="openPicker('weapon', index)"
          )
        transition(name="fade")
          .flex.justify-end(v-if="weapons.length < 2")
            BasicButton(size="sm" priority="secondary" @click="openPicker('weapon')") Add Weapon
      transition(name="fade" mode="out-in")
        InventoryArmor.cursor-pointer(
          v-if="armor && armor.itemId"
          :armor="armorStore.armor(armor.itemId)"
          @click="openPicker('armor')"
        )
        .flex.justify-end(v-else)
          BasicButton(size="sm" priority="secondary" @click="openPicker('armor')") Add Armor
      .flex.justify-between.items-center
        NuxtLink(to="/character") Finish Later
        BasicButton.block(type="submit" :disabled="submitDisabled") Next
    BasicDrawer(ref="equipmentPicker" :title="pickerTitle")
      InventoryEquipmentPicker(
        :character="builderStore.character"
        :type="activeType"
        starting-only
        @select="selectItem"
      )
</template>

<script>
  export default {
    name: 'BuilderStep4',
  };
</script>

<script setup>
  import { newWeapon, newArmor } from '~/helpers/constructors';

  const emit = defineEmits(['next']);

  const builderStore = useBuilderStore();
  const weaponsStore = useWeaponsStore();
  const armorStore = useArmorStore();

  const activeType = ref('weapon');
  const weapons = ref([]);
  const armor = ref(null);
  const existingIndex = ref(null);
  const equipmentPicker = ref(null);

  const pickerTitle = computed(() => {
    return activeType.value === 'weapon' ? 'Weapons' : 'Armor';
  });

  const submitDisabled = computed(() => {
    return weapons.value.length < 1 || !armor.value?.name;
  });

  const openPicker = (type, index) => {
    activeType.value = type;
    existingIndex.value = Number.isInteger(index) ? index : null;
    equipmentPicker.value.open();
  };

  const selectItem = (item) => {
    if (activeType.value === 'weapon') {
      const weapon = newWeapon({ name: item.name, itemId: item.id });

      if ( Number.isInteger(existingIndex.value)) {
        weapons.value.splice(existingIndex.value, 1, weapon);
      } else {
        weapons.value.push(weapon);
      }
    } else {
      armor.value = newArmor({ name: item.name, itemId: item.id });
    }

    equipmentPicker.value.close();
  };

  const next = async () => {
    builderStore.updateCharacter({
      inventory: {
        weapons: [ ...weapons.value ],
        armor: { ...armor.value },
      },
    });

    emit('next');
  };

  onMounted(() => {
    if (
      builderStore.character.inventory?.weapons &&
      builderStore.character.inventory?.weapons.length > 0
    ) {
      weapons.value = [ ...builderStore.character.inventory.weapons ];
    }

    if (builderStore.character.inventory?.armor?.id) {
      armor.value = { ...builderStore.character.inventory.armor };
    }
  });
</script>
