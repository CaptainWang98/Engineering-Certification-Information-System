<template>
  <div class="app-container">
    <el-form 
    :model="headForm" 
    :inline="true">
      <el-form-item>
        <el-input v-model="headForm.idText" placeholder="请输入专业代码或专业名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch()">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus" @click="handleAddMajor()">添加专业</el-button>
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
            <el-form-item label="专业代码">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="专业名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="简介">
              <span>{{ props.row.note }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column 
      label="专业代码" 
      prop="id"></el-table-column>
      <el-table-column
      label="专业名"
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
    <el-dialog title="新增专业" :visible.sync="dialogAddFormVisible">
      <el-form :model="newMajor" ref='addForm' :rules='rules'>
        <el-form-item label="专业ID" label-width="100px" prop="id">
          <el-input v-model="newMajor.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="专业名称" label-width="100px" prop="name">
          <el-input v-model="newMajor.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介" label-width="100px" prop="name">
          <el-input v-model="newMajor.note" auto-complete="off" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMajor">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改专业信息" :visible.sync="dialogEditFormVisible">
      <el-form :model="selectTable" ref='editForm' :rules='rules'>
        <el-form-item label="专业ID" label-width="100px" prop="id">
          <el-input v-model="selectTable.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="专业名称" label-width="100px" prop="name">
          <el-input v-model="selectTable.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介" label-width="100px" prop="name">
          <el-input v-model="selectTable.note" auto-complete="off" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateMajor()">确 定</el-button>
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
import { addMajor, getMajor, getMajorCount, updateMajor, deleteMajor, searchMajors } from '@/api/major'

export default {
  data() {
    return {
      // 数据
      tableData: [],

      // 顶端表单
      headForm: {},

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
      dialogAddFormVisible: false,
      dialogEditFormVisible: false,
      dialogUploadFormVisible: false,

      uploadUrl: process.env.VUE_APP_BASE_API + '/major/uploadMajors',
      downloadUrl: process.env.VUE_APP_BASE_API + '/major/downloadMajorExcel',

      // 选中的专业的信息
      selectTable: {
        id: '',
        name: '',
        note: '',
      },
      newMajor: {
        id: '',
        name: '',
        note: '',
      },
      // 校验规则
      rules: {
        id: [
          { required: true, message: '非空', trigger: 'blur' },
          { min: 6, max: 7, message: '长度在 6 到 7 个字符', trigger: 'change' }
        ],
        name: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        note: []
      },
    }
  },

  created(){
    this.initData();
  },

  methods: {
    // 初始化
    initData(){
      try {
        this.getCount();
        this.getMajor();
      } catch (err) {
        console.log('获取数据失败', err);
      }
    },

    getCount(){
      getMajorCount().then(response => {

        if (response.status == 200){
          this.count = response.data.result;
        }else{
          throw new Error('获取数据失败');
        }
      });
    },

    // 获取专业
    getMajor(){
    getMajor({offset: this.offset, limit: this.limit}).then(response => {
        this.tableData = [];
        response.data.result.content.forEach(item => {
          let tableDataItem = {};
          tableDataItem.id = item.id;
          tableDataItem.name = item.name;
          tableDataItem.note = item.note;
          this.tableData.push(tableDataItem);
        });
      });
    },
    // 编辑相关
    handleAddMajor(){
      this.newMajor = {};
      this.dialogAddFormVisible = true;
    },

    // 选择按钮
    handleSelect(index, row){
      this.$router.push({ path: 'major-req', query: { 
        id: row.id,
        name: row.name,
        note: row.note,
       }})
    },

    // 编辑按钮
    handleEdit(row){
      this.selectTable.id = row.id;
      this.selectTable.name = row.name;
      this.selectTable.note = row.note;
      this.dialogEditFormVisible = true;      
    },
  
    // 删除按钮
    handleDelete(index, row){
      deleteMajor({id: row.id}).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        });
        this.tableData.splice(index, 1);
        this.getCount();
      });  
    },

    async handleSearch(){
      if(this.headForm.idText){
        this.currentPage = 1;
        searchMajors({search: this.headForm.idText, offset: this.offset, limit: this.limit}).then(response => {
          this.count = response.data.result.totalElements;
          this.tableData = [];
          response.data.result.content.forEach(item => {
            let tableDataItem = {};
            tableDataItem.id = item.id;
            tableDataItem.name = item.name;
            tableDataItem.note = item.note;
            this.tableData.push(tableDataItem);
          });
        });
      } else {
        this.initData();
      }
    },

    addMajor(){
      this.$refs['addForm'].validate(async (valid) => {
        if(valid){
          addMajor(this.newMajor).then(() => {
            this.$message({
              type: 'success',
              message: '添加成功'
            });
            this.initData();
          });
        }
      });
    },

    async updateMajor(){
      this.$refs['editForm'].validate(async (valid) => {
          updateMajor(this.selectTable).then(response => {
            this.$message({
              type: 'success',
              message: '更新专业成功',
            });
            this.dialogFormVisible = false;
            this.initData();
          });
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
        this.getMajor();
      }
    },
    handleSizeChange(val){
      console.log(`每页 ${val} 条`);
    },
  },
}
</script>