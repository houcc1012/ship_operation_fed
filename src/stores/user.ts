import { defineStore } from "pinia";
import Cookies from "js-cookie";
import { getUserInfo } from "@/api/userApi";

export const useUserStore = defineStore("user", {
  state: () => ({
    isLoggedIn: true,
    userName: "",
    phone: "",
    avatar: "",
    displayName: "",
    userInfo: {},
    cookie: "",
    // 0-普通用户 1-管理员
    roleType: 1,
    accountType: 1,
    editionExpiredDate: "",
    showAppMngMenu: false,//是否展示给用户应用管理的菜单
  }),
  persist: true, // 添加 persist 属性
  actions: {
    async checkLoginStatus() {
      // 移除console.log("checkLoginStatus", this.isLoggedIn);
    },
    async refreshUserInfo() {
      const data = await getUserInfo();
      this.processUserInfo(data);
    },
    processUserInfo(data: any) {
        this.userInfo = data || {};
        this.isLoggedIn = true;
        this.userName = data.userName; // 假设返回的数据中有 username 字段
        this.displayName = this.userName;
        this.roleType = data.roleType;
        this.phone = data.phone;
        this.avatar = data.avatar;
        this.accountType = data.accountType;
        this.editionExpiredDate = data.editionExpiredDate;
        this.showAppMngMenu = data.showAppMngMenu;
        //displayName过长时截取前10位
        if (this.displayName && this.displayName.length > 8) {
          this.displayName = this.displayName.substring(0, 5) + "...";
        }
    },
    logout() {
      this.isLoggedIn = false;
      this.userName = "";
      this.displayName = "";
      this.userInfo = null;
      this.roleType = 0;
      this.accountType = 1;
      Cookies.remove("vps_token");
    },
  },
});
