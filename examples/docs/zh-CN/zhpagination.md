## Pagination 分页

el-pagination二次封装

### 基础用法

:::demo 设置`action`，组件能够自动请求接口数据，并通过`v-model`将数据进行外抛，供其他组件使用
```html
<template>
    <div class="block">
      <zh-pagination action="https://jsonplaceholder.typicode.com/posts/" v-model="tableData" :search="searchData">
      </zh-pagination>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        tableData: [],
        searchData: {
          sortname: 'addtime'
        }
      };
    }
  }
</script>
```
:::

### 钩子函数

:::demo `beforeQuery`绑定的函数，能够在组件自动请求前自动调用，参数为请求的参数`search`；`afterQuery`绑定的函数能够在组件自动请求结束后调用，参数为请求结果的`data.row`以及`data`；
```html
<template>
    <div class="block">
      <zh-pagination action="https://jsonplaceholder.typicode.com/posts/" v-model="tableData" :search="searchData" :before-query="beforeQuery" :after-query="afterQuery">
      </zh-pagination>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        tableData: [],
        searchData: {
          sortname: 'addtime'
        }
      };
    },
    methods: {
      beforeQuery(search) {
        search.sortname = 'name';
        console.log(this.searchData);
      },
      afterQuery(rows, data) {
        console.log(rows, data);
      }
    }
  }
</script>
```
:::

### Attributes
| 参数               | 说明                                                     | 类型              | 可选值      | 默认值 |
|--------------------|----------------------------------------------------------|-------------------|-------------|--------|
| action | 自动请求的接口地址 | string | — | '' |
| value | 请求到的数据 | array | — | [] |
| search | 请求的参数 | string | — | {sortname: 'addtime', sortorder: 'desc'} |
| beforeQuery | 组件内部请求前的钩子函数，参数为搜索条件 | function | — | - |
| afterQuery | 组件内部请求完毕的钩子函数，第一个参数为数组数据，第二个参数为完整的请求结果 | function | — | - |
| extra | 获取每次请求返回结果中extra参数 | string / number / object / array | — | - |

### Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| currentChange | 用户点击页码时会触发 | 当前页 |
| codetype | 请求完毕时会触发 | 当前请求返回结果的code |
