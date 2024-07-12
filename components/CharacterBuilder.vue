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
            BuilderStep4(v-else-if="currentPage === 3" @next="nextPage")
            BuilderStep5(v-else-if="currentPage === 4" @next="nextPage")
            BuilderStep6(v-else-if="currentPage === 5" @next="nextPage")
            BuilderStep7(v-else-if="currentPage === 6" @next="nextPage")
            BuilderStep8(v-else-if="currentPage === 7" @next="createCharacter")
</template>

<script>
  import { mapState } from 'pinia';

  import { calculateModifiers, getFeaturesByAttribute } from '~/helpers/character';

  export default {
    name: 'CharacterBuilder',
    data() {
      return {
        saveLoaded: false,
        transition: 'paginate-left',
      };
    },
    computed: {
      ...mapState(useBuilderStore, ['currentPage', 'character']),
    },
    setup() {
      const builderStore = useBuilderStore();
      const charactersStore = useCharactersStore();

      return { builderStore, charactersStore };
    },
    mounted() {
      if (!this.$route.query.new) {
        this.builderStore.loadSavedCharacter();
      } else {
        this.builderStore.currentPage = 0;
        this.builderStore.savePage();
        this.$router.replace({'query': null});
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
      async createCharacter() {
        const modifiers = getFeaturesByAttribute(this.character, 'goldHandful');
        const bonusGold = calculateModifiers(modifiers, 'goldHandful');
        const currentGold =  this.character.inventory.gold.handful;

        this.builderStore.updateCharacter({
          inventory: {
            gold: {
              handful: currentGold + bonusGold,
            }
          }
        });

        const id = await this.charactersStore.createCharacter(this.character);

        if (id) {
          this.$router.push({ path: `/character/${id}` });
          this.builderStore.newCharacter();
        }
      },
    },
  };
</script>
