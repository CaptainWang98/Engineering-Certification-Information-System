<template>
  <div class="app-container">
    <el-form 
    :model="headForm" 
    :inline="true"
    class="demo-form-inline">
      <el-form-item>
        <el-input v-model="headForm.idText" placeholder="请输入课程目或关键词等"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch()">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus" @click="handleAddGoal()">添加课程目标</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="dialogUploadFormVisible = true;">批量导入<i class="el-icon-upload el-icon--right"></i></el-button>
      </el-form-item>
    </el-form>
    <el-table 
    :data="tableData"
    border>
      <el-table-column 
      label="序号" 
      prop="goalIndex"></el-table-column>
      <el-table-column label="所属课程">
        <el-table-column label="课程代码" prop="subject.id"></el-table-column>
        <el-table-column label="课程名" prop="subject.name"></el-table-column>
      </el-table-column>
      <el-table-column 
      label="内容"
      prop="note"></el-table-column>
      <el-table-column 
      label="操作">
        <template slot-scope="scope">
          <el-button 
          size="mini" 
          type="success" 
          @click="handleSelect(scope.row)">管理支撑</el-button>
          <el-button
          size="mini"
          type="primary"
          @click="handleEditGoal(scope.row)">编辑</el-button>
          <el-button
          size="mini"
          type="danger"
          @click="handleDeleteGoal(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="新增课程目标" :visible.sync="dialogAddGoalVisible">
      <el-form :model="newGoal" :rules="rules" ref="addForm">
        <el-form-item label="序号" prop="goalIndex">
          <el-input v-model="newGoal.goalIndex" placeholder="例：1"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="note">
          <el-input v-model="newGoal.note" placeholder="请输入内容" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="所属课程" prop="subject">
          <el-autocomplete popper-class="my-autocomplete" v-model="newGoal.subject" placeholder="输入课程代码" :fetch-suggestions="querySearchSubject">
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
        <el-form-item label="支撑指标点" prop="point">
          <el-cascader 
          v-model="newGoal.point" 
          :options="pointOptions"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddGoalVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoal()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑课程目标" :visible.sync="dialogEditGoalVisible">
      <el-form :model="selectGoal" :rules="rules" ref="editForm">
        <el-form-item label="序号" prop="goalIndex">
          <el-input v-model="selectGoal.goalIndex" placeholder="例：1"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="note">
          <el-input v-model="selectGoal.note" placeholder="请输入内容" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="所属课程" prop="subject">
          <el-autocomplete popper-class="my-autocomplete" v-model="selectGoal.subject" placeholder="输入课程代码" :fetch-suggestions="querySearchSubject">
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
        <el-form-item label="支撑指标点" prop="point">
          <el-cascader 
          v-model="selectGoal.point" 
          :options="pointOptions"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditGoalVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateGoal()">确 定</el-button>
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
import { addGoal, deleteGoal, getGoals, getGoalsCount, updateGoaloal, searchGoals} from '@/api/goals'
import { getCascaderPoints, searchPoints } from '@/api/points'
import { getAllMajors } from '@/api/major'
import { searchReqs } from '@/api/reqs'
import { getAllSubjects } from '@/api/subjects'

export default {
  data() {
    return {
       /**
       * 分页相关
       */ 
      count: 0,
      currentPage: 1,
      offset: 0,
      limit: 10,

      headForm: {},

      subject: '',
      tableData: [],
      selectGoal: {
        id: '',
        point: {},
        subject: {},
        goalIndex: '',
        note: '',
      },
      newGoal: {
        point: '',
        subject: '',
        goalIndex: '',
        note: '',
      },

      subjectOptions: [],
      pointOptions: [],
      
      dialogAddGoalVisible: false,
      dialogEditGoalVisible: false,
      dialogUploadFormVisible: false,

      rules: {
        goalIndex: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        note: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        point: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        subject: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
      },

      uploadUrl: process.env.VUE_APP_BASE_API + '/subjectgoals/uploadGoals',
      downloadUrl: process.env.VUE_APP_BASE_API + '/subjectgoals/downloadGoalExcel',
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData(){
      try {
        this.getCount();
        this.getGoals();
        this.loadSubjectOptions();
        this.loadPointOptions();
      } catch (err) {
        console.log('获取数据失败', err);
      }
    },
    handleAddGoal(){
      this.newGoal = {
        point: '',
        subject: '',
        goalIndex: '',
        note: '',
      };
      this.dialogAddGoalVisible = true;
    },
    handleEditGoal(row){
      this.selectGoal = {
        id: row.id,
        point: row.point.id,
        subject: row.subject.id,
        goalIndex: row.goalIndex,
        note: row.note,
      };
      this.dialogEditGoalVisible = true;
    },
    // 未完成
    handleDeleteGoal(index, row){
      deleteGoal({id:row.id}).then(response => {
        this.$message({
          type: 'success',
          message: '删除成功'
        });
        this.tableData.splice(index, 1);
      });
    },

    handleSelect(row){
      this.$router.push({ path: 'subject-support', query: { 
        subjectId: this.subject,
        goalId: row.id,
       }})
    },
    
    // 未完成
    addGoal(){
      let params = {
        goalIndex: this.newGoal.goalIndex,
        note: this.newGoal.note,
        point: {id: this.newGoal.point[3]},
        subject: {id: this.newGoal.subject},
      };
      this.$refs['addForm'].validate(async (valid) => {
        if(valid){
          addGoal(params).then(response => {
            this.$message({
              type: 'success',
              message: '添加成功',
            });
            this.dialogAddGoalVisible = false;
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
    // 未完成
    
    // 未完成
    updateGoal(){
      this.$refs['editForm'].validate(async (valid) => {
        if(valid){
          updateGoal(this.selectGoal).then(response => {
            this.$message({
              type: 'success',
              message: '更新成功',
            });
            this.dialogEditGoalVisible = false;
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

    async getGoals(){
      getGoals({offset: this.offset, limit: this.limit}).then(response => {
        this.tableData = [];
        response.data.result.content.forEach(item => {
          let tableDataItem = {
            id: '',
            goalIndex: '',
            note: '',
            point: {},
            subject: {},
          };
          tableDataItem.id = item.id;
          tableDataItem.goalIndex = item.goalIndex;
          tableDataItem.note = item.note;
          tableDataItem.point = item.point;
          tableDataItem.subject = item.subject;
          this.tableData.push(tableDataItem);
        });
      });
    },

    getCount(){
      getGoalsCount().then(response => {
        this.count = response.data.result;
      });
    },

    async handleSearch(){
      if(this.headForm.idText){
        this.currentPage = 1;
        searchGoals({search: this.headForm.idText, offset: this.offset, limit: this.limit}).then(response => {
          this.count = response.data.result.totalElements;
          this.tableData = [];
          response.data.result.content.forEach(item => {
            let tableDataItem = {
              id: '',
              goalIndex: '',
              note: '',
              point: {},
              subject: {},
            };
            tableDataItem.id = item.id;
            tableDataItem.goalIndex = item.goalIndex;
            tableDataItem.note = item.note;
            tableDataItem.point = item.point;
            tableDataItem.subject = item.subject;
            this.tableData.push(tableDataItem);
          });
        });
      } else {
        this.initData();
      }
    },

    loadSubjectOptions(){
      getAllSubjects().then(response => {
        this.subjectOptions = [];
        response.data.result.forEach(item => {
          let optionItem = {};
          optionItem.value = item.id;
          optionItem.name = item.name;
          this.subjectOptions.push(optionItem);
        });
      });
    },
    querySearchSubject(queryString, cb){
      var subjects = this.subjectOptions;
      var results = queryString ? subjects.filter(this.creatFilterSubject(queryString)) : subjects;
      cb(results);
    },
    creatFilterSubject(queryString){
      return(subject) => {
        return (subject.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },

    loadPointOptions(){
      getCascaderPoints().then(response => {
        var jsonStr = JSON.parse(response.data.result);
        this.pointOptions = jsonStr;
        console.log(jsonStr);
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
        this.getGoals();
      }
    },
    handleSizeChange(val){
      console.log(`每页 ${val} 条`);
    },
  },
}
</script>
