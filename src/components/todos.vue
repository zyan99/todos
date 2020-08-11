<!--  -->
<template>
  <div class="todos_box">
    <section>
      <div class="content">
        <div class="content_top">
          <div :class="['left',{ allcheck:allChecked }]" @click.stop="allCheckEvent">❯</div>
          <div class="right">
            <input v-focus type="text" placeholder="来点啥" v-model="inputVal" @keyup.13="saveNewTodo" />
          </div>
        </div>

        <div class="content_list">
          <div class="content_list_item" v-for="item,index in filterTodos">
            <div class="left">
              <input type="checkbox" v-model="item.completed" />
            </div>
            <!-- 文本内容 双击修改 -->
            <div
              :class="['middle',{ completed:item.completed,hidden:edit_index==index }]"
              @dblclick.stop="editTodo(index)"
            >{{item.content}}</div>
            <!-- 文本内容修改 -->
            <div :class="['middle','hidden',{ show:edit_index==index }]">
              <input
                type="text"
                @keyup.enter="saveEditTodo(index)"
                @keyup.esc="cancelEditTodo(index)"
                @blur="saveEditTodo(index)"
                v-model="item.content"
              />
            </div>

            <!-- 删除 -->
            <div class="right" @click.stop="delTodo(index)">x</div>
          </div>
        </div>
      </div>
      <div class="content_foot">
        <div class="content_foot_left">
          剩下
          <span>{{remaining.length}}</span>项
        </div>
        <div class="content_foot_center">
          <a href="#/all">All</a>
          <a href="#/active">待办</a>
          <a href="#/finish">完成</a>
        </div>
        <div class="content_foot_right" @click.stop="clearCompletedTodos">清除已完成</div>
      </div>
    </section>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      inputVal: "", // 输入框的值
      allCheckLabel: null, // 全选状态
      edit_index: -1, // -1 代表没有在编辑的项
      content_cache: "", // 缓存的内容
      todos: window.mytodos.storageFunc.fetch(),
    };
  },
  //监听属性 类似于data概念
  computed: {
    // 过滤之后的 todos
    filterTodos: function () {
      // console.log(this.unfold)
      if (this.unfold == "all") {
        return this.todos;
      } else if (this.unfold == "active") {
        return this.todos.filter(function (v, i) {
          return !v.completed; // 待完成
        });
      } else {
        return this.todos.filter(function (v, i) {
          return v.completed; // 完成项目
        });
      }
    },
    // 根据allChecked 的值来决定
    allChecked: function () {
      let allChecked = true; //默认全选
      this.todos.map(function (v, i) {
        // 只要有一个没选中, 返回false
        if (!v.completed) {
          allChecked = false;
        }
      });
      return allChecked;
    },
    remaining: function () {
      let remaining = this.todos.filter((v, i) => {
        // 未完成的项
        return !v.completed;
      });
      return remaining;
    },
    unfold: function () {
      return this.$root.unfold;
    },
  },
  //监控data中的数据变化
  watch: {
    todos: {
      handler(todos) {
        window.mytodos.storageFunc.save(todos);
      },
      deep: true,
    },
  },
  // 聚焦
  directives: {
    focus: {
      inserted: function (el, binding) {
        el.focus();
      },
    },
  },
  //方法集合
  methods: {
    // 清除已完成
    clearCompletedTodos: function (index) {
      // completed == true 已完成
      let un_finish_todos = this.todos.filter(function (v, i) {
        // 返回未完成的项目(新数组)
        return !v.completed;
      });
      this.todos = un_finish_todos;
    },
    //   新增
    saveNewTodo: function () {
      // console.log(this.filterTodos)
      if (!this.inputVal.trim()) {
        // 不能为空
        alert("不能为空┗|｀O′|┛ 嗷~~");
        return;
      }
      this.todos.push({
        id: this.getUniqID(), // 当前时间戳
        content: this.inputVal, // 内容
        completed: false,
      });
      // 清空输入框
      this.inputVal = "";
    },
    // 删除
    delTodo: function (index) {
      this.todos.splice(index, 1);
    },

    // 全选 todo
    allCheckEvent: function () {
      // 遍历所有的todo 将里面的 completed 设置为 true
      this.todos.forEach((v, i) => {
        if (v.completed === false) {
          this.allCheckLabel = false;
          return;
        } else {
          this.allCheckLabel = true;
        }
      });
      this.todos.forEach((v, i) => {
        v.completed = !this.allCheckLabel;
      });
      // true 变为 false,false 变为 true,下次点击
      this.allCheckLabel = !this.allCheckLabel;
    },
    // 编辑待办事项
    editTodo: function (index) {
      // console.log(index);
      // 保存记录编辑之前的值
      this.content_cache = this.todos[index].content;
      // 记录当前编辑项, 用于设置hidden,show类
      this.edit_index = index;
    },
    // 保存编辑项
    saveEditTodo: function (index) {
      if (!this.todos[index].content) {
        // 输入内容为空, 删除此项
        this.todos.splice(index, 1);
      }
      this.edit_index = -1; // 取消编辑状态
    },
    cancelEditTodo: function (index) {
      // 将原来的值赋予
      this.todos[index].content = this.content_cache;
      this.content_cache = ""; // 清空编辑 内容的缓存
      this.edit_index = -1; // 取消编辑
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    window.location.hash = "";
    let _this = this;
    let routes = [{ path: "all" }, { path: "active" }, { path: "finish" }];
    // 监听hash变化 将值分割 赋给unfold, 再赋给vue实例上的$root上的(已经在实例上(data里面)定义好的unfold)
    window.addEventListener("hashchange", function () {
      let unfold = window.location.hash.replace("#/", "");
      let index = routes.findIndex((v, i) => {
        if (v.path === unfold) {
          return true;
        }
      });
    //   如果没有, 将hash值清空, 设置为all(一开始加载hash为空)
      if (index === -1) {
        window.location.hash = "";
        _this.$root.unfold = "all";
      } else {
        // 有值就赋给 _this.$root.unfold
        _this.$root.unfold = unfold;
      }
      console.log(_this.$root.unfold);
    });
  },
  beforeCreate() {
    console.log(this);

    let storageKey = "mytodos";
    let mytodos = {};

    mytodos.storageFunc = {
      // 获取数据, 没有就返回空数组
      fetch: function () {
        return JSON.parse(localStorage.getItem(storageKey) || "[]");
      },
      // 设置本地存储
      save: function (todos) {
        localStorage.setItem(storageKey, JSON.stringify(todos));
      },
    };
    // 全局都可以用这里的方法
    window.mytodos = mytodos;
  }, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='less' scoped>
.content {
  .content_top {
    display: flex;
    height: 40px;
    overflow: hidden;
    .left {
      flex: 1;
      transform: rotate(90deg);
      color: #ccc;
      font-size: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &.allcheck {
        color: black;
      }
    }

    .right {
      flex: 9;
      input {
        width: 100%;
        height: 100%;
      }
    }
  }

  .content_list {
    .content_list_item {
      display: flex;
      padding: 5px;
      padding-left: 30px;
      height: 50px;
      line-height: 40px;
      &:hover .right {
        display: block;
      }
      &:hover {
        background-color: skyblue;
      }
      .left {
        flex: 1;
      }
      .middle {
        flex: 8;
        &.completed {
          color: #ccc;
          text-decoration: line-through;
        }
      }
      .right {
        cursor: pointer;
        flex: 1;
        display: none;
        color: red;
      }
      .hidden {
        display: none;
      }
      .show {
        display: block;
      }
    }
  }
}

.content_foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  border-top: 1px solid #ccc;
  padding: 5px;
  .content_foot_left {
    span {
      color: darksalmon;
    }
  }

  .content_foot_center {
    display: flex;
    a {
      text-decoration: none;
      color: pink;
      margin-right: 10px;
      &.active {
        color: #fff;
        font-weight: 100;
        background-color: rosybrown;
        border: 1px solid rosybrown;
        border-radius: 5px;
      }
    }
  }

  .content_foot_right {
    cursor: pointer;
    color: salmon;
    &:hover {
      color: red;
    }
  }
}
</style>