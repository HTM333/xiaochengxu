<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="searchData"
        placeholder="搜索关键字：用户名"
        style="width: 300px;"
        class="filter-item"
        :clearable="true"
        @clear="searchAll"
        @keyup.enter.native="searchFilter"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>

      <el-button
        v-waves
        class="filter-item"
        style=" position: relative; right: 10px; border-top-left-radius: 0; border-bottom-left-radius: 0;"
        type="primary"
        icon="el-icon-search"
        @click="searchFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加收费记录</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="rule_id"
      border
      ref="multipleTable"
    >
      <el-table-column prop="name" label="名称" width="120" align="center"></el-table-column>
      <el-table-column prop="username" label="用户名" width="120" align="center"></el-table-column>
      <el-table-column prop="address" label="地址" width="120" align="center"></el-table-column>
      <el-table-column prop="channel" label="引导" width="120" align="center"></el-table-column>
      <el-table-column prop="countPrice" label="收费金额" width="120" align="center"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="120" align="center"></el-table-column>
      <el-table-column prop="mobile" label="联系电话" width="120" align="center"></el-table-column>
      <el-table-column label="月份" align="center" width="60">
        <template slot-scope="{row}">
          <span class="text_p">{{row.months}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="220"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
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
            @click="handleDelete(scope.row.charges_id)"
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
        <el-form-item prop="uid" label="关联套餐表id:">
          <el-input v-model="temp.uid" placeholder="请输入关联套餐表id" />
        </el-form-item>
        <el-form-item prop="insert_id" label="添加人id:">
          <el-input v-model="temp.insert_id" placeholder="请输入添加人id" />
        </el-form-item>
        <el-form-item prop="start_time" label="收费开始时间:">
          <el-date-picker v-model="temp.start_time" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item prop="end_time" label="收费结束时间:">
          <el-date-picker v-model="temp.end_time" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item prop="address" label="地址:">
          <el-input v-model="temp.address" placeholder="请输入用户地址" />
        </el-form-item>
        <el-form-item prop="channel" label="支付方式:"> 
          <el-radio v-model="temp.channel" label="alipay">支付宝</el-radio>
          <el-radio v-model="temp.channel" label="wxapp">微信</el-radio>
          <el-radio v-model="temp.channel" label="people">银行卡</el-radio>
        </el-form-item>
        <el-form-item prop="ip" label="ip地址:">
          <el-input v-model="temp.ip" placeholder="请输入用户ip地址" />
        </el-form-item>
        <el-form-item prop="email" label="邮箱:">
          <el-input v-model="temp.email" placeholder="请输入用户邮箱" />
        </el-form-item>
        <el-form-item prop="email" label="联系电话:">
          <el-input v-model="temp.mobile" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item prop="yj_price" label="原价总价:">
          <el-input
            v-model="temp.yj_price"
            placeholder="请输入原价总价价格，保留一位小数"
            onkeyup="value=value.replace(/^(\-)*(\d+)\.(\d).*$/,'$1$2.$3')"
            onpaste="value=value.replace(/^(\-)*(\d+)\.(\d).*$/,'$1$2.$3')"
            oncontextmenu="value=value.replace(/^(\-)*(\d+)\.(\d).*$/,'$1$2.$3')"
          />
        </el-form-item>
        <el-form-item prop="yh_price" label="优惠价总价:">
          <el-input
            v-model="temp.yh_price"
            placeholder="请输入优惠价总价格，保留一位小数"
            onkeyup="value=value.replace(/^(\-)*(\d+)\.(\d).*$/,'$1$2.$3')"
            onpaste="value=value.replace(/^(\-)*(\d+)\.(\d).*$/,'$1$2.$3')"
            oncontextmenu="value=value.replace(/^(\-)*(\d+)\.(\d).*$/,'$1$2.$3')"
          />
        </el-form-item>
        <el-form-item prop="countPrice" label="最终价格:">
          <el-input
            v-model="temp.countPrice"
            placeholder="请输入最终价格，月份*套餐价格，保留一位小数"
            onkeyup="value=value.replace(/^(\-)*(\d+)\.(\d).*$/,'$1$2.$3')"
            onpaste="value=value.replace(/^(\-)*(\d+)\.(\d).*$/,'$1$2.$3')"
            oncontextmenu="value=value.replace(/^(\-)*(\d+)\.(\d).*$/,'$1$2.$3')"
          />
        </el-form-item>
        <el-form-item label="备注">
          <textarea v-model="ruleForm.remark" cols="30" rows="2"></textarea>
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
    <el-dialog center :visible.sync="payStatus" title="收费记录详情">
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-form-item style="margin-bottom:0;" label="名称">
          <span>{{ruleForm.name}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="用户名">
          <span>{{ruleForm.username}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="地址">
          <span>{{ruleForm.address}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="引导">
          <span>{{ruleForm.channel}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="收费金额">
          <span>{{ruleForm.countPrice}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="金额1">
          <span>{{ruleForm.yh_price}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="金额2">
          <span>{{ruleForm.yj_price}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="邮箱">
          <span>{{ruleForm.email}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="联系电话">
          <span>{{ruleForm.mobile}}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="创建时间">
          <span>{{ruleForm.create_time | parseTime('{y}-{m}-{d}') }}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="结束时间">
          <span>{{ruleForm.end_time | parseTime('{y}-{m}-{d}') }}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="月份">
          <span>{{ruleForm.months }}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="开始时间">
          <span>{{ruleForm.start_time | parseTime('{y}-{m}-{d}') }}</span>
        </el-form-item>
        <el-form-item style="margin-bottom:0;" label="结束时间">
          <span>{{ruleForm.end_time | parseTime('{y}-{m}-{d}') }}</span>
        </el-form-item>
        <el-form-item label="备注">
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
import {
  chargesList,
  chargesAdd,
  chargesDel,
  chargesUpdate,
  chargesDetail
} from "@/utils/request";

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
        size: 10,
        keyword: ""
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
        uid: [{ required: true, message: "不能为空", trigger: "blur" }],
        price: [{ required: true, message: "不能为空", trigger: "blur" }],
        countPrice: [{ required: true, message: "不能为空", trigger: "blur" }],
        months: [{ required: true, message: "不能为空", trigger: "blur" }],
        start_time: [
          { required: true, message: "请选择开始时间", trigger: "change" }
        ],
        end_time: [
          { required: true, message: "请选择结束时间", trigger: "change" }
        ]
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
      this.listData.keyword = "";
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
        this.listData.keyword = this.searchData;
      }
      this.getList();
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
      chargesList(this.listData).then(res => {
        console.log(res);
        if (res.code === 201) {
          this.list = res.list.data;
          this.total = res.count;
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
        charges_id: this.temp.charges_id,
        insert_id: this.temp.insert_id,
        uid: this.temp.uid,
        setmeal_id: this.temp.setmeal_id, 
        start_time: new Date(this.temp.start_time).getTime() / 1000,
        end_time: new Date(this.temp.end_time).getTime() / 1000,
        channel: this.temp.channel,
        months: this.temp.months,
        yh_price: this.temp.yh_price,
        yj_price: this.temp.yj_price,
        countPrice: this.temp.countPrice,
        remark: this.temp.remark,
      };
      console.log(d);
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          chargesAdd(d).then(res => {
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
      this.temp.end_time = parseTime(this.temp.end_time);
      this.temp.start_time = parseTime(this.temp.start_time);
      console.log(this.temp);
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      var d = {
    charges_id: this.temp.charges_id,
        insert_id: this.temp.insert_id,
        uid: this.temp.uid,
        setmeal_id: this.temp.setmeal_id, 
        start_time: new Date(this.temp.start_time).getTime() / 1000,
        end_time: new Date(this.temp.end_time).getTime() / 1000,
        channel: this.temp.channel,
        months: this.temp.months,
        yh_price: this.temp.yh_price,
        yj_price: this.temp.yj_price,
        countPrice: this.temp.countPrice,
        remark: this.temp.remark,
      };
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          chargesUpdate(d).then(res => {
            if (res.code === 201) {
              this.getList();
              this.$message({
                showClose: true,
                type: "success",
                message: "修改成功!"
              });
              this.temp = {};
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
      this.$confirm("是否删除收费记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          chargesDel(row).then(res => {
            if (res.code === 201) {
              if (res.error_code === 90000) {
                this.$message({
                  showClose: true,
                  type: "info",
                  message: res.msg
                });
                return;
              }
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

<style lang="scss" scoped>
.text_p {
  width: 120px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
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
.el-table th > .cell {
  text-align: center;
}
</style>
