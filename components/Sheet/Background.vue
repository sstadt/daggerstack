<template lang="pug">
  BasicCard(title="Background Questions")
    p.font-bold.mt-4 Who from your community did you fail to protect, and why do you still think of them?
    InputTextarea
    p.font-bold.mt-4 You've recently been tasked with protecting something important, with the goal of delivering it somewhere dangerous. What is it and where does it need to go?
    InputTextarea
    p.font-bold.mt-4 You've always felt uncomfortable in your skin. What are you self-conscious of?
    InputTextarea
</template>

<script>
  export default {
    name: 'SheetBackground',
  };
</script>
