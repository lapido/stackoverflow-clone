import rewire from "rewire"
const answer_controller = rewire("./answer.controller")
const AnswerController = answer_controller.__get__("AnswerController")
// @ponicode
describe("answerQuestion", () => {
    let inst: any

    beforeEach(() => {
        inst = new AnswerController()
    })

    test("0", async () => {
        await inst.answerQuestion(undefined, undefined)
    })
})
