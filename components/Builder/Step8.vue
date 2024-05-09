<template lang="pug">
  .container.p-8
    .space-y-8
      h2.text-center.text-2xl.font-black.uppercase Connections
      .space-y-2(v-for="(question, index) in connectionQuestions")
        h3.text-sm.font-bold(@click="editQuestion(index)")
          | {{ question.question }}
          NuxtIcon.ml-1.align-middle(name="edit")
        InputTextarea(v-model="question.answer" :limit="2000")
      .flex.justify-between.items-center
        NuxtLink(to="/") Finish Later
        BasicButton.block(@click="next" :disabled="completedQuestions.length < 1") Finish
    DialogPrompt(ref="prompt" @confirm="saveQuestion")
</template>

<script>
  import classes from '~/data/classes';

  import { useBuilderStore } from '~/stores/builder';

  export default {
    name: 'BuilderStep8',
    data() {
      const connectionQuestions = [];

      this.builderStore.character.connection.forEach(({ question, answer }) => {
        connectionQuestions.push({
          question,
          answer,
        });
      });

      return {
        classes,
        editingQuestion: null,
        connectionQuestions,
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
        const questionAnswered = this.connectionQuestions.reduce((answered, question) => {
          return question.answer !== '' ? true : answered;
        }, false);

        return this.connectionQuestions.length === 0 ? false : questionAnswered;
      },
      completedQuestions() {
        return this.connectionQuestions.filter((question) => question.answer !== '');
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
          question: 'Edit connection question',
          answer: this.connectionQuestions[index].question,
        });
      },
      saveQuestion(question) {
        this.connectionQuestions[this.editingQuestion].question = question;
      },
      updateQuestions(newClass) {
        this.connectionQuestions = [];

        this.classes[newClass].connectionQuestions
          .forEach((question) => {
            this.connectionQuestions.push({
              question,
              answer: '',
            });
          });
      },
      next() {
        this.builderStore.updateCharacter({
          connection: [ ...this.completedQuestions ],
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
