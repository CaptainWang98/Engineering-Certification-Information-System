<template>
  <div class="app-container">
    <el-form 
    :model="headForm" 
    :inline="true"
    class="demo-form-inline">
      <el-form-item>
        <el-input v-model="headForm.idText" placeholder="请输入课程代码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch()">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus" @click="handleAdd()">添加课程</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="dialogUploadFormVisible = true;">批量导入<i class="el-icon-upload el-icon--right"></i></el-button>
      </el-form-item>
    </el-form>
    <el-table
    :data="tableData"
    border
    style="width=100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="课程代码">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="课程名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="学时">
              <span>{{ props.row.hour }}</span>
            </el-form-item>
            <el-form-item label="学分">
              <span>{{ props.row.credit }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column 
      label="课程代码" 
      prop="id">
      </el-table-column>
      <el-table-column
      label="课程名称"
      prop="name">
      </el-table-column>
      <el-table-column 
      label="操作">
        <template slot-scope="scope">
          <el-button
          size="mini"
          @click="handleSelect(scope.$index, scope.row)">选择</el-button>
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
    <el-dialog title="添加课程" :visible.sync="dialogAddFormVisible">
      <el-form :model="newSubject" :rules="rules" ref="addForm">
        <el-form-item label="课程代码" label-width="100px" prop="id">
          <el-input v-model="newSubject.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程名称" label-width="100px" prop="name">
          <el-input v-model="newSubject.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学时" label-width="100px" prop="hour">
          <el-input v-model="newSubject.hour" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学分" label-width="100px" prop="credit">
          <el-input v-model="newSubject.credit" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubject()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改课程信息" :visible.sync="dialogEditFormVisible">
      <el-form :model="selectSubject" :rules="rules" ref="editForm">
        <el-form-item label="课程代码" label-width="100px" prop="id">
          <el-input v-model="selectSubject.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程名称" label-width="100px" prop="name">
          <el-input v-model="selectSubject.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学时" label-width="100px" prop="hour">
          <el-input v-model="selectSubject.hour" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学分" label-width="100px" prop="credit">
          <el-input v-model="selectSubject.credit" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateSubject()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量上传专业" :visible.sync="dialogUploadFormVisible" width="23%">
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
import {getSubjectCount, getSubjects, addSubject, deleteSubject, updateSubject, searchSubjects} from '@/api/subjects'

export default {
  data() {
    return {
      headForm: {},
      tableData: [],
      uploadUrl: process.env.VUE_APP_BASE_API + '/subjects/uploadSubjects',
      downloadUrl: process.env.VUE_APP_BASE_API + '/subjects/downloadSubjectExcel',

      /**
       * 分页相关
       */ 
      count: 0,
      currentPage: 1,
      offset: 0,
      limit: 10,

      /**
       * 编辑框相关
       */
      // 是否显示编辑框
      dialogEditFormVisible: false,
      dialogAddFormVisible: false,
      dialogUploadFormVisible: false,

      rules: {
        id: [
          { required: true, message: '非空', trigger: 'blur' },
          { min:6, max:6,  message: '课程代码至少6位', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        credit: [
          { required: true, message: '非空', trigger: 'blur' },
          { tyoe: 'number', message: '请输入数字', trigger: 'blur' },
        ],
        hour: [
          { required: true, message: '非空', trigger: 'blur' },
          { tyoe: 'number', message: '请输入数字', trigger: 'blur' },
        ],
      },

      // 选中的专业的信息
      selectSubject: {
        id: '',
        name: '',
        hour: 0,
        credit: 0,
      },
      newSubject: {
        id: '',
        name: '',
        hour: 0,
        credit: 0,
      },
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData(){
      getSubjectCount().then(response => {
        this.count = response.data.result;
        this.getSubjects()
      });
    },

    handleEdit(row){
      this.selectSubject.id = row.id;
      this.selectSubject.name = row.name;
      this.selectSubject.hour = row.hour;
      this.selectSubject.credit = row.credit;
      this.dialogEditFormVisible = true;
    },
    handleAdd(){
      this.newSubject.id = '';
      this.newSubject.name = '';
      this.newSubject.hour = 0;
      this.newSubject.credit = 0;
      this.dialogAddFormVisible = true;
    },
    addSubject(){
      this.$refs['addForm'].validate((valid) => {
        if(valid){
            addSubject(this.newSubject).then(response => {
              this.$message({
                type: 'success',
                message: '成功',
              });
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

    handleSelect(index, row){
      this.$router.push({ path: 'subject-goal', query: { 
        id: row.id,
       }})
    },
    handleDelete(index, row){
      deleteSubject({id: row.id}).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.tableData.splice(index, 1);
      }); 
    },
    updateSubject(){
      this.$refs[formName].validate((valid) => {
        if(valid){
          updateSubject(this.selectSubject).then(response => {
            this.$message({
              type: 'success',
              message: '更新课程成功',
            });
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

    async handleSearch(){
      if(this.headForm.idText){
        this.currentPage = 1;
        searchSubjects({search: this.headForm.idText, offset: this.offset, limit: this.limit}).then(response => {
          this.count = response.data.result.totalElements;
          this.tableData = [];
          response.data.result.content.forEach(item => {
            let tableDataItem = {};
            tableDataItem.id = item.id;
            tableDataItem.name = item.name;
            tableDataItem.hour = item.hour;
            tableDataItem.credit = item.credit;
            this.tableData.push(tableDataItem);
          });
        });
      } else {
        this.initData();
      }
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
        this.getSubjects();
      }
    },
    handleSizeChange(val){
      console.log(`每页 ${val} 条`);
    },
    getSubjects(){
      getSubjects({offset: this.offset, limit: this.limit}).then(response => {
        this.tableData = [];
        response.data.result.content.forEach(item => {
          let tableDataItem = {};
          tableDataItem.id = item.id;
          tableDataItem.name = item.name;
          tableDataItem.hour = item.hour;
          tableDataItem.credit = item.credit;
          this.tableData.push(tableDataItem);
        });
      });
    },
  },
}
</script>
