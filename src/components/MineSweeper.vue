<template>
  <!-- 最外层，包括难度选项、关闭、重启、倒计时 -->
  <div id="wholePage" :class="{wholePageEasy:isEasy,wholePageMedium:isMedium,wholePageHard:isHard}">
    <!-- 操作按钮区域 -->
    <div
      id="optionOfDegree"
      :class="{optionOfDegreeEasy:isEasy,optionOfDegreeMedium:isMedium,optionOfDegreeHard:isHard}"
    >
      <select v-model="selects" id="select" @change="changeDiamond($event)">
        <option name="easy" value="easy" id="easy" selected="selected">Easy</option>
        <option name="medium" value="medium" id="medium">Medium</option>
        <option name="hard" value="hard" id="hard">Hard</option>
      </select>

      <button v-on:click="initGame()">start</button>

      <a>&nbsp;&nbsp;&nbsp;&nbsp;MineNum：{{remainMineNum-flagNum}}个</a>
      <a>
        &nbsp;&nbsp;&nbsp;&nbsp;Time:{{Math.floor(second/60) > 9 ? Math.floor(second/60) : '0'
        + (Math.floor(second/60))}}:{{second%60 > 9 ? second%60 : '0' + (second%60)}}
      </a>
    </div>
    <!-- 包含所有小方格的大格子 -->
    <div
      id="bigDiamond"
      :class="{bigDiamondEasy:isEasy,bigDiamondMedium:isMedium,bigDiamondHard:isHard}"
    >
      <!-- 将statusNow的内容画在界面上  两个v-for  -->
      <!-- 遍历16行，并通过i记录遍历到了第几个 -->
      <div
        v-for="(mineSweeperWidthItem,i) in statusNow"
        id="columnOfDiamond"
        :class="{columnOfDiamondEasy:isEasy,columnOfDiamondMedium:isMedium,columnOfDiamondHard:isHard}"
      >
        <!-- 遍历30列，并通过j记录遍历到了第几个 -->
        <button
          v-for="(mineSweeperHeightItem,j) in mineSweeperWidthItem"
          class="littleDiamond"
          v-bind:class="{littleDiamond_3:statusNow[i][j]==3,
          littleDiamond_mouseDown:4<=statusNow[i][j]&&statusNow[i][j]<=12,
          littleDiamond_mouseRight:13==statusNow[i][j]||14==statusNow[i][j],littleDiamond_15:statusNow[i][j]==15,littleDiamond_16:statusNow[i][j]==16}"
          v-on:mousedown="clickBoom($event,i,j)"
        >{{(statusNow[i][j] > 4 && statusNow[i][j]<13)? (statusNow[i][j]-4) : null}}</button>
      </div>
    </div>
  </div>
</template>



<script>
import Vue from "Vue";
// status = 0: 未知但正在揭开
// status = 1: 未知但是没有雷
// status = 2: 未知但是有雷

// status = 3: 左键点击 & 击中雷
// status = 4: 左键点击 & 未击中雷 & 周围有0个雷
// status = 5: 左键点击 & 未击中雷 & 周围有1个雷
// status = 6: 左键点击 & 未击中雷 & 周围有2个雷
// status = 7: 左键点击 & 未击中雷 & 周围有3个雷
// status = 8: 左键点击 & 未击中雷 & 周围有4个雷
// status = 9: 左键点击 & 未击中雷 & 周围有5个雷
// status = 10: 左键点击 & 未击中雷 & 周围有6个雷
// status = 11: 左键点击 & 未击中雷 & 周围有7个雷
// status = 12: 左键点击 & 未击中雷 & 周围有8个雷

// status = 13: 没有雷，右键点击变成小红旗
// status = 14: 有雷，右键点击变成小红旗
// status = 15: 点中雷后，其他雷的样式
// status = 16: 点中雷后，右键已标记了小红旗的样式
export default {
  name: "MineSweeper",
  data() {
    return {
      statusNow: [],
      second: 0,
      inerval: null,
      selects: "easy",
      flagNum: 0,
      choice: 1,
      step:0
    };
  },
  created() {
    this.initGame();
  },
  computed: {
    isEasy: function() {
      return "easy" == this.selects;
    },
    isMedium: function() {
      return "medium" == this.selects;
    },
    isHard: function() {
      return "hard" == this.selects;
    },
    mineSweeperWidth: function() {
      if ("easy" == this.selects) {
        return 10;
      } else if ("medium" == this.selects) {
        return 12;
      } else if ("hard" == this.selects) {
        return 16;
      }
    },
    mineSweeperHeight: function() {
      if ("easy" == this.selects) {
        return 15;
      } else if ("medium" == this.selects) {
        return 20;
      } else if ("hard" == this.selects) {
        return 30;
      }
    },
    remainMineNum: function() {
      if ("easy" == this.selects) {
        return 10;
      } else if ("medium" == this.selects) {
        return 15;
      } else if ("hard" == this.selects) {
        return 24;
      }
    }
  },
  methods: {
    changeDiamond: function(e) {
      console.log(this.selects);
      this.initGame();
    },

    clickBoom(event, i, j) {
 
      // 判断点击了左键还是右键
      if (event.which === 1) {
        // alert("左键点了第" + (i + 1) + "行，第" + (j + 1) + "列");

        if (1 == this.statusNow[i][j]) {
          //判断周围8个小格子有没有雷
          this.statusNow[i][j] = this.eightDiamond(i, j);
          //this.step++
        } else if (2 == this.statusNow[i][j]) {
          this.statusNow[i][j] = 3;
          //this.step++
          //点中雷，游戏结束，把所有的雷都显示出来
          for (var i = 0; i < this.mineSweeperWidth; i++) {
            // this.statusNow[i] = [];
            for (var j = 0; j < this.mineSweeperHeight; j++) {
              if (this.statusNow[i][j] == 2) {
                this.statusNow[i][j] = 15;
              }
              if (this.statusNow[i][j] == 13) {
                this.statusNow[i][j] = 16;
              }
            }
          }
          setTimeout(() => {
            alert("Game Over! Try Again!");
            clearInterval(this.inerval);
            this.inerval = null;
            this.initGame();
            this.step++
          }, 100);
        }
        //this.step++
        Vue.set(this.statusNow, i, this.statusNow[i])
        //  else if (3 == this.statusNow[i][j]) {
        //   this.statusNow[i][j] = 2;
        //   //点中雷，游戏结束，把所有的雷都显示出来
        //   alert("你又点我了。我又变回去了");
        // }
      } else if (event.which === 3) {
        document.oncontextmenu = function() {
          return false;
        };
        // alert("右键点了第" + (i + 1) + "行，第" + (j + 1) + "列");

        if (1 == this.statusNow[i][j]) {
          this.statusNow[i][j] = 13;
          this.flagNum++;
        } else if (2 == this.statusNow[i][j]) {
          this.statusNow[i][j] = 14;
          this.flagNum++;
          var statusNowNum = 0;
          for (var i = 0; i < this.mineSweeperWidth; i++) {
            for (var j = 0; j < this.mineSweeperHeight; j++) {
              if (14 == this.statusNow[i][j]) {
                statusNowNum = statusNowNum + 1;
                if (statusNowNum == this.remainMineNum) {
                  alert("Congratulations！You win the game!");
                  clearInterval(this.inerval);
                  this.inerval = null;
                  this.initGame();
                }
              }
            }
          }
        } else if (13 == this.statusNow[i][j]) {
          this.statusNow[i][j] = 1;
          this.flagNum--;
        } else if (14 == this.statusNow[i][j]) {
          this.statusNow[i][j] = 2;
          this.flagNum--;  
        }
        //这种方式刷新过多造成cpu占用过高而卡顿
        //Vue.set(this.statusNow, i, this.statusNow[i]);
      } else {
        return;
      }

      //点击后修改model的值,onclick事件+子控件和父控件的交互
    },
    initGame: function() {
      console.log("init once");
      this.statusNow = [];
      for (var i = 0; i < this.mineSweeperWidth; i++) {
        this.statusNow[i] = [];
        for (var j = 0; j < this.mineSweeperHeight; j++) {
          this.statusNow[i][j] = 1;
        }
      }
      this.flagNum = 0;
      //this.statusNow[Math.floor(first / 30)][first % 30] = 2;

      var i = 0;
      while (true) {
        var first = Math.floor(
          Math.random() * (this.mineSweeperHeight * this.mineSweeperWidth)
        );
        if (
          this.statusNow[first % this.mineSweeperWidth][
            first % this.mineSweeperHeight
          ] != 2
        ) {
          this.statusNow[first % this.mineSweeperWidth][
            first % this.mineSweeperHeight
          ] = 2;
          if (++i >= this.remainMineNum) {
            break;
          }
        }
      }
      this.step ++
      this.second = 0;
      if (this.inerval == null) {
        this.inerval = setInterval(function() {
          this.second++;
          this.second = Math.round(this.second);
        }, 1000);
      }
    },

    //作用：判断元素周围有几个雷，0个雷时，将周围的方块都翻面，一直到周围有雷不能翻面
    //参数：i：行,j：列
    //返回值：通过返回的数值来代表当前元素的新状态
    // status = 0: 未知但正在揭开
    // status = 1: 未知但是没有雷
    // status = 2: 未知但是有雷

    // status = 3: 左键点击 & 击中雷
    // status = 4: 左键点击 & 未击中雷 & 周围有0个雷
    // status = 5: 左键点击 & 未击中雷 & 周围有1个雷
    // status = 6: 左键点击 & 未击中雷 & 周围有2个雷
    // status = 7: 左键点击 & 未击中雷 & 周围有3个雷
    // status = 8: 左键点击 & 未击中雷 & 周围有4个雷
    // status = 9: 左键点击 & 未击中雷 & 周围有5个雷
    // status = 10: 左键点击 & 未击中雷 & 周围有6个雷
    // status = 11: 左键点击 & 未击中雷 & 周围有7个雷
    // status = 12: 左键点击 & 未击中雷 & 周围有8个雷

    // status = 13: 没有雷，右键点击变成小红旗
    // status = 14: 有雷，右键点击变成小红旗
    // status = 15: 点中雷后，其他雷的样式
    // status = 16: 点中雷后，右键已标记了小红旗的样式
    eightDiamond: function(i, j) {
      var boomSum = 0;
      this.statusNow[i][j] = 0;
      if (
        //判断左上角雷的个数
        i > 0 &&
        j > 0 &&
        (2 == this.statusNow[i - 1][j - 1] ||
          3 == this.statusNow[i - 1][j - 1] ||
          14 == this.statusNow[i - 1][j - 1])
      ) {
        boomSum++;
      }
      if (
        //判断正上方雷的个数
        i > 0 &&
        (2 == this.statusNow[i - 1][j] ||
          3 == this.statusNow[i - 1][j] ||
          14 == this.statusNow[i - 1][j])
      ) {
        boomSum++;
      }
      if (
        //判断右上角雷的个数
        i > 0 &&
        j < this.mineSweeperHeight - 1 &&
        (2 == this.statusNow[i - 1][j + 1] ||
          3 == this.statusNow[i - 1][j + 1] ||
          14 == this.statusNow[i - 1][j + 1])
      ) {
        boomSum++;
      }
      if (
        //判断正左侧雷的个数
        j > 0 &&
        (2 == this.statusNow[i][j - 1] ||
          3 == this.statusNow[i][j - 1] ||
          14 == this.statusNow[i][j - 1])
      ) {
        boomSum++;
      }
      if (
        //判断正右侧雷的个数
        j < this.mineSweeperHeight - 1 &&
        (2 == this.statusNow[i][j + 1] ||
          3 == this.statusNow[i][j + 1] ||
          14 == this.statusNow[i][j + 1])
      ) {
        boomSum++;
      }
      if (
        //判断左下角雷的个数
        i < this.mineSweeperWidth - 1 &&
        j > 0 &&
        (2 == this.statusNow[i + 1][j - 1] ||
          3 == this.statusNow[i + 1][j - 1] ||
          14 == this.statusNow[i + 1][j - 1])
      ) {
        boomSum++;
      }
      if (
        //判断正下方雷的个数
        i < this.mineSweeperWidth - 1 &&
        (2 == this.statusNow[i + 1][j] ||
          3 == this.statusNow[i + 1][j] ||
          14 == this.statusNow[i + 1][j])
      ) {
        boomSum++;
      }
      if (
        //判断右下角雷的个数
        i < this.mineSweeperWidth - 1 &&
        j < this.mineSweeperHeight - 1 &&
        (2 == this.statusNow[i + 1][j + 1] ||
          3 == this.statusNow[i + 1][j + 1] ||
          14 == this.statusNow[i + 1][j + 1])
      ) {
        boomSum++;
      }

      if (0 == boomSum) {
        if (
          //揭开左上角
          i > 0 &&
          j > 0 &&
          1 == this.statusNow[i - 1][j - 1]
          // ||13 == this.statusNow[i - 1][j - 1]
        ) {
          this.statusNow[i - 1][j - 1] = this.eightDiamond(i - 1, j - 1);
        }
        if (
          //揭开正上方
          i > 0 &&
          1 == this.statusNow[i - 1][j]
          // || 13 == this.statusNow[i - 1][j]
        ) {
          this.statusNow[i - 1][j] = this.eightDiamond(i - 1, j);
        }
        if (
          //揭开右上角
          i > 0 &&
          j < this.mineSweeperHeight - 1 &&
          1 == this.statusNow[i - 1][j + 1]
          // ||13 == this.statusNow[i - 1][j + 1]
        ) {
          this.statusNow[i - 1][j + 1] = this.eightDiamond(i - 1, j + 1);
        }
        if (
          //揭开正左侧
          j > 0 &&
          1 == this.statusNow[i][j - 1]
          // || 13 == this.statusNow[i][j - 1]
        ) {
          this.statusNow[i][j - 1] = this.eightDiamond(i, j - 1);
        }
        if (
          //揭开正右侧
          j < this.mineSweeperHeight - 1 &&
          1 == this.statusNow[i][j + 1]
          // || 13 == this.statusNow[i][j + 1]
        ) {
          this.statusNow[i][j + 1] = this.eightDiamond(i, j + 1);
        }
        if (
          //揭开左下角
          i < this.mineSweeperWidth - 1 &&
          j > 0 &&
          1 == this.statusNow[i + 1][j - 1]
          //  ||13 == this.statusNow[i + 1][j - 1]
        ) {
          this.statusNow[i + 1][j - 1] = this.eightDiamond(i + 1, j - 1);
        }
        if (
          //揭开正下方
          i < this.mineSweeperWidth - 1 &&
          1 == this.statusNow[i + 1][j]
          //  13 == this.statusNow[i + 1][j]
        ) {
          this.statusNow[i + 1][j] = this.eightDiamond(i + 1, j);
        }
        if (
          //揭开右下角
          i < this.mineSweeperWidth - 1 &&
          j < this.mineSweeperHeight - 1 &&
          1 == this.statusNow[i + 1][j + 1]
          //  ||13 == this.statusNow[i + 1][j + 1]
        ) {
          this.statusNow[i + 1][j + 1] = this.eightDiamond(i + 1, j + 1);
        }
      }
      return boomSum + 4;
    }
  }
};
</script>

// <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* 最外的div */
.wholePageEasy {
  width: 295px;
  height: 271px;
  margin: 0 auto;
  background-color: white;
  border-radius: 5px;
  border: 2px solid black;
  box-shadow: 8px 8px 30px 5px gray;
}
.wholePageMedium {
  width: 380px;
  height: 301px;
  margin: 0 auto;
  background-color: white;
  border-radius: 5px;
  border: 2px solid black;
  box-shadow: 8px 8px 30px 5px gray;
}
.wholePageHard {
  width: 550px;
  height: 361px;
  margin: 0 auto;
  background-color: white;
  border-radius: 5px;
  border: 2px solid black;
  box-shadow: 8px 8px 30px 5px gray;
}
/* 难度选项 */
.optionOfDegreeEasy {
  width: 275px;
  height: 40px;
  background-color: rgb(240, 243, 244);
  position: relative;
  top: 10px;
  left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: auto;
  border-radius: 5px;
  font-size: 3px;
}
.optionOfDegreeMedium {
  width: 360px;
  height: 30px;
  background-color: rgb(240, 243, 244);
  position: relative;
  top: 10px;
  left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: left;
  border-radius: 5px;
  font-size: 15px;
}
.optionOfDegreeHard {
  width: 530px;
  height: 30px;
  background-color: rgb(240, 243, 244);
  position: relative;
  top: 10px;
  left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: left;
  border-radius: 5px;
}
/* 包含所有小格子的大div */
.bigDiamondEasy {
  width: 275px;
  height: 190px;
  background-color: rgb(240, 243, 244);
  position: relative;
  top: 10px;
  left: 10px;
  border-radius: 5px;
  /* margin-right: 1px; */
  /* margin-bottom: 1px; */
}
.bigDiamondMedium {
  width: 360px;
  height: 225px;
  background-color: rgb(240, 243, 244);
  position: relative;
  top: 10px;
  left: 10px;
  border-radius: 5px;
  /* margin-right: 1px; */
  /* margin-bottom: 1px; */
}
.bigDiamondHard {
  width: 530px;
  height: 291px;
  background-color: rgb(240, 243, 244);
  position: relative;
  top: 10px;
  left: 10px;
  border-radius: 5px;
  /* margin-right: 1px; */
  /* margin-bottom: 1px; */
}
/* 所有行的样式 */
.columnOfDiamondEasy {
  width: 255px;
  height: 16px;
  background-color: white;
  position: relative;
  top: 10px;
  left: 10px;

  /* margin-right: 1px; */
  margin-bottom: 1px;
  font-size: 15px;
}
.columnOfDiamondMedium {
  width: 340px;
  height: 16px;
  background-color: white;
  position: relative;
  top: 10px;
  left: 10px;

  /* margin-right: 1px; */
  margin-bottom: 1px;
  font-size: 15px;
}
.columnOfDiamondHard {
  width: 510px;
  height: 16px;
  background-color: white;
  position: relative;
  top: 10px;
  left: 10px;

  /* margin-right: 1px; */
  margin-bottom: 1px;
  font-size: 15px;
}
/* 所有列的样式 */
.littleDiamond {
  width: 16px;
  height: 16px;
  position: relative;
  display: inline-block;
  float: none;
  /* top: 10px;
  left: 10px; */
  margin-right: 1px;
  margin-bottom: 1px;
  /* margin: auto, auto; */
  background-color: rgb(240, 243, 244);
  cursor: pointer;
  outline: none;
}
/* 最小的小方格的样式 */
.littleDiamond:hover {
  width: 16px;
  height: 16px;
  position: relative;
  display: inline-block;
  /* float: left; */
  /* top: 10px;
  left: 10px; */
  /* margin-right: 1px; */
  margin-bottom: 1px;
  /* margin: auto, auto; */
  background-color: rgb(193, 193, 193);
  cursor: pointer;
}
/* statusNow==3时候的样式 */
.littleDiamond_3 {
  background: url(../assets/clickBoom.png);
  background-size: 15px 15px;
}
.littleDiamond_mouseDown {
  background-color: rgb(193, 193, 193);
}
.littleDiamond_mouseRight {
  background: url(../assets/flag.png);
  background-size: 15px 15px;
}
.littleDiamond_15 {
  background: url(../assets/boom.png);
  background-size: 15px 15px;
}
.littleDiamond_16 {
  background: url(../assets/flagError.png);
  background-size: 15px 15px;
}
</style>
