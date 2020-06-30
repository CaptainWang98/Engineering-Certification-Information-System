<template>
  <div class="app-container">
    <el-form 
    :model="headForm" 
    :inline="true"
    class="demo-form-inline">
      <el-form-item>
        <el-input v-model="headForm.idText" placeholder="请输入课号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getStudentGoalScore()">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
    :data="tableData"
    border
    style="width=100%">
      <el-table-column label="学号" prop="student"></el-table-column>
      <el-table-column label="课程目标" prop="goalIndex"></el-table-column>
      <el-table-column label="个人达成值" prop="goalScore"></el-table-column>
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
  </div>
</template>

<script>
import { getStudentGoalScore } from "@/api/scores"

export default {
  data() {
    return {
      headForm: {idText: ''},
      listData: [],
      tableData: [],

      //分页相关
      count: 0,
      currentPage: 1,
      offset: 0,
      limit: 10,
    }
  },
  methods: {
    getStudentGoalScore(){
      if(this.headForm.idText){
        getStudentGoalScore({classId: this.headForm.idText}).then(response => {
          this.listData = [];
          response.data.result.forEach(item => {
            let tableDataItem = {};
            tableDataItem.goalIndex = item.goalIndex;
            tableDataItem.goalScore = item.goalScore;
            tableDataItem.student = item.student;
            this.listData.push(tableDataItem);
          });
          this.count = this.listData.length;
          this.changePage();
        })
      } else {
        this.listData = [];
        this.tableData = [];
        this.count = 0;
        this.currentPage = 1;
        this.offset = 0;
      }
    },

    changePage(){
      this.tableData = this.listData.filter((item, index) =>
        index < this.currentPage * this.limit && index >= this.limit * (this.currentPage - 1)
      )
    },

    handleCurrentChange(val){
      if(this.headForm.idText){
        this.currentPage = val;
        this.offset = (val - 1);
        this.changePage();
      } else {
        this.currentPage = val;
        this.offset = (val - 1);
        this.tableData = [];
      }
    },
    handleSizeChange(val){
      console.log(`每页 ${val} 条`);
    },
  },
}
</script>