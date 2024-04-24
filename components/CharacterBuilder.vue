<template lang="pug">
  transition(name="fade")
    .character-builder(v-if="saveLoaded")
      h2.text-center.text-2xl.font-black.uppercase.p-4 Create Character
      .flex.flex-col.flex-grow
        BuilderProgress(:page="currentPage" :steps="8" @set="setPage")
        .flex.flex-grow
          transition(:name="transition" mode="out-in")
              BuilderStep1(v-if="currentPage === 0" @next="nextPage")
              BuilderStep2(v-else-if="currentPage === 1" @next="nextPage")
              BuilderStep3(v-else-if="currentPage === 2" @next="nextPage")
              BuilderStep4(
                v-else-if="currentPage === 3"
                ref="equipmentStep"
                @pick-equipment="openEquipmentPicker"
                @next="nextPage"
              )
              BuilderStep5(v-else-if="currentPage === 4" @next="nextPage")
              BuilderStep6(v-else-if="currentPage === 5" @next="nextPage")
              BuilderStep7(v-else-if="currentPage === 6" @next="nextPage")
              BuilderStep8(v-else-if="currentPage === 7" @next="createCharacter")
      BasicDrawer(ref="equipmentPicker" :title="pickerTitle")
        InventoryPicker(:type="pickerType" @select="selectItem")
</template>

<script>
  import { mapState } from 'pinia';
  import { useBuilderStore } from '~/stores/builder';

  import {
    PRIMARY_WEAPON_TYPE,
    SECONDARY_WEAPON_TYPE,
    ARMOR_TYPE,
  } from '~/config/equipmentPicker';

  const validTypes = [
    PRIMARY_WEAPON_TYPE,
    SECONDARY_WEAPON_TYPE,
    ARMOR_TYPE,
  ];

  export default {
    name: 'CharacterBuilder',
    data() {
      return {
        saveLoaded: false,
        pickerType: PRIMARY_WEAPON_TYPE,
        transition: 'paginate-left',
      };
    },
    computed: {
      ...mapState(useBuilderStore, ['currentPage', 'character']),
      pickerTitle() {
        return this.pickerType === ARMOR_TYPE ? 'Armor' : 'Weapons';
      },
    },
    setup() {
      const builderStore = useBuilderStore();

      return { builderStore };
    },
    mounted() {
      if (!this.$route.query.new) {
        this.builderStore.loadSavedCharacter();
      } else {
        this.builderStore.currentPage = 0;
        this.builderStore.savePage();
      }

      this.saveLoaded = true;
    },
    methods: {
      nextPage() {
        this.setPage(this.currentPage + 1);
      },
      setPage(page) {
        this.transition = page > this.currentPage
          ? 'paginate-right'
          : 'paginate-left';

        this.builderStore.currentPage = page;
        this.builderStore.savePage();
      },
      openEquipmentPicker(type) {
        if (validTypes.includes(type)) {
          this.pickerType = type;
          this.$refs.equipmentPicker.open();
        } else {
          throw new Error('Invalid type passed to equipment picker');
        }
      },
      selectItem(item) {
        this.$refs.equipmentPicker.close();
        this.$refs.equipmentStep.selectItem(item);
      },
      createCharacter() {
        const characterId = this.character.id;

        this.builderStore.createCharacter();
        this.$router.push({ path: `/character/${characterId}` });
      },
    },
  };
</script>

<style lang="scss">
  .builder__slider {
    display: flex;
  }
</style>
