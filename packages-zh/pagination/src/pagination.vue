<template>
  <el-pagination
  layout="prev, pager, next"
  :total="total"
  :page-size="!!search ? search.pagesize || 10 : 10"
  :current-page.sync="currentPage"
  style="text-align:right; margin-top:1em;"
  @current-change="handleCurrentChange"></el-pagination>
</template>

<script type="text/babel">
import app from 'element-ui/src/js/zh-app';

export default {
  name: 'ZhPagination',

  props: {
    value: {
      type: Array,
      default: () => []
    },
    action: {
      type: String,
      default: ''
    },
    search: {
      type: Object,
      default: () => {}
    },
    currentChange: {
      type: Function,
      default: function() {}
    },
    pageQuery: {
      type: Function,
      default: function() {}
    },
    beforeQuery: {
      type: Function,
      default: function() {}
    },
    afterQuery: {
      type: Function,
      default: function() {}
    }
  },

  data() {
    return {
      total: 1,
      currentPage: 1
    };
  },

  computed: {
    pageData: {
      get: function() {
        return this.value;
      },
      set: function(e) {
        this.$emit('input', e);
      }
    }
  },

  methods: {
    queryData: function(page) {
      var that = this;
      this.$nextTick(function() {
        if (!that.action) {
          throw new Error('请绑定action属性（数据api请求地址）');
        } else {
          page = app.getHash('page') ? app.getHash('page') : (page || 1);

          var searchData = this.search || {};

          searchData.pageindex = page;
          searchData.sortname = (!!searchData.sortname || searchData.sortname === '') ? searchData.sortname : 'addtime';
          searchData.sortorder = searchData.sortorder || 'desc';

          !!this.beforeQuery && this.beforeQuery(searchData);

          this.$get(that.action, searchData, function(data) {
            this.$emit('codetype', data.code);
            if (data.code === 'pglist') {
              if (data.rows.length === 0 && this.currentPage !== 1) {
                this.queryData(this.currentPage - 1);
                return;
              };

              !!this.afterQuery && this.afterQuery(data.rows, data);
              !!this.pageQuery && this.pageQuery(data, data);
              that.total = data.total;

              data.rows.forEach(function(item, index) {
                item.$index = (page - 1) * searchData.pagesize + index + 1;
              });
              that.pageData = data.rows;

              this.currentPage = page;

              this.$emit('update:extra', data.extra);
            };
          });
        }
      });
    },
    handleCurrentChange: function(e) {
      !!this.currentChange && this.currentChange();

      var pageSession = app.getSession('search[' + window.location.pathname + '][' + window.location.search + '][' + this._uid + ']');
      if (pageSession) {
        pageSession.pageindex = e;
      } else {
        pageSession = {
          pageindex: e
        };
      };
      app.setSession('search[' + window.location.pathname + '][' + window.location.search + '][' + this._uid + ']', pageSession);

      this.$emit('currentChange', e);
      this.queryData(e);
    },
    reload: function() {
      this.queryData(this.currentPage);
    }
  },

  mounted: function() {
    var pageSession = app.getSession('search[' + window.location.pathname + '][' + window.location.search + '][' + this._uid + ']');
    var lastPageIndex = 1;
    if (pageSession) {
      lastPageIndex = pageSession.pageindex;
    };

    this.queryData(lastPageIndex);
  }
};
</script>
