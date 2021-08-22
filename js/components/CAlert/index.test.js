const index = require("./index")
// @ponicode
describe("index.default.close", () => {
    test("0", () => {
        let callFunction = () => {
            index.default.close()
        }
    
        expect(callFunction).not.toThrow()
    })
})
