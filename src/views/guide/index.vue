<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加权限接口</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="rule_id"
      border 
      ref="multipleTable"
      :tree-props="{children: 'items'}"
    >
      <el-table-column prop="title" label="接口名称" width="180"></el-table-column>
      <el-table-column prop="rule_name" label="后端接口"></el-table-column>
      <el-table-column prop="rule_title" label="后台页面接口"></el-table-column>
      <el-table-column label="隶属" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.root_types">管理员</el-tag>
          <el-tag v-else>分公司</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.status">正常</el-tag>
          <el-tag v-else type="info">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.types">菜单</el-tag>
          <el-tag v-else>接口权限</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="180"></el-table-column>
   <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="scope">
                 <el-button type="primary" v-if="!scope.row.flag" size="mini"  @click="handleFetchPv(scope.row)">展开</el-button>
             <el-button type="primary" size="mini"  v-else @click="handleFetchPv(scope.row)">收起</el-button>
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
            @click="handleDelete(scope.row.rule_id)"
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
        hide-required-asterisk
      >
        <el-form-item prop="title" label="接口名称:">
          <el-input v-model="temp.title" placeholder="请输入对应的接口名称" />
        </el-form-item>
        <el-form-item prop="parent_id" label="上级id:">
          <el-input v-model="temp.parent_id" placeholder="请输入对应的上级id" />
        </el-form-item>
        <el-form-item prop="types" label="类型:">
          <el-switch
            v-model="temp.types"
            active-text="菜单"
            active-color="#13ce66"
            inactive-color="#ff4949"
            inactive-text="接口权限"
          ></el-switch>
        </el-form-item>
        <el-form-item prop="root_types" label="隶属:">
          <el-switch
            v-model="temp.root_types"
            active-text="属于管理员"
            active-color="#13ce66"
            inactive-color="#ff4949"
            inactive-text="属于分公司"
          ></el-switch>
        </el-form-item>
        <el-form-item prop="status" label="状态:">
          <el-switch v-model="temp.status" active-text="正常" inactive-text="禁用"></el-switch>
        </el-form-item>
        <el-form-item prop="rule_name" label="后端接口:">
          <el-input v-model="temp.rule_name" placeholder="请输入对应的后端接口" />
        </el-form-item>
        <el-form-item prop="rule_title" label="后台页面接口:">
          <el-input v-model="temp.rule_title" placeholder="请输入对应的后台页面接口" />
        </el-form-item>
        <el-form-item label="备注">
          <textarea v-model="temp.remark" cols="30" rows="2" placeholder="备注内容"></textarea>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>
    <!-- 修改审核状态 -->
    <el-dialog center :visible.sync="dialogPvVisible" title="修改状态">
      <template>
        <el-radio v-model="pvData" border label="1">审核通过</el-radio>
        <el-radio v-model="pvData" border label="2">审核不通过</el-radio>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPvVisible = false">取消</el-button>
        <el-button type="primary" @click="changeStatus">确认</el-button>
      </div>
    </el-dialog>
    <!-- 服务项目类型 -->
    <el-dialog center :visible.sync="details" title="服务项目类型">
      <el-table :data="itemData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="id" label="服务项目id" />
        <el-table-column prop="visit_fee" label="上门费" />
        <el-table-column prop="work_time_fee" label="工时费" />
        <el-table-column prop="category.name" label="类型" />
        <!-- <el-table-column prop="category.statu" label="状态"></el-table-column> -->
      </el-table>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary">Confirm</el-button>
      </span>-->
    </el-dialog>

    <!-- 权限接口详情 -->
    <el-dialog center :visible.sync="payStatus" title="权限接口详情">
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-form-item style="margin-bottom:0;" label="接口名称">
          <span>{{ruleForm.title}}</span>
        </el-form-item> 
        <el-form-item style="margin-bottom:0;" label="后端接口">
          <span>{{ruleForm.rule_name}}</span>
        </el-form-item> 
        <el-form-item style="margin-bottom:0;" label="后台页面接口">
          <span>{{ruleForm.rule_title}}</span>
        </el-form-item>   
        <el-form-item style="margin-bottom:0;" label="隶属">
             <el-tag v-if="ruleForm.root_types">管理员</el-tag>
          <el-tag v-else>分公司</el-tag>
        </el-form-item>   
        <el-form-item style="margin-bottom:0;" label="状态">
          <el-tag v-if="ruleForm.status">正常</el-tag>
          <el-tag v-else type="info">禁用</el-tag>
        </el-form-item>   
        <el-form-item style="margin-bottom:0;" label="类型">
           <el-tag v-if="ruleForm.types">菜单</el-tag>
          <el-tag v-else>接口权限</el-tag>
        </el-form-item>  
       <el-form-item label="备注" > 
          <textarea v-model="ruleForm.remark" cols="30" rows="2" readonly></textarea>
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
import { modulesruleLi, modulesruleAdd, modulesruleDelete,modulesruleUpdate,modulesruleDetail } from "@/utils/request";

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
      rules: {  
        parent_id: [{ required: true, message: "不能为空", trigger: "blur" }], 
        title: [{ required: true, message: "不能为空", trigger: "blur" }],
        rule_name: [{ required: true, message: "不能为空", trigger: "blur" }],
        rule_title: [{ required: true, message: "不能为空", trigger: "blur" }], 
      }
    };
  },
  mounted() {
    this.listData.size = JSON.parse(localStorage.getItem("listSize")) || 10;
    this.getList();
  },
  methods: {
     handleFetchPv(row) {
      row.flag = !row.flag;
      this.$refs.multipleTable.toggleRowExpansion(row, row.flag);
    },
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
      this.$router.push({
        name: "Documentation2",
        params: {
          id
        }
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
      //获取数据
      this.listLoading = true;
      modulesruleLi(this.listData).then(res => {
        console.log(res);
        if (res.code === 201) {
          this.list = [];
          for (let i in res.list) {
            this.list.push(res.list[i]);
          }
          this.listLoading = false;
        }
      });
      setTimeout(() => {
        this.listLoading = false;
      }, 3000);
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
        types: this.temp.types?1:2,
        root_types: this.temp.root_types?1:2,
        remark: this.temp.remark, 
        parent_id: this.temp.parent_id,
        status: this.temp.status?1:0,
        title: this.temp.title,
        rule_name: this.temp.rule_name,
        rule_title: this.temp.rule_title
      };
      console.log(d); 
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          modulesruleAdd(d).then(res => { 
            if (res.code === 201) {
              this.getList();
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "添加数据成功",
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
      this.temp = Object.assign({}, row); // copy obj 
      console.log(this.temp)
         this.temp.types=this.temp.types===1?true:false,
         this.temp.root_types=this.temp.root_types===1?true:false,
        this.temp.status=this.temp.status===1?true:false,
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
         var d = {
        types: this.temp.types?1:2,
        root_types: this.temp.root_types?1:2,
        remark: this.temp.remark, 
        rule_id: this.temp.rule_id===undefined?0:this.temp.rule_id, 
        parent_id: this.temp.parent_id,
        status: this.temp.status?1:0,
        title: this.temp.title,
        rule_name: this.temp.rule_name,
        rule_title: this.temp.rule_title
      }; 
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          modulesruleUpdate(d).then(res => {
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
      this.$confirm("是否删除权限接口?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          modulesruleDelete(row).then(res => {
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
 .el-table th>.cell {
        text-align: center;
    }
</style>
