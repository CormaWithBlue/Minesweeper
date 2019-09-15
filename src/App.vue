<template>
  <div id="app">
    <img :src="picA" width="300px" height="235px" id="picNo" />
    <p align="left">1.判断出不是雷的方块上按下左键，可以打开该方块。</p>
    <p align="left">2.如果方块上出现数字，则该数字表示其周围3×3区域中的地雷数（一般为8个格子，对于边块为5个格子，对于角块为3个格子。所以扫雷中最大的数字为8）；</p>
    <p align="left">3.如果方块上为空（相当于0），则可以递归地打开与空相邻的方块；如果不幸触雷，则游戏结束。</p>
    <p align="left">4.在判断为地雷的方块上按下右键，可以标记地雷（显示为小红旗），重复一次或两次操作可取消标记。</p>

    <router-view />
  </div>
</template>

<script>
import Vue from "Vue";
import pic1 from "./assets/1.jpg";
import pic2 from "./assets/2.jpg";
import pic3 from "./assets/3.jpg";
import pic4 from "./assets/4.jpg";
import pic5 from "./assets/5.jpg";
import pic6 from "./assets/6.jpg";
import pic7 from "./assets/7.jpg";
import pic8 from "./assets/8.jpg";
import pic9 from "./assets/9.jpg";
import pic10 from "./assets/10.jpg";
import pic11 from "./assets/11.jpg";
import pic12 from "./assets/12.jpg";
import pic13 from "./assets/13.jpg";
import pic14 from "./assets/14.jpg";
import pic15 from "./assets/15.jpg";
import pic16 from "./assets/16.jpg";
import pic17 from "./assets/17.jpg";
import pic18 from "./assets/18.jpg";
export default {
  name: "App",
  data() {
    return {
      picA: pic1,
      picNo: 1,
      pic1,
      pic2,
      pic3,
      pic4,
      pic5,
      pic6,
      pic7,
      pic8,
      pic9,
      pic10,
      pic11,
      pic12,
      pic13,
      pic14,
      pic15,
      pic16,
      pic17,
      pic18
    };
  },
  mounted() {
    this.changePic();
  },
  methods: {
    changePic: function() {
      var self = this;
      setInterval(function() {
        if (self.picNo < 18) {
          self.picNo++;
        } else {
          self.picNo = 1;
        }
        self.picA = self["pic" + self.picNo];
      }, 150);
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
