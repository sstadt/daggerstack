<template lang="pug">
  div
    Head
      Title Daggerstack.com - Forgot Password
    .flex.items-center.justify-center.py-20(class="md:px-8")
      .w-full.max-w-md
        BasicCard(title="Forgot Password")
          form.space-y-6.mt-6(v-if="!success" @submit.prevent="requestReset" novalidate)
            Transition(name="slide-fade-left")
              BasicAlert(v-if="responseError" :message="responseError" type="error")
            InputText(
              type="email"
              label="email"
              v-model="email"
              :errors="v$.email ? v$.email.$errors : []"
              required
            )
            .flex.justify-end.items-center.space-x-4
              NuxtLink(to="/auth/login")
                BasicButton(priority="secondary") Log In
              BasicButton(type="submit" :disabled="waiting") Request Reset
            BasicLoader.mx-auto(v-if="waiting")
          .mt-6.space-y-6(v-else)
            BasicAlert.mt-6(
              type="success"
              :message="`Success!!\n\nIf you there is an account with the email address ${this.email}, you should receive a link to reset your password shortly.`"
            )
            .flex.justify-end.space-x-4
              NuxtLink(to="/auth/login")
                BasicButton(priority="secondary") Log In
              NuxtLink(to="/auth/signup")
                BasicButton(priority="secondary") Sign Up
</template>

<script>
  import { useVuelidate } from '@vuelidate/core';
  import { required, email } from '@vuelidate/validators';

  export default {
    name: 'ResetPasswordPage',
    data() {
      return {
        email: '',
        waiting: false,
        responseError: null,
        success: false,
      };
    },
    validations() {
      return {
        email: { required, email },
      };
    },
    setup() {
      const userStore = useUserStore();

      return {
        userStore,
        v$: useVuelidate(),
      };
    },
    computed: {
      location() {
        return { ...window.location };
      },
    },
    methods: {
      async requestReset() {
        const formValid = await this.v$.$validate();

        if (formValid) {
          const { error } = await this.userStore.supabase.auth.resetPasswordForEmail(this.email, {
            redirectTo: `${window.location.origin}/auth/update-password`,
          });

          this.responseError = error ? error.message : null;
          if (!error) this.success = true;
          this.waiting = false;
        }
      },
    },
  };
</script>
