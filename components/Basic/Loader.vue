<template lang="pug">
  .loader
</template>

<script>
  export default {
    name: 'BasicLoader',
  };
</script>

<style lang="scss" scoped>
  .loader {
    --loaderballcolor: rgb(91, 33, 182);
    --loadershadow: 0px 0 #ffffff00;
    --loadershadowcolor: #ffffff00;
    width: 10px;
    height: 10px;
    left: -120px;
    border-radius: 50%;
    position: relative;
    color: var(--loaderballcolor);
    animation: shadowRolling 2s linear infinite;
  }

  @keyframes shadowRolling {
    0% {
      box-shadow: var(--loadershadow),
        var(--loadershadow),
        var(--loadershadow),
        var(--loadershadow);
    }

    12% {
      box-shadow: 100px 0 var(--loaderballcolor),
        var(--loadershadow),
        var(--loadershadow),
        var(--loadershadow);
    }

    25% {
      box-shadow: 110px 0 var(--loaderballcolor),
        100px 0 var(--loaderballcolor),
        var(--loadershadow),
        var(--loadershadow);
    }

    36% {
      box-shadow: 120px 0 var(--loaderballcolor),
        110px 0 var(--loaderballcolor),
        100px 0 var(--loaderballcolor),
        var(--loadershadow);
    }

    50% {
      box-shadow: 130px 0 var(--loaderballcolor),
        120px 0 var(--loaderballcolor),
        110px 0 var(--loaderballcolor),
        100px 0 var(--loaderballcolor);
    }

    62% {
      box-shadow: 200px 0 var(--loadershadowcolor),
        130px 0 var(--loaderballcolor),
        120px 0 var(--loaderballcolor),
        110px 0 var(--loaderballcolor);
    }

    75% {
      box-shadow: 200px 0 var(--loadershadowcolor),
        200px 0 var(--loadershadowcolor),
        130px 0 var(--loaderballcolor),
        120px 0 var(--loaderballcolor);
    }

    87% {
      box-shadow: 200px 0 var(--loadershadowcolor),
        200px 0 var(--loadershadowcolor),
        200px 0 var(--loadershadowcolor),
        130px 0 var(--loaderballcolor);
    }

    100% {
      box-shadow: 200px 0 var(--loadershadowcolor),
        200px 0 var(--loadershadowcolor),
        200px 0 var(--loadershadowcolor),
        200px 0 var(--loadershadowcolor);
    }
  }
</style>
