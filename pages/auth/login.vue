<template lang="pug">
  .flex.items-center.justify-center.py-20(class="md:px-8")
    .login.w-full.max-w-md
      BasicCard(:title="title" :expand="mq.mdPlus")
        form.space-y-6.mt-6(@submit.prevent="login")
          InputText(type="email" label="email" required)
          .space-y-1
            InputText(type="password" label="password" required)
            //- NuxtLink.inline-block(to="/auth/reset-password") Forgot Password
          .flex.justify-end.items-center.space-x-4
            NuxtLink(to="/auth/signup")
              BasicButton(priority="secondary") Sign Up
            BasicButton(type="submit") Log In
</template>

<script>
  export default {
    name: 'LoginPage',
    inject: ['mq'],
    computed: {
      title() {
        return 'login';
      },
    },
  };
</script>
