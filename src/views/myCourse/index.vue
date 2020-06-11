<template>
  <div class="app-container">
    <el-table
    :data="tableData"
    style="width=100%"
    border>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="课程代码">
              <span>{{ props.row.subject.id }}</span>
            </el-form-item>
            <el-form-item label="任课教师">
              <span>{{ props.row.teacher.name }}</span>
            </el-form-item>
            <el-form-item label="开始周">
              <span>{{ props.row.startWeek }}</span>
            </el-form-item>
            <el-form-item label="结束周">
              <span>{{ props.row.endWeek }}</span>
            </el-form-item>
            <el-form-item label="学期">
              <span>{{ props.row.term.name }}</span>
            </el-form-item>
            <el-form-item label="所属专业">
              <span>{{ props.row.major }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column 
      label="课号" 
      prop="id">
      </el-table-column>
      <el-table-column
      label="开课名"
      prop="name">
      </el-table-column>
      <el-table-column 
      label="操作">
        <template slot-scope="scope">
          <el-button
          size="mini"
          @click="handleDetail(scope.row)">详情</el-button>
          <el-button
          size="mini"
          @click="handleDownload(scope.row)">下载</el-button>
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
    <el-dialog title="修改开课信息" :visible.sync="dialogEditVisible">
      <el-form :model="selectTable" :rules="rules" ref="editForm">
        <el-form-item label="自定义课号" label-width="100px" prop="id">
          <el-input v-model="selectTable.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="自定义开课名" label-width="100px" prop="name">
          <el-input v-model="selectTable.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程代码" label-width="100px" prop="subjectId">
          <el-autocomplete popper-class="my-autocomplete" v-model="selectTable.subject" placeholder="输入课程代码" :fetch-suggestions="querySearchSubject">
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
        <el-form-item label="所属专业" label-width="100px" prop="majorId">
          <el-autocomplete popper-class="my-autocomplete" v-model="selectTable.major" placeholder="输入专业代码" :fetch-suggestions="querySearchMajor">
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
        <el-form-item label="任课教师" label-width="100px" prop="teacherId">
          <el-autocomplete popper-class="my-autocomplete" v-model="selectTable.teacher" placeholder="输入教师号" :fetch-suggestions="querySearchTeacher">
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
        <el-form-item label="周数" label-width="100px">
          <el-col :span="6">
            <el-input v-model="selectTable.start" placeholder="开始周"></el-input>
          </el-col>
          <el-col class="line" :span="1">----</el-col>
          <el-col :span="6">
            <el-input v-model="selectTable.end" placeholder="结束周"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="学期" label-width="100px" prop="termId">
          <el-autocomplete popper-class="my-autocomplete" v-model="selectTable.term" placeholder="例2014-2015_1" :fetch-suggestions="querySearchTerm">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCourse()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增开课" :visible.sync="dialogAddVisible">
      <el-form :model="newCourse" :rules="rules" ref="addForm">
        <el-form-item label="自定义课号" label-width="100px" prop="id">
          <el-input v-model="newCourse.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="自定义开课名" label-width="100px" prop="name">
          <el-input v-model="newCourse.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程代码" label-width="100px" prop="subjectId">
          <el-autocomplete popper-class="my-autocomplete" v-model="newCourse.subject" placeholder="输入课程代码" :fetch-suggestions="querySearchSubject">
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
        <el-form-item label="所属专业" label-width="100px" prop="major">
          <el-autocomplete popper-class="my-autocomplete" v-model="newCourse.major" placeholder="输入专业代码" :fetch-suggestions="querySearchMajor">
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
        <el-form-item label="任课教师" label-width="100px" prop="teacherId">
          <el-autocomplete popper-class="my-autocomplete" v-model="newCourse.teacher" placeholder="输入教师号" :fetch-suggestions="querySearchTeacher">
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
        <el-form-item label="周数" label-width="100px">
          <el-col :span="6">
            <el-input v-model="newCourse.start" placeholder="开始周"></el-input>
          </el-col>
          <el-col class="line" :span="1">----</el-col>
          <el-col :span="6">
            <el-input v-model="newCourse.end" placeholder="结束周"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="学期" label-width="100px" prop="termId">
          <el-autocomplete popper-class="my-autocomplete" v-model="newCourse.term" placeholder="例2014-2015_1" :fetch-suggestions="querySearchTerm">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCourse()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量上传开课" :visible.sync="dialogUploadFormVisible" width="23%">
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
import { downloadReport, getCourseCount , addCourse, deleteCourse, getCourses, updateCourse, searchCourses, getCoursesByTeacher } from '@/api/course'
import { getAllSubjects } from '@/api/subjects'
import { getTerms } from '@/api/term'
import { getAllTeachers } from '@/api/teacher'
import { getAllMajors } from '@/api/major'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      headForm: {idText: ''},

      tableData: [],
      selectTable: {},
      newCourse: {
        id: '',
        name: '',
        subject: '',
        major: '',
        teacher: '',
        term: '',
        start: '',
        end: '',
      },

      subjects: [],
      teachers: [],
      majors: [],
      terms: [],

      /**
       * 分页相关
       */ 
      count: 0,
      currentPage: 1,
      offset: 0,
      limit: 10,

      uploadUrl: process.env.VUE_APP_BASE_API + '/class/uploadClasses',
      downloadUrl: process.env.VUE_APP_BASE_API + '/class/downloadClassExcel',

      dialogEditVisible: false,
      dialogAddVisible: false,
      dialogUploadFormVisible: false,

      rules: {
        id: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        majorId: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        subjectId: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        teacherId: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        termId: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        start: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
        end: [
          { required: true, message: '非空', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created(){
    this.initData();
  },
  methods: {
    initData(){
      // getCourseCount().then(response => {
      //   this.count = response.data.result;
        this.getCourses();
        // this.loadSubjectOptions();
        // this.loadTeacherOptions();
        // this.loadMajorOptions();
        // this.loadTermOptions();
      // });
    },

    handleAdd(){
      this.newCourse = {
        id: '',
        name: '',
        subjectId: '',
        major: '',
        teacherId: '',
        termId: '',
        start: '',
        end: '',
      },
      this.dialogAddVisible = true;
    },
    handleEdit(row){
      this.selectTable = {
        id: row.id,
        name: row.name,
        teacher: row.teacher.id,
        subject: row.subject.id,
        major: row.major,
        start: row.startWeek,
        end: row.endWeek,
        term: row.term.id,
      };
      this.dialogEditVisible = true;
    },
    handleDetail(row){
      this.$router.push({ path: 'detail', query: { courseId: row.id, subjectId: row.subject.id }}); //, query: { courseId: row.id, subjectId: row.subject.id }
    },

    handleDelete(index, row){
      deleteCourse({id: row.id}).then(response => {
        this.$message({
          type: 'success',
          message: '删除成功'
        });
        this.tableData.splice(index, 1);
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
        this.getCourses();
      }
    },
    handleSizeChange(val){
      console.log(`每页 ${val} 条`);
    },

    async getCourses(){
      getCoursesByTeacher({search: this.$store.getters.name, offset: this.offset, limit: this.limit}).then(response => {
        console.log(response);
        
        this.tableData = [];
        this.count = response.data.result.totalElements;
        response.data.result.content.forEach(item => {
          let tableDataItem = {};
          tableDataItem.id = item.id;
          tableDataItem.name = item.name;
          tableDataItem.teacher = item.teacher;
          tableDataItem.subject = item.subject;
          tableDataItem.startWeek = item.start;
          tableDataItem.endWeek = item.end;
          tableDataItem.term = item.term;
          this.tableData.push(tableDataItem);
        });
      });
    },

    async handleSearch(){
      if(this.headForm.idText){
        this.currentPage = 1;
        searchCourses({search: this.headForm.idText, offset: this.offset, limit: this.limit}).then(response => {
          this.tableData = [];
          response.data.result.content.forEach(item => {
            let tableDataItem = {};
            tableDataItem.id = item.id;
            tableDataItem.name = item.name;
            tableDataItem.teacher = item.teacher;
            tableDataItem.subject = item.subject;
            tableDataItem.startWeek = item.start;
            tableDataItem.endWeek = item.end;
            tableDataItem.term = item.term;
            this.tableData.push(tableDataItem);
          });
        });
      }
    },

    updateCourse(){
      this.$refs['editForm'].validate((valid) => {
        if(valid){
          updateCourse(this.selectTable).then(response => {
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

    addCourse(){
      let params = {
        id: this.newCourse.id,
        name: this.newCourse.name,
        major: this.newCourse.major,
        subject: {id: this.newCourse.subject},
        teacher: {id: this.newCourse.teacher},
        start: this.newCourse.start,
        end: this.newCourse.end,
        term: {id: this.newCourse.term}
      }
      this.$refs['addForm'].validate((valid) => {
        if(valid){
          addCourse(params).then(response => {
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

    loadSubjectOptions(){
        getAllSubjects().then(response => {
          response.data.result.forEach(item => {
            let optionItem = {};
            optionItem.value = item.id;
            optionItem.name = item.name;
            this.subjects.push(optionItem);
          });
        });
    },
    querySearchSubject(queryString, cb){
      var subjects = this.subjects;
      var results = queryString ? subjects.filter(this.creatFilterSubject(queryString)) : subjects;
      cb(results);
    },
    creatFilterSubject(queryString){
      return(subject) => {
        return (subject.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    
    loadTeacherOptions(){
      getAllTeachers().then(response => {
        response.data.result.forEach(item => {
          let optinItem = {};
          optinItem.value = item.id;
          optinItem.name = item.name;
          this.teachers.push(optinItem);
        });
      });
    },
    querySearchTeacher(queryString, cb){
      var teachers = this.teachers;
      var results = queryString ? teachers.filter(this.creatFilterTeacher(queryString)) : teachers;
      cb(results);
    },
    creatFilterTeacher(queryString){
      return(teacher) => {
        return (teacher.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },

    loadMajorOptions(){
        getAllMajors().then(response => {
          this.majors = [];
          response.data.result.forEach(item => {
            let optinItem = {};
            optinItem.value = item.id;
            optinItem.name = item.name;
            this.majors.push(optinItem);
          });
        });
    },
    querySearchMajor(queryString, cb){
      var majors = this.majors;
      var results = queryString ? majors.filter(this.createFilterMajor(queryString)) : majors;
      cb(results);
    },
    createFilterMajor(queryString){
      return(major) => {
        return (major.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },

    loadTermOptions(){
      getTerms().then(response => {
        this.terms = [];
        response.data.result.forEach(item => {
          let optinItem = {};
          optinItem.value = item.id;
          optinItem.name = item.name;
          this.terms.push(optinItem);
        });
      });
    },
    querySearchTerm(queryString, cb){
      var terms = this.terms;
      var results = queryString ? terms.filter(this.createFilterTerm(queryString)) : terms;
      cb(results);
    },
    createFilterTerm(queryString){
      return(term) => {
        return (term.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },

    handleDownload(row){
      downloadReport({id: row.id}).then(response => {
        this.$message({
        type: 'success',
        message: '下载成功',
        }); 
        let blob = new Blob([response.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
          const fileName = row.id + '课程目标达成情况';
        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = fileName; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
      });
    }
  },
}
</script>
