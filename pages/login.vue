<template lang="pug">
  div
    Head
      Title Daggerstack.com - Log In
    .flex.items-center.justify-center.py-20(class="md:px-8")
      .login.w-full.max-w-md
        BasicCard(title="log in")
          form.space-y-6.mt-6(@submit.prevent="login" novalidate)
            Transition(name="slide-fade-left")
              BasicAlert(v-if="responseError" :message="responseError" type="error")
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
              //- NuxtLink.inline-block(to="/reset-password") Forgot Password
            .flex.justify-end.items-center.space-x-4
              NuxtLink(to="/signup")
                BasicButton(priority="secondary") Sign Up
              BasicButton(type="submit") Log In
            BasicLoader.mx-auto(v-if="waiting")
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
        waiting: false,
        responseError: null,
      };
    },
    validations() {
      return {
        email: { required, email },
        password: { required },
      };
    },
    setup() {
      const userStore = useUserStore();

      return {
        userStore,
        v$: useVuelidate(),
      };
    },
    methods: {
      async login() {
        const formValid = await this.v$.$validate();

        if (formValid) {
          const { data, error } = await this.userStore.supabase.auth.signInWithPassword({
            email: this.email,
            password: this.password,
          });

          this.responseError = error ? error.message : null;

          if (!error && data.user) {
            await this.userStore.loggedIn();
            this.$router.push('/character');
          }

          this.waiting = false;
        }
      },
    },
  };
</script>
