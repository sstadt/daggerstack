<template lang="pug">
  transition(name="fade")
    .flex.fixed.top-0.left-0.w-full.h-full.max-h-full.z-40.m-0.p-8(v-if="isOpen")
      .absolute.top-0.left-0.w-full.h-full(class="bg-black/25")
      transition(name="slide-fade-top" appear)
        form.p-8.bg-white.space-y-4.w-full.mb-auto.relative(
          v-if="isOpen"
          class="max-2-10/12"
          @submit.prevent="confirm"
        )
          h2.font-bold {{ question }}
          .flex.justify-end.space-x-2
            BasicButton(size="sm" priority="secondary" @click="cancel") cancel
            BasicButton(size="sm" type="submit") confirm
</template>

<script>
  export default {
    name: 'DialogConfirm',
  };
</script>

<script setup>
  const question = ref('');
  const isOpen = ref(false);

  const emit = defineEmits(['cancel', 'confirm']);

  const cancel = () => {
    emit('cancel');
    isOpen.value = false;
  };

  const confirm = () => {
    emit('confirm');
    isOpen.value = false;
  };

  const ask = (q) => {
    question.value = q;
    isOpen.value = true;
  };

  defineExpose({ ask });
</script>
