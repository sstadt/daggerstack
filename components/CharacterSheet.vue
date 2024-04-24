<template lang="pug">
  .character-sheet
    SheetHeader.mb-8(:character="character")
      .flex.bg-black.relative
        NavButton(
          v-for="(button, index) in navButtons"
          :icon="button.icon"
          class="w-1/4"
          @click="open(index)"
        )
        .nav-indicator.absolute.bottom-0.h-2.bg-white.pointer-events-none.transition-all(
          class="w-1/4"
          :style="indicatorStyle"
        )
    transition(:name="transition" mode="out-in")
      .space-y-16.pb-4(v-if="currentIndex === 0")
        SheetStatistics(:character="character")
        SheetExperience(:character="character")
        SheetClassFeature(:character="character")
      .space-y-8.pb-4(v-else-if="currentIndex === 1")
        SheetWeapons(
          ref="sheetWeapons"
          :character="character"
          @pick-equipment="openEquipmentPicker"
        )
        SheetArmor(
          ref="sheetArmor"
          :character="character"
          @pick-equipment="openEquipmentPicker"
        )
      .space-y-8.pb-4(v-else-if="currentIndex === 2")
        SheetGold(:character="character")
        SheetInventory(
          ref="sheetInventory"
          :character="character"
          @pick-equipment="openEquipmentPicker"
        )
      .space-y-8.pb-4(v-else-if="currentIndex === 3")
        SheetBackground(:character="character")
        SheetConnections(:character="character")
    BasicDrawer(ref="equipmentPicker" :title="pickerTitle")
      InventoryPicker(
        :type="pickerType"
        :character="character"
        :include-inventory="includeInventory"
        :active-slot="activeSlot"
        @select="selectItem"
        @remove-equipped-item="removeEquippedItem(activeSlot)"
      )
</template>

<script>
  import { useCharactersStore } from '~/stores/characters';

  import { newWeapon, newArmor } from '~/helpers/character';

  import {
    ALL_WEAPON_TYPE,
    PRIMARY_WEAPON_TYPE,
    SECONDARY_WEAPON_TYPE,
    ARMOR_TYPE,
    SLOT_INVENTORY_WEAPON,
    SLOT_PRIMARY_WEAPON,
    SLOT_SECONDARY_WEAPON,
    SLOT_ARMOR,
  } from '~/config/equipmentPicker';

  const validTypes = [
    ALL_WEAPON_TYPE,
    PRIMARY_WEAPON_TYPE,
    SECONDARY_WEAPON_TYPE,
    ARMOR_TYPE,
  ];

  export default {
    name: 'CharacterSheet',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        transition: 'paginate-right',
        currentIndex: 0,
        navButtons: [
          { icon: 'attributes' },
          { icon: 'equipment' },
          { icon: 'inventory' },
          { icon: 'background' },
        ],
        activeSlot: null,
        pickerType: PRIMARY_WEAPON_TYPE,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();

      return { charactersStore };
    },
    computed: {
      indicatorStyle() {
        const left = this.currentIndex * 25;

        return {
          left: `${left}%`,
        };
      },
      pickerTitle() {
        return this.pickerType === ARMOR_TYPE ? 'Armor' : 'Weapons';
      },
      includeInventory() {
        return this.activeSlot !== SLOT_INVENTORY_WEAPON;
      },
    },
    methods: {
      open(index) {
        this.transition = index > this.currentIndex
          ? 'paginate-right'
          : 'paginate-left';

        this.currentIndex = index;
      },
      openEquipmentPicker({ type, slot }) {
        if (validTypes.includes(type)) {
          this.activeSlot = slot;
          this.pickerType = type;
          this.$refs.equipmentPicker.open();
        } else {
          throw new Error('Invalid type passed to equipment picker');
        }
      },
      selectItem({ item, fromInventory }) {
        switch (this.activeSlot) {
          case SLOT_INVENTORY_WEAPON:
            this.$refs.sheetInventory.selectItem(item);
            break;
          case SLOT_PRIMARY_WEAPON:
            this.$refs.sheetWeapons.selectItem(item, SLOT_PRIMARY_WEAPON, fromInventory);
            break;
          case SLOT_SECONDARY_WEAPON:
            this.$refs.sheetWeapons.selectItem(item, SLOT_SECONDARY_WEAPON, fromInventory);
            break;
          case SLOT_ARMOR:
            this.$refs.sheetArmor.selectItem(item);
            break;
        }

        this.activeSlot = null;
        this.$refs.equipmentPicker.close();
      },
      removeEquippedItem(slot) {
        let itemRemoved = false;

        switch (slot) {
          case SLOT_INVENTORY_WEAPON:
            this.character.inventory.weapon = newWeapon();
            itemRemoved = true;
            break;
          case SLOT_PRIMARY_WEAPON:
            this.character.equipment.primaryWeapon = newWeapon();
            itemRemoved = true;
            break;
          case SLOT_SECONDARY_WEAPON:
            this.character.equipment.secondaryWeapon = newWeapon();
            itemRemoved = true;
            break;
          case SLOT_ARMOR:
            this.character.equipment.armor = newArmor();
            itemRemoved = true;
            break;
        }

        if (itemRemoved) {
          this.charactersStore.saveCharacter(this.character);
          this.$refs.equipmentPicker.close();
        }
      },
    },
  };
</script>

<style lang="scss">
  .nav-indicator {
    transform: translateY(1px);
  }
</style>
