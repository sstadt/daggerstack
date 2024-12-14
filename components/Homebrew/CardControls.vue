<template lang="pug">
  .rounded.relative.transition-all.overflow-hidden(
    class="hover:shadow focus:shadow"
    @click="toggleControls"
  )
    slot
    transition(name="slide-fade-top")
      NuxtIcon.absolute.top-0.right-14.text-red-900.text-xl(
        v-if="bookmarks.includes(homebrewId)"
        name="bookmark"
      )
    BasicButton.rounded-tl.absolute.bottom-0.right-0.transition-all(
      size="sm"
      :priority="bookmarks.includes(homebrewId) ? 'danger' : 'primary'"
      rounded="none"
      :style="buttonStyle"
      :disabled="userStore.pendingSave.includes(homebrewId)"
      @click.stop="toggleBookmark(homebrewId)"
    )
      span(v-if="bookmarks.includes(homebrewId)")
        NuxtIcon.mr-1(name="times")
        | Remove
      span(v-else)
        NuxtIcon.mr-1(name="plus")
        | Add
</template>

<script>
  export default {
    name: 'HomebrewCardControls',
  };
</script>

<script setup>
  import { useMq } from "vue3-mq";

  const mq = useMq();
  const userStore = useUserStore();

  const emit = defineEmits(['add-bookmark', 'remove-bookmark']);

  const controlsVisible = ref(false);

  const CONTROLS_TIMEOUT = 8000;
  let controlsTimer = null;

  const props = defineProps({
    homebrewId: {
      type: [String, Number],
      required: true,
    },
    bookmarks: {
      type: Array,
      default: () => [],
    },
  });

  const buttonStyle = computed(() => {
    return {
      transform: controlsVisible.value ? 'translateY(0)' : 'translateY(100%)',
    };
  });

  const toggleBookmark = () => {
    controlsVisible.value = false;

    if (props.bookmarks.includes(props.homebrewId)) {
      emit('remove-bookmark');
    } else {
      emit('add-bookmark');
    }
  };

  const toggleControls = () => {
    if (controlsVisible.value === false) {
      controlsVisible.value = true;
      controlsTimer = setTimeout(() => {
        controlsVisible.value = false;
      }, CONTROLS_TIMEOUT);
    } else {
      clearTimeout(controlsTimer);
      controlsVisible.value = false;
    }
  };
</script>
