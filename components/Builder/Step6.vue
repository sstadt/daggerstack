<template lang="pug">
  .container.p-8
    .space-y-8
      h2.text-center.text-2xl.font-black.uppercase Background
      .space-y-2(v-for="(question, index) in backgroundQuestions")
        h3.text-sm.font-bold(@click="editQuestion(index)")
          | {{ question.question }}
          NuxtIcon.ml-1.align-middle(name="edit")
        InputTextarea(v-model="question.answer")
      BasicButton.block.ml-auto(@click="$emit('next')") Next
    BasicPrompt(ref="prompt" @confirm="saveQuestion")
</template>

<script>
  import classes from '~/data/classes';

  const CLASS = 'guardian';

  export default {
    name: 'BuilderStep6',
    data() {
      return {
        classes,
        editingQuestion: null,
        backgroundQuestions: [],
      };
    },
    mounted() {
      this.classes[CLASS]?.backgroundQuestions.forEach((question) => {
        this.backgroundQuestions.push({
          question,
          answer: '',
        });
      });
    },
    methods: {
      editQuestion(index) {
        this.editingQuestion = index;
        this.$refs.prompt.ask({
          question: 'Edit background question',
          answer: this.backgroundQuestions[index].question,
        });
      },
      saveQuestion(question) {
        this.backgroundQuestions[this.editingQuestion].question = question;
      },
    },
  };
</script>
