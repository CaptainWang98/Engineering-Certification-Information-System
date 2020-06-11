<template>
  <div class="app-container">
    <el-form 
    :model="headForm" 
    :inline="true"
    class="demo-form-inline">
      <el-form-item>
        <el-input v-model="headForm.major" placeholder="专业"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="headForm.grade" placeholder="年级"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="headForm.req" placeholder="毕业要求"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch()">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus" @click="handleAddPoint()">添加指标点</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="dialogUploadFormVisible = true;">批量导入<i class="el-icon-upload el-icon--right"></i></el-button>
      </el-form-item>
    </el-form>
    <el-table
    :data="tableData"
    border
    style="width: 100%">
      <el-table-column
        label="序号"
        prop="pointIndex">
      </el-table-column>
      <el-table-column
        label="专业"
        prop="req.major.name">
      </el-table-column>
      <el-table-column
        label="年级"
        prop="req.grade.grade">
      </el-table-column>
      <el-table-column
        label="所属毕业要求"
        prop="req.name">
      </el-table-column>
      <el-table-column
        label="内容"
        prop="note">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
          size="mini"
          @click="handleShowSupport(scope.row)">支撑课程目标</el-button>
          <el-button
          size="mini"
          type="primary"
          @click="handleEditPoint(scope.row)">编辑</el-button>
          <el-button
          size="mini"
          type="danger"
          @click="handleDeletePoint(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="Pagination">
        <el-pagination
          :total="count"
          :current-page="currentPage" 
          :page-size="10"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="total, prev, pager, next">
        </el-pagination>
      </div>
    <el-dialog title="添加指标点" :visible.sync="dialogAddPointVisible">
      <el-form :model="newPoint" ref="addForm" :rules="rules">
        <el-form-item label="序号" label-width="100px" prop="pointIndex">
          <el-input v-model="newPoint.pointIndex" auto-complete="off" placeholder="例：1-1"></el-input>
        </el-form-item>
        <el-form-item label="内容" label-width="100px" prop="note">
          <el-input v-model="newPoint.note" auto-complete="off" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="所属毕业要求" label-width="100px" prop="require">
          <el-autocomplete popper-class="my-autocomplete" v-model="newPoint.require" placeholder="选择毕业要求" :fetch-suggestions="querySearchReq">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.name }}</div>
              <span class="addr">{{ item.grade }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddPointVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPoint()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改指标点" :visible.sync="dialogEditPointVisible">
      <el-form :model="selectPoint" ref="editForm" :rules="rules">
        <el-form-item label="序号" label-width="100px" prop="pointIndex">
          <el-input v-model="selectPoint.pointIndex" auto-complete="off" placeholder="例：1-1"></el-input>
        </el-form-item>
        <el-form-item label="内容" label-width="100px" prop="note">
          <el-input v-model="selectPoint.note" auto-complete="off" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="所属毕业要求" label-width="100px" prop="require">
          <el-autocomplete popper-class="my-autocomplete" v-model="selectPoint.require" placeholder="选择毕业要求" :fetch-suggestions="querySearchReq">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.name }}</div>
              <span class="addr">{{ item.grade }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditPointVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePoint()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量上传" :visible.sync="dialogUploadFormVisible" width="23%">
      <el-upload
        class="upload-demo"
        drag
        :action="uploadUrl"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">请上传标准格式的Excel文件，<a :href="downloadUrl" target="_blank">下载模板</a></div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { addPoint, getPoints, getPointCount, searchPoints, deletePoint, updatePoint } from '@/api/points'
import { getAllReqs } from '@/api/reqs'

export default {
  data() {
    return {
      headForm: {
        major: '',
        grade: '',
        req: '',
      },
      
      tableData: [],
      selectPoint:{
        id: '',
        pointIndex: '',
        note: '',
        require: '',
      },
      newPoint: {
        pointIndex: '',
        note: '',
        require: '',
      },

      dialogAddPointVisible: false,
      dialogEditPointVisible: false,
      dialogUploadFormVisible: false,

      rules: {
        pointIndex: [
          { required: true, message: '非空', trigger: 'blur' },
          {
            validator: function (rule, value, callback) {
              var MobileRegex = /^\d+-\d+$/;
              if (!MobileRegex.test(value)) {
                callback(new Error('例：1-1'))
              } else {
                callback();
              }
            }, trigger: 'blur'
          }
        ],
        note: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        require: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
      },

      reqOptions: [],

      uploadUrl: process.env.VUE_APP_BASE_API + '/points/uploadPoints',
      downloadUrl: process.env.VUE_APP_BASE_API + '/points/downloadPointExcel',

      /**
       * 分页相关
       */ 
      count: 0,
      currentPage: 1,
      offset: 0,
      limit: 10,
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData(){
      // 先获得数据条数，然后调用获取数据函数
      this.getCount();
      this.getPoints();
      this.loadReqOptions();
    },

    getCount(){
      getPointCount().then(response => {
        this.count = response.data.result;
      });
    },

    getPoints(){
      getPoints({offset: this.offset, limit: this.limit}).then(response => {
        this.tableData = [];
        response.data.result.content.forEach(item => {
          let tableDataItem = {};
          tableDataItem.id = item.id;
          tableDataItem.req = item.require;
          tableDataItem.pointIndex = item.pointIndex;
          tableDataItem.note = item.note;
          this.tableData.push(tableDataItem);
        });
      });
    },
    handleAddPoint(){
      this.newPoint = {
        pointIndex: '',
        note: '',
        require: '',
      };
      this.dialogAddPointVisible = true;
    },
    addPoint(){
      let params = {
        pointIndex: this.newPoint.pointIndex,
        note: this.newPoint.note,
        require: {id: this.newPoint.require},
      };
      this.$refs['addForm'].validate(async (valid) => {
        if(valid){
          addPoint(params).then(response => {
            this.$message({
                type: 'success',
                message: '成功'
            });
            this.dialogAddPointVisible = false;
            this.getPoints();
          });
        }else{
          this.$message({
            type: 'warning',
            message: '请完善表单'
          });
        }
      });
    },
    handleDeletePoint(index, row){
      deletePoint({id: row.id}).then(response => {
        this.$message({
          type: 'success',
          message: '删除成功'
        });
        this.tableData.splice(index, 1);
        this.getCount();
      });
    },

    updatePoint(){
      let params = {
        id: this.selectPoint.id,
        pointIndex: this.selectPoint.pointIndex,
        note: this.selectPoint.note,
        require: {id: this.selectPoint.require},
      };
      this.$refs['editForm'].validate((valid) => {
        if(valid){
          updatePoint(params).then(response => {
            this.$message({
              type: 'success',
              message: '更新成功',
            });
            this.dialogEditPointVisible = false;
            this.initData();
          });
        }else{
          this.$message({
            type: 'warning',
            message: '请完善表单',
          });
        }
      });
    },

    handleEditPoint(row){
      this.selectPoint.id = row.id;
      this.selectPoint.pointIndex = row.pointIndex;
      this.selectPoint.note = row.note;
      this.selectPoint.require = row.req.id;
      this.dialogEditPointVisible = true;
    },
    handleShowSupport(row){
      this.$router.push({path: 'major-point-support', query: {id: row.id}});
    },

    handleSearch(){
      this.currentPage = 1;
      if(this.headForm.major || this.headForm.grade || this.headForm.req){
        searchPoints({major: this.headForm.major, grade: this.headForm.grade, req: this.headForm.req, offset: this.offset, limit: this.limit}).then(response => {
          this.count = response.data.result.totalElements;
          this.tableData = [];
          response.data.result.content.forEach(item => {
            let tableDataItem = {};
            tableDataItem.id = item.id;
            tableDataItem.pointIndex = item.pointIndex;
            tableDataItem.req = item.require;
            tableDataItem.note = item.note;
            this.tableData.push(tableDataItem);
          });
        });
      } else {
        this.initData();
      }
    },

    loadReqOptions(){
      getAllReqs().then(response => {
        this.reqOptions = [];
        response.data.result.forEach(item => {
          let tableDataItem = {};
          tableDataItem.value = item.id;
          tableDataItem.name = item.name;
          tableDataItem.grade = item.grade.grade;
          this.reqOptions.push(tableDataItem);
        });
      });
    },
    querySearchReq(queryString, cb){
      var reqs = this.reqOptions;
      var results = queryString ? reqs.filter(this.creatFilterReq(queryString)) : reqs;
      cb(results);
    },
    creatFilterReq(queryString){
      return(req) => {
        return (req.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },

    // 分页相关
    handleCurrentChange(val){
      if(this.headForm.major || this.headForm.grade || this.headForm.req){
        this.currentPage = val;
        this.offset = (val - 1);
        this.handleSearch();
      } else {
        this.currentPage = val;
        this.offset = (val - 1);
        this.getPoints();
      }
    },
    handleSizeChange(val){
      console.log(`每页 ${val} 条`);
    },
  },
}
</script>
