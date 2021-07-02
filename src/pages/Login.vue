<template>
  <div class="dms-login-bg">
    <div
      class="q-py-xl q-px-lg absolute-center rounded-borders dms-hover-rising dms-transition dms-background-blur"
    >
      <div class="text-h5 q-mb-xl text-center non-selectable">资料管理系统</div>

      <!-- 登录框 -->
      <q-form @submit="onSubmit" class="q-gutter-y-md q-mx-auto">
        <q-input
          dense
          filled
          v-model="loginInfo.username"
          lazy-rules
          clearable
          maxlength="20"
          :rules="[val => (val && val.length > 0) || '请输入用户名']"
          @blur="BlurUsername"
        >
          <template v-slot:prepend>
            <q-avatar>
              <img src="@/assets/images/icon/login/login-user.png" />
            </q-avatar>
          </template>
        </q-input>

        <q-input
          dense
          filled
          type="password"
          v-model="loginInfo.password"
          lazy-rules
          clearable
          autocomplete="off"
          maxlength="30"
          :rules="[val => (val && val.length > 0) || '请输入密码']"
        >
          <template v-slot:prepend>
            <q-avatar>
              <img src="@/assets/images/icon/login/login-passwd.png" />
            </q-avatar>
          </template>
        </q-input>

        <div>
          <q-btn
            class="full-width"
            type="submit"
            color="primary"
            label="登录"
          />

          <q-btn
            class="full-width q-mt-md"
            flat
            @click="$pw.extManager.login()"
          >
            通过认证中心登录
          </q-btn>
        </div>

        <div>
          测试账号：user1，密码：qaz123
        </div>
      </q-form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "DmsLogin",

  async created() {
    if (this.$q.localStorage.has(this.$v.keys.username)) {
      const username =
        this.$q.localStorage.getItem<string>(this.$v.keys.username) ?? "";
      this.loginInfo.username = username;
    }
  },

  data() {
    return {
      loginInfo: {
        username: "",
        password: ""
      }
    };
  },

  computed: {},

  watch: {},

  methods: {
    async onSubmit() {
      if (!this.loginInfo.username || !this.loginInfo.password) return;
      this.loginInfo.password = this.$u.encrypt(this.loginInfo.password);
      this.$store.dispatch("Login", this.loginInfo);
    },

    async BlurUsername() {
      this.loginInfo.username = this.loginInfo.username?.replace(/\s*/g, "");
    }
  },

  components: {}
});
</script>

<style lang="stylus" scoped>
.dms-login-bg
  background url(../assets/images/login-bg.jpeg) no-repeat center
  width 100vw
  height 100vh
</style>
