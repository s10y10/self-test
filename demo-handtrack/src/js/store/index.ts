import { reactive } from 'vue'
import { loadScript } from '@/tools/load-script'

const store = {
  state: reactive({
    loadingRate: 0,
    showLoading: false,
    answerResult: [] as any,
    resScreenShotList: [], // 答题结果快照
    currentAnswerResult: 3, //1正确,2错误,3未答
    stageScale: 1,
    activityData: {
      questionList: [] as any
    },
    currentQuestionData: {
      displayContent: {},
      answerContent: {},
      optionContent: {},
      positionContent: {},
      questionType: null,
      id: 0
    },
    currentQuestionIndex: 0,
    currentStep: 1 // 1答题，2结果
  }),
  async initData() {
    const res = await this.getData()
    this.state.activityData = res
    for (let i = 0; i < this.state.activityData.questionList.length; i++) {
      this.state.activityData.questionList[i].id = `question_${this.state.activityData.questionList[i].id}` //因为id不能是数字,所以加个前缀
      this.state.answerResult.push(3)
    }
    this.state.currentQuestionData = this.state.activityData.questionList[this.state.currentQuestionIndex]
  },
  toNextQuestion() {
    this.state.currentQuestionIndex++
    if (this.state.currentQuestionIndex === this.state.activityData.questionList.length) {
      this.state.currentStep = 2
      return
    }
    this.state.currentQuestionData = this.state.activityData.questionList[this.state.currentQuestionIndex]
  },
  async getData() {
    await loadScript('./activity.data.js')
    return window['activityData']
  }
}

export default store
