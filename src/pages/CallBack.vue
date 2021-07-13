<template>
  <div>
    callback

    <q-btn @click="BackHandler">返回</q-btn>
  </div>
</template>

<script>
export default {
  name: "DmsCallBack",

  mounted() {
    this.$pw.extManager
      .signinRedirectCallback()
      .then(async result => {
        console.log(result);
        this.$store.dispatch("SetToken", result.access_token);

        // 获得外部用户信息，然后根据信息到本地服务器进行信息请求即可
        const info = {
          username: result.profile.preferred_username,
          nickname: result.profile.name
        };
        const [e, r] = await this.$s.ExtLogin(info);
        if (r) {
          console.log("ext-login", r);

          const loginInfo = Object.assign(r.data, {
            token: result.access_token
          });
          this.$store.dispatch("SetLoginInfo", loginInfo);

          // window.history.replaceState(
          //   {},
          //   window.document.title,
          //   window.location.origin + window.location.pathname
          // );

          // window.location = "/";
        } else {
          console.log(e);
        }
      })
      .catch(err => {
        console.log("err:", err);
      });
  },

  methods: {
    BackHandler() {
      window.history.replaceState(
        {},
        window.document.title,
        window.location.origin + window.location.pathname
      );

      window.location = "/";
    }
  }
};
</script>

<style lang="stylus" scoped></style>
