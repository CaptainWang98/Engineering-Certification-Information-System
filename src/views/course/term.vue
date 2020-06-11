<template>
  <div class="app-container">
    <el-row>
      <el-col :span="14" :offset="4">
        <header class="form_header">学期管理</header>
        <el-table 
        :data="tableData"
        border>
          <el-table-column 
          label="序号" 
          type="index"></el-table-column>
          <el-table-column 
          label="名称"
          prop="name"></el-table-column>
          <el-table-column 
          label="开始日期"
          prop="start"></el-table-column>
          <el-table-column 
          label="结束日期"
          prop="end"></el-table-column>
          <el-table-column 
          label="操作">
            <template slot="header" slot-scope="scope">
              <el-button
              size="mini"
              @click="handleAdd()">添加</el-button>
            </template>
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
      </el-col>
    </el-row>
    
    <el-dialog title="编辑课程目标" :visible.sync="dialogEditVisible">
      <el-form :model="selectTable" :rules="rules" ref="editForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="selectTable.name" placeholder="例：2019-2020_2"></el-input>
        </el-form-item>
        <el-form-item label="开始日期" prop="start">
          <el-date-picker 
          v-model="selectTable.start" 
          placeholder="开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="end">
          <el-date-picker 
          v-model="selectTable.end" 
          placeholder="结束日期"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateTerm()">确 定</el-button>
      </div>
    </el-dialog>
    
    <el-dialog title="新增课程目标" :visible.sync="dialogAddVisible">
      <el-form :model="newTerm" :rules="rules" ref="addForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="newTerm.name" placeholder="例：2019-2020_2"></el-input>
        </el-form-item>
        <el-form-item label="开始日期" prop="start">
          <el-date-picker 
          v-model="newTerm.start" 
          placeholder="开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="end">
          <el-date-picker 
          v-model="newTerm.end" 
          placeholder="结束日期"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTerm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getTerms, addTerm, deleteTerm, updateTerm} from '@/api/term'

export default {
  data() {
    return {
      tableData: [],

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
      dialogEditVisible: false,
      dialogAddVisible: false,

      rules: {
        name: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        start: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        end: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
      },

      // 选中的专业的信息
      selectTable: {
        id: '',
        name: '',
        start: '',
        end: '',
      },
      newTerm: {
        name: '',
        start: '',
        end: '',
      },
    }
  },
  created(){
    this.initData();
  },
  methods: {
    initData(){
      this.getTerms();
    },
    handleAdd(){
      this.newTerm = {
        note: '',
        start: '',
        end: '',
      };
      this.dialogAddVisible = true;
    },
    handleEdit(row){
      this.selectTable.id = row.id;
      this.selectTable.name = row.name;
      this.selectTable.start = row.start;
      this.selectTable.end = row.end;
      this.dialogEditVisible = true;
    },
    // 未完成
    handleDelete(index, row){
      deleteTerm({id: row.id}).then(response => {
        this.$message({
          type: 'success',
          message: '删除成功'
        });
        this.tableData.splice(index, 1);
      });
    },
    addTerm(){
      this.$refs['addForm'].validate((valid) => {
        if(valid){
          addTerm(this.newTerm).then(response => {
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
    updateTerm(){
      this.$refs['editForm'].validate((valid) => {
        if(valid){
          updateTerm(this.selectTable).then(response => {
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
    getTerms(){
      getTerms().then(response => {
        this.tableData = [];
        response.data.result.forEach(item => {
          let tableDataItem = {};
          tableDataItem.id = item.id;
          tableDataItem.name = item.name;
          tableDataItem.start = item.start;
          tableDataItem.end = item.end;
          this.tableData.push(tableDataItem);
        });
      });
    },
  },
}
</script>
