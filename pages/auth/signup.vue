<template lang="pug">
  .flex.items-center.justify-center.py-20(class="md:px-8")
    .login.w-full.max-w-md
      BasicCard(:title="title" :expand="mq.mdPlus")
        form.space-y-6.mt-6(@submit.prevent="signup")
          InputText(type="email" label="email" v-model="email" required)
          .space-y-2
            InputText(type="password" label="password" v-model="password" required)
            AuthPasswordStrength(:password="password")
          InputText(type="password" label="confirm password" v-model="confirmPassword" required)
          .flex.justify-end.items-center.space-x-4
            NuxtLink(to="/auth/login")
              BasicButton(priority="secondary") Log In
            BasicButton(type="submit") Sign Up
</template>

<script>
  export default {
    name: 'SignupPage',
    inject: ['mq'],
    data() {
      return {
        email: '',
        password: '',
        confirmPassword: '',
      };
    },
    computed: {
      title() {
        return 'sign up';
      },
    },
  };
</script>
