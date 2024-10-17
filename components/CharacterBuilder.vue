<template lang="pug">
  transition(name="fade")
    .character-builder(v-if="saveLoaded")
      h2.text-center.text-2xl.font-black.uppercase.p-4 Create Character
      .flex.flex-col.flex-grow
        BuilderProgress(:page="builderStore.currentPage" :steps="8" @set="setPage")
        .flex.flex-grow
          transition(:name="transition" mode="out-in")
            BuilderStep1(v-if="builderStore.currentPage === 0" @next="nextPage")
            BuilderStep2(v-else-if="builderStore.currentPage === 1" @next="nextPage")
            BuilderStep3(v-else-if="builderStore.currentPage === 2" @next="nextPage")
            BuilderStep4(v-else-if="builderStore.currentPage === 3" @next="nextPage")
            BuilderStep5(v-else-if="builderStore.currentPage === 4" @next="nextPage")
            BuilderStep6(v-else-if="builderStore.currentPage === 5" @next="nextPage")
            BuilderStep7(v-else-if="builderStore.currentPage === 6" @next="nextPage")
            BuilderStep8(v-else-if="builderStore.currentPage === 7" @next="createCharacter")
</template>

<script>
  export default {
    name: 'CharacterBuilder',
  };
</script>

<script setup>
  const router = useRouter();
  const route = useRoute();
  const builderStore = useBuilderStore();
  const charactersStore = useCharactersStore();
  const userStore = useUserStore();
  const { getFeaturesByAttribute, calculateModifiers } = useSheetBonuses();

  const saveLoaded = ref(false);
  const transition = ref('paginate-left');

  onMounted(() => {
    if (!userStore.user) {
      router.push('/');
    }

    if (!route.query.new) {
      builderStore.loadSavedCharacter();
    } else {
      builderStore.currentPage = 0;
      builderStore.savePage();
      router.replace({'query': null});
    }

    saveLoaded.value = true;
  });

  const nextPage = () => {
    setPage(builderStore.currentPage + 1);
  };

  const setPage = (page) => {
    transition.value = page > builderStore.currentPage
      ? 'paginate-right'
      : 'paginate-left';

    builderStore.currentPage = page;
    builderStore.savePage();
  };

  const createCharacter = async () => {
    const modifiers = getFeaturesByAttribute(builderStore.character, 'goldHandful');
    const bonusGold = calculateModifiers(modifiers, 'goldHandful');
    const currentGold = builderStore.character.inventory.gold;

    builderStore.updateCharacter({
      inventory: {
        gold: currentGold + bonusGold,
      },
    });

    const id = await charactersStore.createCharacter(builderStore.character);

    if (id) {
      router.push({ path: `/character/${id}` });
      builderStore.newCharacter();
    }
  };
</script>
