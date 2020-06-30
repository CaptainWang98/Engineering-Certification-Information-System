<template>
  <div class="app-container">
    <el-form 
    :model="headForm" 
    :inline="true"
    class="demo-form-inline">
      <el-form-item>
        <el-input v-model="headForm.idText" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch()">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus" @click="handleAddCourse()">添加教师</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="dialogUploadFormVisible = true;">批量导入<i class="el-icon-upload el-icon--right"></i></el-button>
      </el-form-item>
    </el-form>
    <el-table
    :data="tableData"
    style="width=100%"
    border>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="职称">
              <span>{{ props.row.job }}</span>
            </el-form-item>
            <el-form-item label="毕业院校">
              <span>{{ props.row.school }}</span>
            </el-form-item>
            <el-form-item label="出生日期">
              <span>{{ props.row.born }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column 
      label="教师号" 
      prop="id">
      </el-table-column>
      <el-table-column
      label="姓名"
      prop="name">
      </el-table-column>
      <el-table-column 
      label="操作">
        <template slot-scope="scope">
          <el-button
          size="mini"
          @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="修改教师信息" :visible.sync="dialogEditVisible">
      <el-form :model="selectTable" :rules="rules" ref="editForm">
        <el-form-item label="教师号" label-width="100px" prop="id">
          <el-input v-model="selectTable.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="100px" prop="name">
          <el-input v-model="selectTable.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="职称" label-width="100px" prop="job">
          <el-input v-model="selectTable.job" auto-complete="off" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="毕业院校" label-width="100px" prop="school">
          <el-input v-model="selectTable.school" auto-complete="off" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" label-width="100px" prop="born">
          <el-date-picker 
          v-model="selectTable.born" 
          type="date" 
          placeholder="请选择生日"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateTeacher()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增教师" :visible.sync="dialogAddVisible">
      <el-form :model="newTeacher" :rules="rules" ref="addForm">
        <el-form-item label="教师号" label-width="100px" prop="id">
          <el-input v-model="newTeacher.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="100px" prop="name">
          <el-input v-model="newTeacher.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="职称" label-width="100px" prop="job">
          <el-input v-model="newTeacher.job" auto-complete="off" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="毕业院校" label-width="100px" prop="school">
          <el-input v-model="newTeacher.school" auto-complete="off" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" label-width="100px" prop="born">
          <el-date-picker 
          v-model="newTeacher.born" 
          type="date" 
          placeholder="请选择生日"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTeacher()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量上传教师信息" :visible.sync="dialogUploadFormVisible" width="23%">
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
import { getTeacherCount, addTeacher, deleteTeacher, getTeachers, updateTeacher, searchTeachers } from '@/api/teacher'

export default {
  data() {
    return {
      tableData: [],
      selectTable: {
        id: '',
        name: '',
        job: '',
        school: '',
        born: '',
      },
      newTeacher: {
        id: '',
        name: '',
        job: '',
        school: '',
        born: '',
      },

      headForm: {},

      /**
       * 分页相关
       */ 
      count: 0,
      currentPage: 1,
      offset: 0,
      limit: 10,

      dialogEditVisible: false,
      dialogAddVisible: false,
      dialogUploadFormVisible: false,

      uploadUrl: process.env.VUE_APP_BASE_API + '/course/uploadTeachers',
      downloadUrl: process.env.VUE_APP_BASE_API + '/teacher/downloadTeacherExcel',

      rules: {
        id: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        job: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        born: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        school: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
      },
    }
  },
  created(){
    this.initData();
  },
  methods: {
    initData(){
      getTeacherCount().then(response => {
        this.count = response.data.result;
        this.getTeachers()
      });
    },
    handleEdit(row){
      this.selectTable = {
        id: '',
        name: '',
        job: '',
        school: '',
        born: '',
      },
      this.selectTable.id = row.id;
      this.selectTable.name = row.name;
      this.selectTable.job = row.job;
      this.selectTable.born = row.born;
      this.selectTable.school = row.school;
      this.dialogEditVisible = true;
    },
    handleDelete(index, row){
      deleteTeacher({id: row.id}).then(response => {
        this.$message({
          type: 'success',
          message: '删除成功'
        });
        this.tableData.splice(index, 1);
        this.initData();
      });
    },
    handleAddCourse(){
      this.newTeacher = {
        id: '',
        name: '',
        job: '',
        school: '',
        born: '',
      };
      this.dialogAddVisible = true;
    },

    // 分页相关
    handleCurrentChange(val){
      if(this.headForm.idText){
        this.currentPage = val;
        this.offset = (val - 1);
        this.handleSearch();
      } else {
        this.currentPage = val;
        this.offset = (val - 1);
        this.getTeachers();
      }
    },
    handleSizeChange(val){
      console.log(`每页 ${val} 条`);
    },

    updateTeacher(){
      this.$refs['editForm'].validate((valid) => {
        if(valid){
          updateTeacher(this.selectTable).then(() => {
            this.$message({
              type: 'success',
              message: '更新成功',
            });
            this.dialogEditVisible = false;
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
    addTeacher(){
      this.$refs['addForm'].validate((valid) => {
        if(valid){
          addTeacher(this.newTeacher).then(() => {
            this.$message({
              type: 'success',
              message: '添加成功',
            });
            this.dialogAddVisible = false;
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
    async getTeachers(){
      getTeachers({offset: this.offset, limit: this.limit}).then(response => {
        this.tableData = [];
        response.data.result.content.forEach(item => {
          let tableDataItem = {};
          tableDataItem.id = item.id;
          tableDataItem.name = item.name;
          tableDataItem.job = item.job;
          tableDataItem.born = item.born;
          tableDataItem.school = item.school;
          this.tableData.push(tableDataItem);
        });
      });
    },
    async handleSearch(){
      if(this.headForm.idText){
        this.currentPage = 1;
        searchTeachers({search: this.headForm.idText, offset: this.offset, limit: this.limit}).then(response => {
          this.tableData = [];
          this.count = response.data.result.totalElements;
          response.data.result.content.forEach(item => {
            let tableDataItem = {};
            tableDataItem.id = item.id;
            tableDataItem.name = item.name;
            tableDataItem.job = item.job;
            tableDataItem.born = item.born;
            tableDataItem.school = item.school;
            this.tableData.push(tableDataItem);
          });
        });
      }
    },
  },
}
</script>
