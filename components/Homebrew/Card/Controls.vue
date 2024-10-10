<template lang="pug">
  .rounded.relative.transition-all.overflow-hidden.group(class="hover:shadow focus:shadow")
    slot
    transition(name="slide-fade-top")
      NuxtIcon.absolute.top-0.right-14.text-red-900.text-xl(
        v-if="bookmarks.includes(homebrewId)"
        name="bookmark"
      )
    BasicButton.rounded-tl.absolute.bottom-0.right-0.translate-y-full.transition-all(
      size="xs"
      :priority="bookmarks.includes(homebrewId) ? 'danger' : 'primary'"
      rounded="none"
      class="group-hover:translate-y-0 group-focus:translate-y-0 focus:translate-y-0"
      :disabled="userStore.pendingSave.includes(homebrewId)"
      @click="toggleBookmark(homebrewId)"
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
  const userStore = useUserStore();

  const emit = defineEmits(['add-bookmark', 'remove-bookmark']);

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

  const toggleBookmark = () => {
    if (props.bookmarks.includes(props.homebrewId)) {
      emit('remove-bookmark');
    } else {
      emit('add-bookmark');
    }
  };
</script>
