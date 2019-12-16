<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加权限</el-button>
    </div>

    <el-table
      :key="tableKey"
      :header-row-style="{color:'#1890ff'}"
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="#" width="50" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="展现图标" align="center">
        <template slot-scope="{row}">
          <span>{{ row.icon }}</span>
        </template>
      </el-table-column>
      <el-table-column label="module_id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.module_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主管id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.parentid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="端口Id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.port_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理Id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.rule_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理员" align="center" min-width="180">
        <template slot-scope="{row}">
          <span>{{ row.rule_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单" align="center">
        <template slot-scope="{row}">
          <span>{{ row.rule_title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联模块标识" align="center">
        <template slot-scope="{row}">
          <span>{{ row.signs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="info"
            :disabled="scope.row.aid"
            style="width:auto"
            @click="reset(scope.row.uid)"
          >权限列表</el-button>
          <el-button
            type="primary"
            style="width:auto"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button size="mini" type="success" style="width:auto" @click="ListDetail(scope.row)">详情</el-button>
          <el-button
            size="mini"
            style="width:auto"
            type="danger"
            @click="handleDelete(scope.row.uid,'deleted')"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      align="center"
      v-show="total>0"
      :total="total"
      :page-sizes="[5, 10, 15, 20]"
      :page.sync="listData.page"
      :limit.sync="listData.size"
      @pagination="getList"
    />
    <!-- 新增修改弹窗 -->
    <el-dialog
      center
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="130px"
        style=" margin:0 50px;"
      >
        <el-form-item label="选择角色:">
          <el-tree :data="data" show-checkbox node-key="id" :props="defaultProps" ref="tree"></el-tree>
        </el-form-item>
        <el-form-item label="权限端口:">
          <el-tree :data="data" show-checkbox node-key="id" :props="defaultProps" ref="tree2"></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>

    <!-- 管理员详情 -->
    <el-dialog center :visible.sync="payStatus" title="管理员详情">
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-form-item style="margin-bottom:0;" label="排序：">
          <span>{{ruleForm.displayorder}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="展现图标：">
          <span>{{ruleForm.icon}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="关联模块id：">
          <span>{{ruleForm.module_id}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="主管id：">
          <span>{{ruleForm.parentid}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="端口Id：">
          <span>{{ruleForm.port_id}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="管理Id：">
          <span>{{ruleForm.rule_id}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="管理员：">
          <span>{{ruleForm.rule_name}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="菜单：">
          <span>{{ruleForm.rule_title}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="关联模块标识：">
          <span>{{ruleForm.signs}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="状态：">
          <span>{{ruleForm.status}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="标题：">
          <span>{{ruleForm.title}}</span>
        </el-form-item>
        <el-form-item align="center">
          <el-button type="primary" @click="payStatus = false">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import DropdownMenu from "@/components/Share/DropdownMenu";
import { fetchList, fetchPv, updateArticle } from "@/api/article";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary
import { workList, workPort, workOperator } from "@/utils/request";

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (this.passWord === "") {
        callback(new Error("请再次输入密码"));
      } else if (this.passWord != this.temp.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      flagShow: false,
      flag: true, //判断账号是否已注册
      ruleForm: {}, //详情数据
      payStatus: false, //支付配置弹窗
      citySelect: true,
      passWord: "", //再次输入密码
      searchData: "", //搜索关键字
      searchItem: "", //本页搜索关键字
      itemData: "", //项目类型
      details: false, //项目类型显示
      selectedOptions: [], //城市选择器选中数据
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id"
      },
      listData: {
        page: 1,
        size: 10
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      statusOptions: [
        { id: 1, value: "审核通过" },
        { id: 2, value: "审核不通过" }
      ],
      showReviewer: false,
      temp: {
        nick_name: "",
        reg_name: "",
        province: "",
        city: "",
        country: "",
        detail: "",
        contact: "",
        boss: "",
        meal: "",
        introduce: "",
        status: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "新增"
      },
      dialogPvVisible: false,
      pvData: 1,
      pvDataID: "",
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      rules: {
        username: [
          { required: true, message: "不能为空", trigger: "blur" },
          { min: 5, max: 8, message: "长度在 5 到 8 个字符", trigger: "blur" }
        ], //登录账号
        password: [
          { required: true, message: "不能为空", trigger: "blur" },
          { min: 5, max: 8, message: "长度在 5 到 8 个字符", trigger: "blur" }
        ], //登录密码
        repwd: [{ required: true, validator: validatePass2, trigger: "blur" }], //登录密码
        remark: [{ required: true, message: "不能为空", trigger: "blur" }],
        start_time: [
          { required: true, message: "请选择时间", trigger: "change" }
        ],
        end_time: [
          { required: true, message: "请选择时间", trigger: "change" }
        ],
        mobile: [{ required: true, message: "不能为空", trigger: "blur" }],
        name: [{ required: true, message: "不能为空", trigger: "blur" }],
        email: [{ required: true, message: "不能为空", trigger: "blur" }],
        address: [{ required: true, message: "不能为空", trigger: "blur" }],
        group_id: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    };
  },
  mounted() {
    console.log(this.$route.params.id);
    if (this.$route.params.id) {
      localStorage.setItem('uid',this.$route.params.id)
    }
    this.listData = this.$route.params.id ? this.$route.params.id : localStorage.getItem('uid');
    this.getList();
  },
  methods: {
    //查看详情
    ListDetail(v) {
      this.ruleForm = Object.assign({}, v);
      this.payStatus = true;
    },
    //验证账号
    checkExist(v) {
      console.log(this.temp.username);
      console.log(this.temp.username.length);
      this.flagShow = true;
      if (this.temp.username.length <= 10 && this.temp.username.length >= 5) {
        // var d=
        // this.flag = res.isExist;
        // aidCheck(this.temp.username).then(res => {
        //   if (res.code === 200) {
        //     this.flagShow = true;
        //     this.flag = res.isExist;
        //   }
        // });
      }
    },
    // 初始化完成，推送商盟
    handlePushSM(row, index) {
      this.$confirm("确定要推送到商盟吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          pushSM(row.id).then(res => {
            if (res.code === 200) {
              this.list[index].is_push_sm = 1;
              this.$message({
                showClose: true,
                type: "success",
                message: "推送成功"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消推送"
          });
        });
    },
    //清空筛选
    searchAll(v) {
      this.getList();
    },
    //跳转区域详情
    areaData(id) {
      this.$router.push({
        name: "RolePermission",
        params: {
          id: id
        }
      });
    },
    //跳转服务类型页面
    hrefItem(id) {
      this.$router.push({
        name: "DirectivePermission",
        params: {
          id: id
        }
      });
    },
    //重置密码
    reset(id) {
      console.log(id);
      workPort(id).then(res => {
        console.log(res);
      });
    },
    //搜索功能
    searchFilter() {
      if (this.searchData.trim()) {
        search(this.searchData).then(res => {
          if (res.code === 200) {
            this.list = res.isp;
          }
        });
      } else {
        this.getList();
      }
    },
    //显示项目类型
    itemStatus(v) {
      this.itemData = v;
      this.details = true;
    },
    //获取数据
    getList() {
      workList(this.listData).then(res => {
        console.log(res);
        if (res.code === 201) {
          // localStorage.setItem("page", JSON.stringify(res));
          // this.list = res.list;
          var arr = [];
          for (let i in res.list) {
            arr.push(res.list[i]); //属性
            //arr.push(obj[i]); //值
          }
          console.log(arr);
          this.list = arr.sort(function(a, b) {
            return b.displayorder - a.displayorder;
          });
          // this.total = res.count;
        } else {
          this.$message.error(res.msg);
        }
      });
      setTimeout(() => {
        this.listLoading = false;
      }, 1.5 * 1000);
    },
    //修改状态
    changeStatus() {
      var data = {
        id: this.pvDataID,
        status: this.pvData
      };
      status(data).then(res => {
        if (res.code === 200) {
          this.dialogPvVisible = false;
          this.getList();
          this.$message({
            showClose: true,
            type: "success",
            message: "修改成功"
          });
        }
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
    },
    handleModifyStatus(row, status) {
      this.getList();
      this.$message({
        showClose: true,
        message: "操作Success",
        type: "success"
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    handleChange(value) {
      //选择城市
      this.citySelect = false;
      this.options.map(v => {
        if (v.value == value[0]) {
          this.temp.province = v.label;
          for (let i = 0; i < v.children.length; i++) {
            const element = v.children[i];
            if (v.children[i].value === value[1]) {
              var city = v.children[i];

              this.temp.city = v.children[i].label;
              for (let b = 0; b < city.children.length; b++) {
                if (city.children[b].value === value[2]) {
                  this.temp.country = city.children[b].label;
                }
              }
            }
          }
        }
      });
    },
    handleCreate() {
      //新增服务商
      this.temp = {};
      this.selectedOptions = [];
      this.passWord = "";
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      var d = {
        uid: this.listData,
        role_id: this.$refs.tree.getCheckedKeys().join(","),
        port_id: this.$refs.tree2.getCheckedKeys().join(",")
      };
      console.log(d);

      if (!d.role_id) {
        this.$notify({
          title: "提示",
          message: "请选择角色",
          type: "error"
        });
        return;
      }
      if (!d.port_id) {
        this.$notify({
          title: "提示",
          message: "请选择权限",
          type: "error"
        });
        return;
      }

      console.log(d);
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          workOperator(d).then(res => {
            if (res.code === 201) {
              this.getList();
              this.dialogFormVisible = false;
              if (res.error_code === 70000) {
                this.$notify({
                  title: "失败",
                  message: res.msg,
                  type: "error"
                });
                return;
              }
              this.$notify({
                title: "成功",
                message: "添加成功",
                type: "成功",
                duration: 2000
              });
            } else {
              this.$notify({
                title: "失败",
                message: res.msg,
                type: "error"
              });
            }
          });
        }
      });
    },
    handleUpdate(row) {
      this.dialogStatus = "update";
      this.passWord = "";
      this.temp = Object.assign({}, row); // copy obj
      this.temp.end_time = parseTime(this.temp.end_time);
      this.temp.start_time = parseTime(this.temp.start_time);
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      var d = {
        uid: this.temp.uid,
        username: this.temp.username,
        password: this.temp.password,
        remark: this.temp.remark,
        start_time: new Date(this.temp.start_time).getTime() / 1000,
        end_time: new Date(this.temp.end_time).getTime() / 1000,
        name: this.temp.name,
        mobile: this.temp.mobile,
        email: this.temp.email,
        address: this.temp.address,
        group_id: this.temp.group_id
      };

      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          workerUpdate(d).then(res => {
            if (res.code === 201) {
              this.getList();
              this.$message({
                showClose: true,
                type: "success",
                message: "修改成功!"
              });
              this.temp = {
                nick_name: "",
                reg_name: "",
                province: "",
                city: "",
                country: "",
                detail: "",
                contact: "",
                boss: "",
                meal: "",
                introduce: "",
                status: ""
              };
              this.dialogFormVisible = false;
              this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
              });
            } else {
              this.$message({
                showClose: true,
                message: res.msg
              });
            }
          });
        }
      });
    },
    handleDelete(row) {
      console.log(row);
      this.$confirm("是否删除服务商?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          workerDelete(row).then(res => {
            if (res.code === 201) {
              this.$message({
                showClose: true,
                type: "success",
                message: "删除成功!"
              });
              this.getList();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消删除"
          });
        });

      // const index = this.list.indexOf(row);
      // this.list.splice(index, 1);
    },
    handleFetchPv(pv) {
      this.pvDataID = pv.id;
      this.pvData = pv.status == 1 ? "1" : "2";
      this.dialogPvVisible = true;
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["timestamp", "title", "type", "importance", "status"];
        const filterVal = [
          "timestamp",
          "title",
          "type",
          "importance",
          "status"
        ];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}`
        ? "ascending"
        : sort === `-${key}`
        ? "descending"
        : "";
    }
  }
};
</script>

<style lang="scss">
.titles {
  display: block;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 2px;
  padding-top: 10px;
  color: #007acc;
  border-top: 1px dashed #d7d7d7;
}
.titles:nth-child(1) {
  border-top: 0;
  padding-top: 0;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
textarea {
  -webkit-appearance: none;
  background-color: #ffffff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 134px;
  line-height: 20px;
  outline: none;
  padding: 8px 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  resize: none;
}
</style>