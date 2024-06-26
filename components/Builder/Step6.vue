<template lang="pug">
  .container.p-8
    form(@submit.prevent="next").space-y-8
      h2.text-center.text-2xl.font-black.uppercase Background
      .space-y-2(v-for="(question, index) in backgroundQuestions")
        h3.text-sm.font-bold(@click="editQuestion(index)")
          | {{ question.question }}
          NuxtIcon.ml-1.align-middle(name="edit")
        InputTextarea(v-model="question.answer" :limit="2000")
      .flex.justify-between.items-center
        NuxtLink(to="/") Finish Later
        BasicButton.block(type="submit" :disabled="completedQuestions.length < 1") Next
    DialogPrompt(ref="prompt" @confirm="saveQuestion")
</template>

<script>
  import classes from '~/data/classes';

  import { useBuilderStore } from '~/stores/builder';

  export default {
    name: 'BuilderStep6',
    data() {
      const backgroundQuestions = []

      this.builderStore.character.background.forEach(({ question, answer }) => {
        backgroundQuestions.push({
          question,
          answer,
        });
      });

      return {
        classes,
        editingQuestion: null,
        backgroundQuestions,
      };
    },
    setup() {
      const builderStore = useBuilderStore();

      return { builderStore };
    },
    computed: {
      baseClass() {
        return this.builderStore.baseClass;
      },
      answersProvided() {
        const questionAnswered = this.backgroundQuestions.reduce((answered, question) => {
          return question.answer !== '' ? true : answered;
        }, false);

        return this.backgroundQuestions.length === 0 ? false : questionAnswered;
      },
      completedQuestions() {
        return this.backgroundQuestions.filter((question) => question.answer !== '');
      },
    },
    mounted() {
      const newClass = this.baseClass || 'bard';
      if (!this.answersProvided) this.updateQuestions(newClass);
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
      updateQuestions(newClass) {
        this.backgroundQuestions = [];

        this.classes[newClass].backgroundQuestions
          .forEach((question) => {
            this.backgroundQuestions.push({
              question,
              answer: '',
            });
          });
      },
      async next() {
        this.builderStore.updateCharacter({
          background: [ ...this.completedQuestions ],
        });

        this.$emit('next');
      },
    },
    watch: {
      baseClass(newClass, oldClass) {
        if (newClass !== oldClass && !this.answersProvided) {
          this.updateQuestions(newClass);
        }
      },
    },
  };
</script>
