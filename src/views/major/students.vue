<template>
  <div class="app-container">
    <el-form 
    :model="headForm" 
    :inline="true"
    >
      <el-form-item>
        <el-input v-model="headForm.idText" placeholder="请输入学号或姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch()">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus"  @click="handleAddStudent()">添加学生</el-button>
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
            <el-form-item label="性别">
              <span>{{ props.row.sex }}</span>
            </el-form-item>
            <el-form-item label="专业">
              <span>{{ props.row.major.name }}</span>
            </el-form-item>
            <el-form-item label="年级">
              <span>{{ props.row.grade.grade }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column 
      label="学号"
      prop="id"></el-table-column>
      <el-table-column 
      label="姓名"
      prop="name"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
          size="mini"
          type="primary"
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
    <el-dialog title="新增学生信息" :visible.sync="dialogAddFormVisible">
      <el-form :model="newStudent" :rules="rules" ref="addForm">
        <el-form-item label="学号" label-width="100px" prop="id">
          <el-input v-model="newStudent.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="100px" prop="name">
          <el-input v-model="newStudent.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="100px" prop="sex">
          <el-select 
          v-model="newStudent.sex" 
          placeholder="请选择性别"> 
            <el-option v-for="item in sexOptions" 
            :key="item"
            :label="item"
            :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级" label-width="100px" prop="grade">
          <el-select 
          v-model="newStudent.grade" 
          placeholder="请选择年级"> 
            <el-option v-for="item in gradeOptions" 
            :key="item.id"
            :label="item.grade"
            :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业" label-width="100px" prop="major">
          <el-select 
          v-model="newStudent.major" 
          placeholder="请选择专业">
            <el-option
            v-for="item in majorOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStudent()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改学生信息" :visible.sync="dialogEditFormVisible">
      <el-form :model="selectStudent" :rules="rules" ref="editForm">
        <el-form-item label="学号" label-width="100px" prop="id">
          <el-input v-model="selectStudent.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="100px" prop="name">
          <el-input v-model="selectStudent.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="100px" prop="sex">
          <el-select 
          v-model="selectStudent.sex" 
          placeholder="请选择性别"> 
            <el-option v-for="item in sexOptions" 
            :key="item"
            :label="item"
            :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级" label-width="100px" prop="grade">
          <el-select 
          v-model="selectStudent.grade" 
          placeholder="请选择年级"> 
            <el-option v-for="item in gradeOptions" 
            :key="item.id"
            :label="item.grade"
            :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业" label-width="100px" prop="major">
          <el-select 
          v-model="selectStudent.major" 
          placeholder="请选择专业">
            <el-option
            v-for="item in majorOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateStudent()">确 定</el-button>
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
import { getStudents, getStudentsCount, searchStudents, updateStudent, deleteStudent, addStudent } from '@/api/students'
import { getAllMajors } from '@/api/major'

export default {
  data() {
    return {
      headForm:  {},
      
      tableData: [],

      // 分页相关
      count: 0,
      currentPage: 1,
      offset: 0,
      limit: 10,

      // 编辑相关
      // selectedSex: null,
      sexOptions: ['男', '女'],
      // selectedMajor: null,
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
      // 是否显示编辑框
      dialogAddFormVisible: false,
      dialogEditFormVisible: false,
      dialogUploadFormVisible: false,

      rules: {
        id: [
          { required: true, message: '非空', trigger: 'blur' },
          { min:10, max:10,  message: '学号为10位', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        sex: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        grade: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        major: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
      },

      uploadUrl: process.env.VUE_APP_BASE_API + '/students/uploadStudents',
      downloadUrl: process.env.VUE_APP_BASE_API + '/students/uploadStudents',

      // 选中的专业的信息
      selectStudent: {
        id: '',
        name: '',
        sex: '',
        grade: '',
        major: '',
      },
      newStudent: {
        id: '',
        name: '',
        sex: '',
        grade: '',
        major: '',
      },
    }
  },
  created() {
    this.initData();
  },
  methods: {
    // 初始化数据
    initData(){
      getStudentsCount().then(response => {
        this.count = response.data.result;
        this.getStudents();
        this.getMajorOptions();
      });
    },
    getStudents(){
      getStudents({offset: this.offset, limit: this.limit}).then(response => {
        this.tableData = [];
        response.data.result.content.forEach(item => {
          let tableDataItem = {};
          tableDataItem.id = item.id;
          tableDataItem.name = item.name;
          tableDataItem.sex = item.sex;
          tableDataItem.grade = item.grade;
          tableDataItem.major = item.major;
          this.tableData.push(tableDataItem);
        });
      });
    },

    getMajorOptions(){
      this.majorOptions = [];
      getAllMajors().then(response =>{
        response.data.result.forEach(item => {
          let dataItem = {};
          dataItem.id = item.id;
          dataItem.name = item.name;
          dataItem.grade = item.grade;
          this.majorOptions.push(item);
        });
      });
    },

    handleSearch(){
      if(this.headForm.idText){
        this.currentPage = 1;
        searchStudents({search: this.headForm.idText, offset: this.offset, limit: this.limit}).then(response => {
          this.count = response.data.result.totalElements;
          this.tableData = [];
          response.data.result.content.forEach(item => {
            let tableDataItem = {};
            tableDataItem.id = item.id;
            tableDataItem.name = item.name;
            tableDataItem.sex = item.sex;
            tableDataItem.grade = item.grade;
            tableDataItem.major = item.major;
            this.tableData.push(tableDataItem);
          });
        });
      } else {
        this.initData();
      }
    },

    // 按钮相关
    handleEdit(row){
      this.selectStudent.id = row.id;
      this.selectStudent.name = row.name;
      this.selectStudent.sex = row.sex;
      this.selectStudent.grade = row.grade.id;
      this.selectStudent.major = row.major.id;
      this.dialogEditFormVisible = true;      
    },
    handleDelete(index, row){
      deleteStudent({id: row.id}).then(response => {
        this.$message({
          type: 'success',
          message: '删除成功'
        });
        this.tableData.splice(index, 1);
      });
    },
    updateStudent(){
      this.$refs['editForm'].validate(async (valid) => {
        if(valid){
          updateStudent(this.selectTable).then(response => {
            this.$message({
              type: 'success',
              message: '更新学生成功',
            })
            this.dialogEditFormVisible = false;
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

    handleAddStudent(){
      this.newStudent = {
        id: '',
        name: '',
        sex: '',
        grade: '',
        major: '',
      };
      this.dialogAddFormVisible = true;
    },
    addStudent(){
      let params = {
        id: this.newStudent.id,
        name: this.newStudent.name,
        sex: this.newStudent.sex,
        grade: this.newStudent.grade,
        major: {id: this.newStudent.major},
      };
      this.$refs['addForm'].validate((valid) => {
        if(valid){
          addStudent(params).then(response => {
            this.$message({
              type: 'success',
              message: '成功',
            })
            this.dialogAddFormVisible = false;
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

    // 分页相关
    handleCurrentChange(val){
      if(this.headForm.idText){
        this.currentPage = val;
        this.offset = (val - 1);
        this.handleSearch();
      } else {
        this.currentPage = val;
        this.offset = (val - 1);
        this.getStudents();
      }
    },
    handleSizeChange(val){
      console.log(`每页 ${val} 条`);
    },
  },
}
</script>
