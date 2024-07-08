<template lang="pug">
  .flex.items-center.justify-center.py-20(class="md:px-8")
    .login.w-full.max-w-md
      BasicCard(:title="title" :expand="mq.mdPlus")
        form.space-y-6.mt-6(@submit.prevent="login" novalidate)
          InputText(
            type="email"
            label="email"
            v-model="email"
            :errors="v$.email ? v$.email.$errors : []"
            required
          )
          .space-y-1
            InputText(
              type="password"
              label="password"
              v-model="password"
              :errors="v$.email ? v$.password.$errors : []"
              required
            )
            //- NuxtLink.inline-block(to="/auth/reset-password") Forgot Password
          .flex.justify-end.items-center.space-x-4
            NuxtLink(to="/signup")
              BasicButton(priority="secondary") Sign Up
            BasicButton(type="submit") Log In
</template>

<script>
  import { useVuelidate } from '@vuelidate/core';
  import { required, email } from '@vuelidate/validators';

  export default {
    name: 'LoginPage',
    inject: ['mq'],
    data() {
      return {
        email: '',
        password: '',
      };
    },
    validations() {
      return {
        email: { required, email },
        password: { required },
      };
    },
    setup() {
      return { v$: useVuelidate() };
    },
    computed: {
      title() {
        return 'login';
      },
    },
    methods: {
      async login() {
        const formValid = await this.v$.$validate();

        if (formValid) {
          console.log('>>> log in', this.email, this.password);
        }
      },
    },
  };
</script>
