<template>
  <div class="app-container">
    <el-tabs class="table_container">
      <el-tab-pane label="评价环节">
        <div class="table_container">
          <el-table
            :data="tableEval"
            style="width=100%"
            border
          >
            <el-table-column
              label="序号"
              type="index"
            />
            <el-table-column
              label="类型"
              prop="type"
            />
            <el-table-column
              label="满分"
              prop="score"
            />
            <el-table-column label="操作">
              <template slot="header" slot-scope="scope">
                <el-button type="success" size="mini" @click="handleAddEval()">添加</el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEditEval(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDeleteEval(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog title="新增评价环节" :visible.sync="dialogAddEvalVisible">
            <el-form ref="addEvalForm" :model="newEval" :rules="evalRules">
              <el-form-item label="类型" label-width="100px" prop="type">
                <el-select v-model="newEval.type" placeholder="请选择">
                  <el-option
                    v-for="item in this.evalOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="满分" label-width="100px" prop="score">
                <el-input v-model.number="newEval.score" type="number" auto-complete="off" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogAddEvalVisible = false">取 消</el-button>
              <el-button type="primary" @click="addEval()">确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog title="修改评价环节" :visible.sync="dialogEditEvalVisible">
            <el-form ref="editEvalForm" :model="selectEval" :rules="evalRules">
              <el-form-item label="类型" label-width="100px" prop="type">
                <el-select v-model="selectEval.type" placeholder="请选择">
                  <el-option
                    v-for="item in this.evalOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="满分" label-width="100px" prop="score">
                <el-input v-model="selectEval.score" type="number" auto-complete="off" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogEditEvalVisible = false">取 消</el-button>
              <el-button type="primary" @click="updateEval()">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-tab-pane>
      <el-tab-pane label="对应关系">
        <div class="table_container">
          <el-table
            :data="tableE2G"
            style="width=100%"
            border
          >
            <el-table-column
              label="序号"
              prop="e2gindex"
            />
            <el-table-column
              label="评价环节"
              prop="eval.type"
            />
            <el-table-column
              label="课程目标"
              prop="subjectGoal.note"
            />
            <el-table-column
              label="比例"
              prop="percentage"
            />
            <el-table-column label="操作">
              <template slot="header" slot-scope="scope">
                <el-button type="success" size="mini" @click="handleAddE2G()">添加</el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEditE2G(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDeleteE2G(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog title="新增对应关系" :visible.sync="dialogAddE2GVisible">
            <el-form ref="addE2GForm" :model="newE2G" :rules="E2GRules">
              <el-form-item label="序号" label-width="100px" prop="e2gindex">
                <el-input v-model="newE2G.e2gindex" auto-complete="off" />
              </el-form-item>
              <el-form-item label="课程目标" label-width="100px" prop="subjectGoal">
                <el-autocomplete v-model="newE2G.subjectGoal" popper-class="my-autocomplete" placeholder="输入课程目标序号" :fetch-suggestions="querySearchSubjectGoal">
                  <i
                    slot="suffix"
                    class="el-icon-edit el-input__icon"
                  />
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.goalIndex }}</div>
                    <span class="addr">{{ item.note }}</span>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <el-form-item label="评价环节" label-width="100px" prop="eval">
                <el-select v-model="newE2G.eval" placeholder="请选择">
                  <el-option
                    v-for="item in tableEval"
                    :key="item.id"
                    :label="item.type"
                    :value="item.id"
                  >
                    <span style="float: left">{{ item.type }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.score }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="支撑占比" label-width="100px" prop="percentage">
                <el-input-number v-model.number="newE2G.percentage" step="0.001" type="number" auto-complete="off" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogAddE2GVisible = false">取 消</el-button>
              <el-button type="primary" @click="addE2G()">确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog title="编辑对应关系" :visible.sync="dialogEditE2GVisible">
            <el-form ref="editE2GForm" :model="selectE2G" :rules="E2GRules">
              <el-form-item label="序号" label-width="100px" prop="e2gindex">
                <el-input v-model="selectE2G.e2gindex" auto-complete="off" />
              </el-form-item>
              <el-form-item label="课程目标" label-width="100px" prop="subjectGoal">
                <el-autocomplete v-model="selectE2G.subjectGoal" popper-class="my-autocomplete" placeholder="输入课程目标序号" :fetch-suggestions="querySearchSubjectGoal">
                  <i
                    slot="suffix"
                    class="el-icon-edit el-input__icon"
                  />
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.goalIndex }}</div>
                    <span class="addr">{{ item.note }}</span>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <el-form-item label="评价环节" label-width="100px" prop="eval">
                <el-select v-model="selectE2G.eval" placeholder="请选择">
                  <el-option
                    v-for="item in tableEval"
                    :key="item.id"
                    :label="item.type"
                    :value="item.id"
                  >
                    <span style="float: left">{{ item.type }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.score }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="支撑占比" label-width="100px" prop="percentage">
                <el-input-number v-model.number="selectE2G.percentage" step="0.001" type="number" auto-complete="off" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogEditE2GVisible = false">取 消</el-button>
              <el-button type="primary" @click="updateE2G()">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-tab-pane>
      <el-tab-pane label="成绩管理">
        <el-form
          :model="headForm"
          :inline="true"
          class="demo-form-inline"
        >
          <el-form-item>
            <el-input v-model="headForm.idText" placeholder="学号" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleSearchScore()">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-plus" @click="handleAddScore()">新增成绩</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="dialogUploadFormVisible=true;">批量导入<i class="el-icon-upload el-icon--right" /></el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="deleteScoresByClass">删除全部成绩（重新导入使用）</el-button>
          </el-form-item>
        </el-form>
        <div class="table_container">
          <el-table
            :data="tableGrade"
            style="width=100%"
            border
          >
            <el-table-column
              label="学号"
              prop="student"
            />
            <el-table-column
              label="对应评价环节"
              prop="eval"
            />
            <el-table-column
              label="得分"
              prop="score"
            />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEditScore(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDeleteScore(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="Pagination">
            <el-pagination
              :total="count"
              :current-page="currentPage"
              :page-size="10"
              layout="total, prev, pager, next"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </div>
          <el-dialog title="批量上传成绩" :visible.sync="dialogUploadFormVisible" width="23%">
            <el-upload
              class="upload-demo"
              drag
              :action="uploadUrl"
              multiple
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip">请上传格式化的Excel文件，<a :href="downloadUrl" target="_blank">点此下载模板</a></div>
            </el-upload>
          </el-dialog>
          <el-dialog title="新增成绩" :visible.sync="dialogAddScoreVisible">
            <el-form ref="addScoreForm" :model="selectScore" :rules="scoreRules">
              <el-form-item label="学生" label-width="100px" prop="student">
                <el-select v-model="selectScore.student" placeholder="请选择">
                  <el-option
                    v-for="item in studentOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                    <span style="float: left">{{ item.id }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="评价环节类型" label-width="100px" prop="eval">
                <el-select v-model="selectScore.eval" placeholder="请选择">
                  <el-option
                    v-for="item in tableEval"
                    :key="item.id"
                    :label="item.type"
                    :value="item.id"
                  >
                    <span style="float: left">{{ item.type }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.score }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="得分" label-width="100px" prop="score">
                <el-input v-model="selectScore.score" type="number" auto-complete="off" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogAddScoreVisible = false">取 消</el-button>
              <el-button type="primary" @click="addScore()">确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog title="修改成绩" :visible.sync="dialogEditScoreVisible">
            <el-form ref="editScoreForm" :model="selectScore" :rules="scoreRules">
              <el-form-item label="学生" label-width="100px" prop="student">
                <el-input v-model="selectScore.student" auto-complete="off" />
              </el-form-item>
              <el-form-item label="评价环节类型" label-width="100px" prop="eval">
                <el-select v-model="selectScore.eval" placeholder="请选择">
                  <el-option
                    v-for="item in tableEval"
                    :key="item.id"
                    :label="item.type"
                    :value="item.id"
                  >
                    <span style="float: left">{{ item.type }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.score }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="得分" label-width="100px" prop="score">
                <el-input v-model="selectScore.score" type="number" auto-complete="off" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogEditScoreVisible = false">取 消</el-button>
              <el-button type="primary" @click="updateScore()">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-tab-pane>
      <el-tab-pane label="观测点">
        <div class="table_container">
          <el-table
            :data="tableViewPoint"
            style="width=100%"
            border
          >
            <el-table-column
              label="序号"
              type="index"
            />
            <el-table-column
              label="文本内容"
              prop="note"
            />
            <el-table-column
              label="对应评价环节"
              prop="e2g.e2gindex"
            />
            <el-table-column
              label="满分"
              prop="score"
            />
            <el-table-column
              label="占比"
              prop="percentage"
            />
            <el-table-column
              label="平均得分"
              prop="averageScore"
            />
            <el-table-column
              label="平均得分来源"
              prop="origin"
            />
            <el-table-column label="操作">
              <template slot="header" slot-scope="scope">
                <el-button type="success" size="mini" @click="handleAddViewPoint()">添加</el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEditViewPoint(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDeleteViewPoint(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog title="新增观测点" :visible.sync="dialogAddViewPointVisible">
            <el-form ref="addViewPointForm" :model="newViewPoint" :rules="viewPointRules">
              <el-form-item label="内容" label-width="100px" prop="note">
                <el-input v-model="newViewPoint.note" auto-complete="off" type="textarea" />
              </el-form-item>
              <el-form-item label="分值" label-width="100px" prop="score">
                <el-input v-model.number="newViewPoint.score" type="number" auto-complete="off" />
              </el-form-item>
              <el-form-item label="比例" label-width="100px" prop="percentage">
                <el-input v-model.number="newViewPoint.percentage" type="number" auto-complete="off" />
              </el-form-item>
              <el-form-item label="平均得分及来源" label-width="100px" prop="averageScore">
                <el-select v-model="newViewPoint.averageScore" placeholder="" value-key="name">
                  <el-option
                    v-for="item in averageScoreOptions"
                    :key="item.name"
                    :label="item.name + item.aveScore"
                    :value="item"
                  >
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.aveScore }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="观测的对应关系序号" label-width="100px" prop="e2g">
                <el-select v-model="newViewPoint.e2g" placeholder="请选择">
                  <el-option
                    v-for="item in tableE2G"
                    :key="item.e2gindex"
                    :label="item.e2gindex"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogAddViewPointVisible = false">取 消</el-button>
              <el-button type="primary" @click="addViewPoint()">确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog title="修改观测点" :visible.sync="dialogEditViewPointVisible">
            <el-form ref="editViewPointForm" :model="selectViewPoint" :rules="viewPointRules">
              <el-form-item label="内容" label-width="100px" prop="note">
                <el-input v-model="selectViewPoint.note" auto-complete="off" type="textarea" />
              </el-form-item>
              <el-form-item label="分值" label-width="100px" prop="score">
                <el-input v-model.number="selectViewPoint.score" type="number" auto-complete="off" />
              </el-form-item>
              <el-form-item label="比例" label-width="100px" prop="percentage">
                <el-input v-model.number="selectViewPoint.percentage" type="number" auto-complete="off" />
              </el-form-item>
              <el-form-item label="平均得分及来源" label-width="100px" prop="averageScore">
                <el-select v-model="selectViewPoint.averageScore" placeholder="" value-key="name">
                  <el-option
                    v-for="item in averageScoreOptions"
                    :key="item.name"
                    :label="item.name + item.aveScore"
                    :value="item"
                  >
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.aveScore }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="观测的对应关系序号" label-width="100px" prop="e2g">
                <el-select v-model="selectViewPoint.e2g" placeholder="请选择">
                  <el-option
                    v-for="item in tableE2G"
                    :key="item.e2gindex"
                    :label="item.e2gindex"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogEditViewPointVisible = false">取 消</el-button>
              <el-button type="primary" @click="updateViewPoint()">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-tab-pane>
      <el-tab-pane label="课程考核结果统计图">
        <div class="table_container">
          <div id="barChart" :style="{width: '800px', height: '800px'}" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="课程目标散点图">
        <el-form
          :model="currentScatterChart"
          :inline="true"
          class="demo-form-inline"
        >
          <el-form-item>
            <el-select v-model="currentScatterChart.goalId" placeholder="选择课程目标" @change="loadScatterDate()">
              <el-option
                v-for="item in subjectGoalOptions"
                :key="item.value"
                :value="item.value"
                :label="item.goalIndex"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="collectGoalScore()">采集</el-button>
          </el-form-item>
        </el-form>
        <div class="table_container">
          <div id="scatterChart" :style="{width:'800px',height:'800px'}" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getEvaltoGoals, addEvaltoGoal, deleteEvaltoGoal, updateEvaltoGoal } from '@/api/E2G'
import { addScore, deleteScore, getScores, updateScore, searchScores } from '@/api/scores'
import { getClassBarChart, getGoalScore, collectGoalScore } from '@/api/charts'
import { searchScoreByStu, deleteScoresByClass, getAveScore } from '@/api/scores'
import { searchGoals } from '@/api/goals'
import { addEval, deleteEval, getEval, updateEval } from '@/api/eval'
import { addViewPoint, deleteViewPoint, getViewPoints, updateViewPoint } from '@/api/viewPoint'
import { getSelStudents } from '@/api/course'

export default {
  data() {
    return {
      headForm: { idText: '' },

      courseId: '',
      subjectId: '',
      tableEval: [],
      tableE2G: [],
      tableViewPoint: [],
      tableGrade: [],

      averageScoreOptions: [],
      evaltoGoalOptions: [],
      subjectGoalOptions: [],
      studentOptions: [],
      evalOptions: [
        '平时成绩',
        '期末考核成绩',
        '实验成绩',
        '报告成绩',
        '作业成绩',
        '期中成绩',
        '验收成绩',
        '答辩成绩',
        '积分成绩',
        '开题报告',
        '毕业论文',
        '指导老师',
        '课堂测验',
        '总评成绩',
        '大作业成绩',
        '实验报告成绩',
        '实验验收成绩',
        '文献综述成绩',
        '单元测试成绩'
      ],

      selectEval: {
        id: '',
        type: '',
        aclass: this.courseId,
        score: Number(0)
      },
      selectE2G: {
        id: '',
        e2gindex: '',
        eval: '',
        subjectGoal: '',
        percentage: Number(0)
      },
      selectViewPoint: {
        id: '',
        note: '',
        score: Number(0),
        percentage: Number(0),
        averageScore: undefined,
        aclass: '',
        e2g: ''
      },
      selectScore: {
        id: '',
        student: '',
        aclass: '',
        eval: '',
        score: Number(0)
      },
      newEval: {
        type: '',
        aclass: this.courseId,
        score: Number(0)
      },
      newE2G: {
        e2gindex: '',
        eval: '',
        subjectGoal: '',
        percentage: Number(0)
      },
      newViewPoint: {
        note: '',
        score: Number(0),
        percentage: Number(0),
        averageScore: undefined,
        e2g: ''
      },
      newScore: {
        student: '',
        aclass: '',
        eval: '',
        score: Number(0)
      },

      scatterData: [],
      barData: [],
      currentScatterChart: { goalId: '' },

      dialogAddEvalVisible: false,
      dialogEditEvalVisible: false,
      dialogAddE2GVisible: false,
      dialogEditE2GVisible: false,
      dialogAddViewPointVisible: false,
      dialogEditViewPointVisible: false,
      dialogAddScoreVisible: false,
      dialogEditScoreVisible: false,
      dialogUploadFormVisible: false,

      evalRules: {
        aclass: [
          { required: true, message: '非空', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '非空', trigger: 'blur' },
          { type: 'number', min: 0, max: 100, message: '分值为0~100', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '非空', trigger: 'blur' }
        ]
      },
      E2GRules: {
        e2gindex: [
          { required: true, message: '非空', trigger: 'blur' }
        ],
        eval: [
          { required: true, message: '非空', trigger: 'blur' }
        ],
        subjectGoal: [
          { required: true, message: '非空', trigger: 'blur' }
        ],
        percentage: [
          { required: true, message: '非空', trigger: 'blur' },
          { type: 'number', min: 0.001, max: 1, message: '输入0~1的小数', trigger: 'blur' }
        ]
      },
      viewPointRules: {
        note: [
          { required: true, message: '非空', trigger: 'blur' }
        ],
        e2g: [
          { required: true, message: '非空', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '非空', trigger: 'blur' },
          // { type: 'number', message: '输入数字型', trigger: 'blur'},
          { type: 'number', min: 0, max: 100, message: '分值为0~100', trigger: 'blur' }
        ],
        averageScore: [
          { required: true, message: '非空', trigger: 'blur' }
          // { type: 'number', message: '输入数字型', trigger: 'blur'},
          // { type: "number", min: 0, max: 100, message: '分值为0~100', trigger: 'blur' },
        ],
        percentage: [
          { required: true, message: '非空', trigger: 'blur' },
          // { type: 'float', message: '输入数字型', trigger: 'blur'},
          { type: 'number', min: 0.001, max: 1, message: '输入0~1的小数', trigger: 'blur' }
        ]
      },
      scoreRules: {
        student: [
          { required: true, message: '非空', trigger: 'blur' }
        ],
        aclass: [
          { required: true, message: '非空', trigger: 'blur' }
        ],
        eval: [
          { required: true, message: '非空', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '非空', trigger: 'blur' },
          // { type: 'number', message: '输入数字型', trigger: 'blur'},
          { type: 'number', min: 0, max: 100, message: '分值为0~100', trigger: 'blur' }
        ]
      },

      uploadUrl: process.env.VUE_APP_BASE_API + '/scores/uploadScores',
      downloadUrl: process.env.VUE_APP_BASE_API + '/scores/downloadScoreExcel',

      /**
       * 分页相关
       */
      count: 0,
      currentPage: 1,
      offset: 0,
      limit: 10
    }
  },
  // beforeRouteUpdate(to, from, next){
  //   this.initData();
  //   next();
  // },
  // beforeRouteLeave (to, from, next) {
  //   this.leave();
  //   next();
  // },
  watch: {
    $route(to, from) {
      if (from.path == '/course-list' && to.query.courseId) {
        this.initData()
      }
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    // this.drawLine();
  },
  methods: {
    initData() {
      this.courseId = this.$route.query.courseId
      this.subjectId = this.$route.query.subjectId
      this.getEval()
      this.getViewPoint()
      this.getEvaltoGoals()
      this.getScores()
      this.loadSubjectGoalOptions()
      this.loadStudentOptions()
      this.loadBarData()
      this.loadAverageScoreOptions()
    },

    getInfo() {
      searchCourses(this.courseId).then(response => {
        this.tableEval = []
        response.data.result.content.forEach(item => {
          const tableDataItem = {}
          tableDataItem.id = item.id
          tableDataItem.type = item.type
          tableDataItem.class = item.class
          tableDataItem.score = item.score
          this.tableEval.push(tableDataItem)
        })
      })
    },

    getEval() {
      getEval([this.courseId]).then(response => {
        this.tableEval = []
        response.data.result.forEach(item => {
          const tableDataItem = {}
          tableDataItem.id = item.id
          tableDataItem.type = item.type
          tableDataItem.aclass = item.aclass
          tableDataItem.score = item.score
          this.tableEval.push(tableDataItem)
        })
      })
    },

    getEvaltoGoals() {
      getEvaltoGoals([this.courseId]).then(response => {
        this.tableE2G = []
        response.data.result.forEach(item => {
          const tableDataItem = {}
          tableDataItem.id = item.id
          tableDataItem.e2gindex = item.e2gindex
          tableDataItem.eval = item.eval
          tableDataItem.subjectGoal = item.subjectgoal
          tableDataItem.percentage = item.percentage
          this.tableE2G.push(tableDataItem)
        })
      })
    },

    getViewPoint() {
      getViewPoints([this.courseId]).then(response => {
        this.tableViewPoint = []
        response.data.result.forEach(item => {
          const tableDataItem = {}
          tableDataItem.id = item.id
          tableDataItem.note = item.note
          tableDataItem.score = item.score
          tableDataItem.percentage = item.percentage
          tableDataItem.aclass = item.aclass
          tableDataItem.e2g = item.e2g
          tableDataItem.averageScore = item.averageScore
          tableDataItem.origin = item.origin
          this.tableViewPoint.push(tableDataItem)
        })
      })
    },

    getScores() {
      searchScores({ search: this.courseId, offset: this.offset, limit: this.limit }).then(response => {
        this.count = response.data.result.totalElements
        this.tableGrade = []
        response.data.result.content.forEach(item => {
          const tableDataItem = {}
          tableDataItem.id = item.id
          tableDataItem.student = item.student
          tableDataItem.eval = item.eval
          tableDataItem.score = item.score
          tableDataItem.class = item.class
          this.tableGrade.push(tableDataItem)
        })
      })
    },

    loadSubjectGoalOptions() {
      searchGoals({ search: this.subjectId, limit: 100, offset: 0 }).then(response => {
        this.subjectGoalOptions = []
        response.data.result.content.forEach(item => {
          const optionItem = {}
          optionItem.value = item.id
          optionItem.note = item.note
          optionItem.goalIndex = item.goalIndex
          this.subjectGoalOptions.push(optionItem)
        })
      })
    },
    querySearchSubjectGoal(queryString, cb) {
      var subjectGoals = this.subjectGoalOptions
      var results = queryString ? subjectGoals.filter(this.creatFilterSubjectGoal(queryString)) : subjectGoals
      cb(results)
    },
    creatFilterSubjectGoal(queryString) {
      return (subjectGoal) => {
        return (subjectGoal.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },

    loadAverageScoreOptions() {
      getAveScore({ classId: this.courseId }).then(response => {
        this.averageScoreOptions = []
        console.log(response)

        this.averageScoreOptions = response.data.result
      })
    },

    // 按钮
    handleUpdateClassInfo() {
      updateCourse(row.id).then(() => {
        this.$message({
          type: 'success',
          message: '成功'
        })
      })
    },

    handleAddEval() {
      this.newEval = {
        type: '',
        aclass: this.courseId,
        score: Number(0)
      }
      this.dialogAddEvalVisible = true
    },
    addEval() {
      this.$refs['addEvalForm'].validate((valid) => {
        if (valid) {
          addEval([this.newEval]).then(response => {
            if (response.data.status == 200) {
              this.$message({
                type: 'success',
                message: '成功'
              })
              this.dialogAddEvalVisible = false
              this.getEval()
            } else if (response.data.status == 400) {
              this.$message({
                type: 'warning',
                message: '已存在！'
              })
            } else {
              throw new Error(response.message)
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请完善表单'
          })
        }
      })
    },
    handleEditEval(row) {
      this.selectEval.id = row.id
      this.selectEval.type = row.type
      this.selectEval.aclass = row.aclass
      this.selectEval.score = row.score
      this.dialogEditEvalVisible = true
    },
    updateEval() {
      this.$refs['editEvalForm'].validate((valid) => {
        if (valid) {
          updateEval(this.selectEval).then(response => {
            this.$message({
              type: 'success',
              message: '成功'
            })
            this.dialogEditEvalVisible = false
            this.getEval()
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请完善表单'
          })
        }
      })
    },

    handleAddE2G() {
      this.newE2G.e2gindex = '',
      this.newE2G.eval = ''
      this.newE2G.subjectGoal = ''
      this.newE2G.percentage = Number(0)
      this.dialogAddE2GVisible = true
    },
    addE2G() {
      this.$refs['addE2GForm'].validate((valid) => {
        if (valid) {
          const params = {
            e2gindex: this.newE2G.e2gindex,
            eval: { id: this.newE2G.eval },
            subjectgoal: { id: this.newE2G.subjectGoal },
            percentage: this.newE2G.percentage
          }
          addEvaltoGoal([params]).then(response => {
            this.$message({
              type: 'success',
              message: '成功'
            })
            this.dialogAddE2GVisible = false
            this.getEvaltoGoals()
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请完善表单'
          })
        }
      })
    },
    handleEditE2G(row) {
      this.selectE2G.id = row.id
      this.selectE2G.e2gindex = row.e2gindex
      this.selectE2G.eval = row.eval.id
      this.selectE2G.subjectGoal = row.subjectGoal.id
      this.selectE2G.percentage = row.percentage
      this.dialogEditE2GVisible = true
    },
    updateE2G() {
      const params = {
        id: this.selectE2G.id,
        e2gindex: this.selectE2G.e2gindex,
        percentage: this.selectE2G.percentage,
        subjectgoal: { id: this.selectE2G.subjectGoal },
        eval: { id: this.selectE2G.eval }
      }
      this.$refs['editE2GForm'].validate((valid) => {
        if (valid) {
          updateEvaltoGoal(params).then(() => {
            this.$message({
              type: 'success',
              message: '更新成功'
            })
            this.dialogEditE2GVisible = false
            this.getEvaltoGoals()
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请完善表单'
          })
        }
      })
    },

    handleAddViewPoint() {
      this.newViewPoint.aclass = this.courseId
      this.newViewPoint.averageScore = Number(0)
      this.newViewPoint.e2g = ''
      this.newViewPoint.note = ''
      this.newViewPoint.percentage = Number(0)
      this.newViewPoint.score = Number(0)
      this.dialogAddViewPointVisible = true
    },
    addViewPoint() {
      const params = {
        aclass: this.newViewPoint.aclass,
        averageScore: this.newViewPoint.averageScore.aveScore,
        origin: this.newViewPoint.averageScore.name,
        e2g: { id: this.newViewPoint.e2g },
        note: this.newViewPoint.note,
        percentage: this.newViewPoint.percentage,
        score: this.newViewPoint.score
      }
      this.$refs['addViewPointForm'].validate((valid) => {
        if (valid) {
          addViewPoint(params).then(() => {
            this.$message({
              type: 'success',
              message: '成功'
            })
            this.dialogAddViewPointVisible = false
            this.getViewPoint()
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请完善表单'
          })
        }
      })
    },

    handleEditViewPoint(row) {
      this.selectViewPoint.id = row.id
      this.selectViewPoint.aclass = row.aclass
      this.selectViewPoint.averageScore = row.averageScore
      this.selectViewPoint.e2g = row.e2g.id
      this.selectViewPoint.note = row.note
      this.selectViewPoint.percentage = row.percentage
      this.selectViewPoint.score = row.score
      this.dialogEditViewPointVisible = true
    },
    updateViewPoint() {
      const paramsViewPoint = {
        id: this.selectViewPoint.id,
        note: this.selectViewPoint.note,
        aclass: this.selectViewPoint.aclass,
        score: this.selectViewPoint.score,
        percentage: this.selectViewPoint.percentage,
        averageScore: this.selectViewPoint.averageScore.aveScore,
        origin: this.selectViewPoint.averageScore.name,
        e2g: { id: this.selectViewPoint.e2g }
      }
      this.$refs['editViewPointForm'].validate((valid) => {
        if (valid) {
          updateViewPoint(paramsViewPoint).then(() => {
            this.$message({
              type: 'success',
              message: '成功'
            })
            this.dialogEditViewPointVisible = false
            this.getViewPoint()
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请完善表单'
          })
        }
      })
    },

    async handleDeleteViewPoint(index, row) {
      deleteViewPoint({ id: row.id }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.tableViewPoint.splice(index, 1)
      })
    },
    async handleDeleteEval(index, row) {
      deleteEval({ id: row.id }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.tableEval.splice(index, 1)
      })
    },
    handleDeleteE2G(index, row) {
      deleteEvaltoGoal({ id: row.id }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.tableE2G.splice(index, 1)
      })
    },

    handleAddScore() {
      this.newScore = {
        student: '',
        aclass: '',
        eval: '',
        score: Number(0)
      }
      this.dialogAddScoreVisible = true
    },
    addScore() {
      this.$refs['addScoreForm'].validate((valid) => {
        if (valid) {
          addScore(this.newScore).then(() => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.getScores()
            this.dialogAddScoreVisible = false
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请完善表单'
          })
        }
      })
    },

    handleEditScore(row) {
      this.selectScore = {
        id: row.id,
        student: row.student,
        aclass: row.aclass,
        eval: row.eval,
        score: row.score
      }
      this.dialogEditScoreVisible = true
    },
    updateScore() {
      this.$refs['editScoreForm'].validate((valid) => {
        if (valid) {
          updateScore(this.selectScore).then(() => {
            this.$message({
              type: 'success',
              message: '更新成功'
            })
            this.getScores()
            this.dialogEditScoreVisible = false
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请完善表单'
          })
        }
      })
    },

    async handleDeleteScore(index, row) {
      deleteScore({ id: row.id }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.tableGrade.splice(index, 1)
      })
    },

    async handleSearchScore() {
      this.currentPage = 1
      searchScoreByStu({ search: this.headForm.idText, aclass: this.courseId, offset: this.offset, limit: this.limit }).then(response => {
        this.count = response.data.result.totalElements
        this.tableGrade = []
        response.data.result.content.forEach(item => {
          const tableDataItem = {}
          tableDataItem.id = item.id
          tableDataItem.student = item.student
          tableDataItem.eval = item.eval
          tableDataItem.score = item.score
          tableDataItem.class = item.class
          this.tableGrade.push(tableDataItem)
        })
      })
    },

    async loadStudentOptions() {
      getSelStudents({ aclass: this.courseId }).then(response => {
        this.studentOptions = []
        response.data.result.forEach(item => {
          if (item) {
            const optionItem = {}
            optionItem.id = item.id
            optionItem.name = item.name
            this.studentOptions.push(optionItem)
          }
        })
      })
    },

    deleteScoresByClass() {
      deleteScoresByClass({ id: this.courseId }).then(response => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getScores()
        this.loadAverageScoreOptions()
      })
    },

    // 图表相关
    loadScatterDate() {
      getGoalScore({ aclass: this.courseId, goal: this.currentScatterChart.goalId }).then(response => {
        const scatterChart = this.$echarts.init(document.getElementById('scatterChart'))
        scatterChart.setOption({
          title: { text: '算分法直接评价个体达成情况散点图' },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {
                show: true,
                excludeComponents: ['toolbox'],
                pixelRatio: 2
              }
            }
          },
          xAxis: {

          },
          yAxis: {
            min: 0,
            max: 100
          },
          series: [{
            type: 'scatter',
            symbolSize: 20,
            data: response.data.result
          }]
        })
      })
    },

    collectGoalScore() {
      collectGoalScore({ classId: this.courseId }).then(response => {
        this.$message({
          type: 'success',
          message: '采集成功'
        })
      })
    },

    loadBarData() {
      getClassBarChart({ id: this.courseId }).then(response => {
        const barChart = this.$echarts.init(document.getElementById('barChart'))
        barChart.setOption({
          title: { text: this.courseId + '课程考核结果统计' },
          legend: {},
          tooltip: {},
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {
                show: true,
                excludeComponents: ['toolbox'],
                pixelRatio: 2
              }
            }
          },
          dataset: {
            source: response.data.result
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: -20
            }
          },
          yAxis: {},
          series: [
            {
              type: 'bar',
              itemStyle: {
                normal: {
                  label: {
                    show: true, // 开启显示
                    position: 'top', // 在上方显示
                    textStyle: { // 数值样式
                      color: 'black',
                      fontSize: 16
                    }
                  }
                }
              }
            },
            {
              type: 'bar',
              itemStyle: {
                normal: {
                  label: {
                    show: true, // 开启显示
                    position: 'top', // 在上方显示
                    textStyle: { // 数值样式
                      color: 'black',
                      fontSize: 16
                    }
                  }
                }
              }
            },
            {
              type: 'bar',
              itemStyle: {
                normal: {
                  label: {
                    show: true, // 开启显示
                    position: 'top', // 在上方显示
                    textStyle: { // 数值样式
                      color: 'black',
                      fontSize: 16
                    }
                  }
                }
              }
            }
          ]
        })
      })
    },

    // 分页相关
    handleCurrentChange(val) {
      if (this.headForm.idText) {
        this.currentPage = val
        this.offset = (val - 1)
        this.handleSearchScore()
      } else {
        this.currentPage = val
        this.offset = (val - 1)
        this.getScores()
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },

    leave() {
      this.tableEval = []
      this.tableE2G = []
      this.tableViewPoint = []
      this.tableGrade = []
    }
  }
}
</script>
