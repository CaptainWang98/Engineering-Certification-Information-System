<template>
  <div class="app-container">
    <el-form 
    :model="headForm" 
    :inline="true"
    >
      <el-form-item>
        <el-input v-model="headForm.idText" placeholder="请输入毕业要求代码或专业代码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch()">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus" @click="dialogAddFormVisible = true;">添加毕业要求</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="dialogUploadFormVisible = true;">批量导入<i class="el-icon-upload el-icon--right"></i></el-button>
      </el-form-item>
    </el-form>
    <el-table
    :data="tableData"
    border
    style="width: 100%"
    >
      <el-table-column
        label="序号"
        prop="reqIndex">
      </el-table-column>
      <el-table-column
        label="所属专业"
        prop="major.name">
      </el-table-column>
      <el-table-column
        label="年级"
        prop="grade.grade">
      </el-table-column>
      <el-table-column
        label="名称"
        prop="name">
      </el-table-column>
      <el-table-column
        label="内容"
        prop="note">
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-button
            size="mini"
            @click="handleAddReq()">添加</el-button>
        </template>
        <template slot-scope="scope">
          <el-button
          size="mini"
          @click="handleShowPoint(scope.row)">下载报告</el-button>
          <el-button
          size="mini"
          @click="handleShowSupport(scope.row)">支撑课程</el-button>
          <el-button
          size="mini"
          type="primary"
          @click="handleEditReq(scope.row)">编辑</el-button>
          <el-button
          size="mini"
          type="danger"
          @click="handleDeleteReq(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="修改毕业要求" :visible.sync="dialogEditFormVisible">
      <el-form :model="selectReq" ref="editForm" :rules="rules">
        <el-form-item label="序号" label-width="100px" prop="index">
          <el-input v-model="selectReq.reqIndex" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属专业" label-width="100px" prop="major">
          <el-autocomplete popper-class="my-autocomplete" v-model="selectReq.major.id" :fetch-suggestions="querySearch" placeholder="输入所属专业">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.name }}</div>
              <span class="addr">{{ item.value }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="年级" label-width="100px" prop="grade">
          <el-select v-model="selectReq.grade.id" placeholder="选择年级">
            <el-option 
            v-for="item in gradeOptions" 
            :key="item.id"
            :label="item.grade"
            :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" label-width="100px" prop="name">
          <el-input v-model="selectReq.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" label-width="100px" prop="note">
          <el-input v-model="selectReq.note" auto-complete="off" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleConcelEdit">取 消</el-button>
        <el-button type="primary" @click="updateReqs()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加毕业要求" :visible.sync="dialogAddFormVisible">
      <el-form :model="newReq" ref="addForm" :rules="rules">
        <el-form-item label="序号" label-width="100px" prop="reqIndex">
          <el-input v-model="newReq.reqIndex" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属专业" label-width="100px" prop="major">
          <el-autocomplete popper-class="my-autocomplete" v-model="newReq.major.id" :fetch-suggestions="querySearch" placeholder="输入所属专业">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix">
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.name }}</div>
              <span class="addr">{{ item.value }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="年级" label-width="100px" prop="grade">
          <el-select v-model="newReq.grade.id" placeholder="选择年级">
            <el-option 
            v-for="item in gradeOptions" 
            :key="item.id"
            :label="item.grade"
            :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" label-width="100px" prop="name">
          <el-input v-model="newReq.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" label-width="100px" prop="note">
          <el-input v-model="newReq.note" auto-complete="off" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addReqs()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量上传毕业要求" :visible.sync="dialogUploadFormVisible">
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
import { downloadReqReport, addReqs, getReqs, getReqCount, searchReqs, deleteReq, updateReqs } from '@/api/reqs'
import { getAllMajors } from '@/api/major'

export default {
  data() {
    return {
      tableData: [],
      headForm: {},

      selectReq:{
        id: '',
        reqIndex: '',
        grade: {id: '', grade: ''},
        major: {id: '', name: '', note: ''},
        name: '',
        note: '',
      },
      newReq: {
        reqIndex: '',
        grade: {id: ''},
        major: {id: ''},
        name: '',
        note: '',
      },

      dialogEditFormVisible: false,
      dialogAddFormVisible: false,
      dialogUploadFormVisible: false,

      rules: {
        reqIndex: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        major: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        grade: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        note: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
      },

      majorOptions: [],
      gradeOptions: [
        {id: '1', grade: '2016'},
        {id: '2', grade: '2017'},
        {id: '3', grade: '2018'},
        {id: '4', grade: '2019'},
        {id: '5', grade: '2015'},
        {id: '6', grade: '2014'},
        {id: '7', grade: '2013'},
        {id: '8', grade: '2012'},
      ],

      uploadUrl: process.env.VUE_APP_BASE_API + '/reqs/uploadReqs',
      downloadUrl: process.env.VUE_APP_BASE_API + '/reqs/downloadReqExcel',
      updateReqs:[],

      major: {
        id: '',
        name: '',
        note: '',
        grade: '',
      },
      
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
    // this.getRouterQuery();
  },
  methods: {
    // 初始化
    initData(){
      // 先获得数据条数，然后调用获取数据函数
      this.getCount();
      this.getReqs();
      this.getOptions();
    },

    getCount(){
      getReqCount().then(response => {
        this.count = response.data.result;
      });
    },

    // 获取
    getReqs(){
      getReqs({offset: this.offset, limit: this.limit}).then(response => {
        this.tableData = [];
        let tableDataItem = {
          id: '',
          reqIndex: '',
          major: {},
          name: '',
          note: '',
          grade: {},
        };
        response.data.result.content.forEach(item => {
          tableDataItem.id = item.id;
          tableDataItem.reqIndex = item.reqindex;
          tableDataItem.major = item.major;
          tableDataItem.name = item.name;
          tableDataItem.note = item.note;
          tableDataItem.grade = item.grade;
          this.tableData.push(tableDataItem);
          // this.sendReqs.push(item.id);
        });
      });
    },
    
    // 增
    handleAddReq(){
      this.newReq = {
        reqIndex: '',
        major: {id: ''},
        grade: {id: ''},
        name: '',
        note: '',
      };
      this.dialogAddFormVisible = true;
    },
    addReqs(){
      this.$refs['addForm'].validate((valid) => {
        if(valid){
          addReqs(this.newReq).then(() => {
            this.$message({
              type: 'success',
              message: '新增成功'
            });
            this.dialogAddFormVisible = false;
            this.newReq = {};
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
    
    // 删
    handleDeleteReq(index, row){
        deleteReq({id: row.id}).then(() => {
          this.$message({
              type: 'success',
              message: '删除成功'
          });
          this.tableData.splice(index, 1);
        });
    },
    
    // 改
    handleEditReq(row){
      this.selectReq.id = row.id;
      this.selectReq.reqIndex = row.reqIndex;
      this.selectReq.name = row.name;
      this.selectReq.note = row.note;
      this.selectReq.grade.id = row.grade.id;
      this.selectReq.grade.grade = row.grade.grade;
      this.selectReq.major.id = row.major.id;
      this.selectReq.major.name = row.major.name;
      this.selectReq.major.note = row.major.note;
      this.dialogEditFormVisible = true;
    },
    updateReq(){
      this.$refs['editForm'].validate((valid) => {
        if(valid){
          updateReqs(this.selectReq).then(() => {
            this.$message({
                type: 'success',
                message: '修改成功'
            });
            this.selectReq = {};
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
    handleConcelEdit(){
      this.dialogEditFormVisible = false;
    },
    
    // 查
    handleSearch(){
      if(this.headForm.idText){
        this.currentPage = 1;
        searchReqs({search: this.headForm.idText, offset: this.offset, limit: this.limit}).then(response => {
          this.count = response.data.result.totalElements;
          this.tableData = [];
          response.data.result.content.forEach(item => {
            let tableDataItem = {};
            tableDataItem.id = item.id;
            tableDataItem.reqIndex = item.reqindex;
            tableDataItem.name = item.name;
            tableDataItem.grade = item.grade;
            tableDataItem.major = item.major;
            tableDataItem.note = item.note;
            this.tableData.push(tableDataItem);
          });
        });
      } else {
        this.initData();
      }
    },

    // 选项
    getOptions(){
      getAllMajors().then(response => {
        this.majorOptions = [];
        response.data.result.forEach(item => {
          let tableDataItem = {};
          tableDataItem.value = item.id;
          tableDataItem.name = item.name;
          tableDataItem.grade = item.grade;
          this.majorOptions.push(tableDataItem);
        });
      });
    },
    querySearch(queryString, cb){
      this.getOptions(); 
      var result = queryString ? this.majorOptions.filter(this.createFilter(queryString)) : this.majorOptions;
      cb(result);
    },
    createFilter(queryString){
      return(option) => {
        return (option.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    // 分页
    handleCurrentChange(val){
      if(this.headForm.idText){
        this.currentPage = val;
        this.offset = (val - 1);
        this.handleSearch();
      } else {
        this.currentPage = val;
        this.offset = (val - 1);
        this.getReqs();
      }
    },
    handleSizeChange(val){
      console.log(`每页 ${val} 条`);
    },

    // 特殊按钮
    handleShowPoint(row){
      downloadReqReport({id: row.id}).then(response => {
        if(!response.data){
          this.$message({
            type: 'error',
            message: '下载失败',
          });
        } else {
          let blob = new Blob([response.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
          const fileName = row.id + '毕业要求达成情况';
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = fileName; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
          this.$message({
          type: 'success',
          message: '下载成功',
          });
        }
      });
    },
    handleShowSupport(row){
      this.$router.push({path: 'major-support', query: {id: row.id}});
    }
  },
}
</script>