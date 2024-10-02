<template lang="pug">
  BasicCard(title="items")
    .space-y-8
      .flex.flex-col.space-y-2.items-end
        TransitionGroup.w-full.divide-y(name="slide-fade-left" tag="div")
          InventoryItem(
            v-for="(item, index) in character.inventory.items"
            :key="item.id"
            :character-item="item"
            :character="character"
            @update="(updatedItem) => updateItem(updatedItem, index)"
            @remove="removeItem(index)"
          )
        BasicButton(size="sm" priority="secondary" @click="openItemPicker") Add Item
      div(v-for="n in maxInventoryWeapons")
        h3.text-xl.font-black.uppercase.mt-6 Inventory Weapon {{ n }}
        InventoryWeapon(
          v-if="inventoryWeapons[n - 1]"
          :weapon="inventoryWeapons[n - 1]"
          :character-weapon="character.inventory.weapons[n - 1]"
          :character="character"
          @click="openEquipmentPicker(n - 1)"
        )
        BasicButton.mx-auto.my-4.block(
          v-else
          priority="secondary"
          @click="openEquipmentPicker(n - 1)"
        ) Select Weapon
    BasicDrawer(ref="itemPicker" title="Items")
      InventoryItemPicker(:character="character" @select="addItem")
    BasicDrawer(ref="equipmentPicker" title="Weapons")
      InventoryEquipmentPicker(
        :type="type"
        :character="character"
        :active-slot="slot"
        :active-index="activeSlot"
        @select="selectWeapon"
        @remove-equipped-item="removeEquippedWeapon"
      )
</template>

<script>
  export default {
    name: 'SheetInventory',
  };
</script>

<script setup>
  import GENERAL from '~/data/general';
  import WEAPONS from '~/data/weapons';

  import { newWeapon } from '~/helpers/constructors';

  import { useCharactersStore } from '~/stores/characters';

  import {
    ALL_WEAPON_TYPE,
    SLOT_INVENTORY_WEAPON,
  } from '~/config/equipmentPicker';

  const charactersStore = useCharactersStore();

  const props = defineProps({
    character: {
      type: Object,
      required: true,
    },
  });

  const maxInventoryWeapons = GENERAL.maxInventoryWeapons;

  const activeSlot = ref(0);
  const type = ref(ALL_WEAPON_TYPE);
  const slot = ref(SLOT_INVENTORY_WEAPON);
  const itemPicker = ref(null);
  const equipmentPicker = ref(null);

  const inventoryWeapons = computed(() => {
    const weapons = props.character.inventory.weapons
      .map((w) => WEAPONS.items.find((weapon) => weapon.name === w.name));

    return weapons;
  });

  const openEquipmentPicker = (slot) => {
    activeSlot.value = slot;
    equipmentPicker.value.open();
  };

  const selectWeapon = ({ item }) => {
    if (props.character.inventory.weapons[activeSlot.value]) {
      props.character.inventory.weapons.splice(activeSlot.value, 1, newWeapon({ name: item }));
    } else {
      props.character.inventory.weapons.push(newWeapon({ name: item }));
    }

    charactersStore.saveCharacter(props.character);
    equipmentPicker.value.close();
  };

  const removeEquippedWeapon = () => {
    props.character.inventory.weapons.splice(activeSlot.value, 1, newWeapon());
    charactersStore.saveCharacter(props.character);
    equipmentPicker.value.close();
  };

  const openItemPicker = () => {
    itemPicker.value.open();
  };

  const addItem = (item) => {
    itemPicker.value.close();
    props.character.inventory.items.push({ ...item });
    charactersStore.saveCharacter(props.character);
  };

  const updateItem = (updatedItem, index) => {
    const item = Object.assign({}, props.character.inventory.items[index], updatedItem);
    props.character.inventory.items.splice(index, 1, item);
    charactersStore.saveCharacter(props.character);
  };

  const removeItem = (index) => {
    props.character.inventory.items.splice(index, 1);
    charactersStore.saveCharacter(props.character);
  };
</script>
