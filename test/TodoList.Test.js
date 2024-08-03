

const Todolist = artifacts.require('./Todolist.sol')

contract('Todolist',(accounts) => {
    before (async () => {
        this.todoList = await Todolist.deployed()
    })
    it('deplyed correctly',async() => {
        const address = await this.todoList.address
        assert.notEqual(address,0x0)
        assert.notEqual(address,'')
        assert.notEqual(address,null)
        assert.notEqual(address, undefined)
    })

    it('list Tasks', async() => {
        const Taskcount = await this.todoList.taskCount()
        const task = await this.todoList.tasks(Taskcount) 
        assert.equal(task.id.toNumber(),Taskcount.toNumber())
        assert.notEqual(task.content,'')
        assert.notEqual(task.content, null)
        assert.notEqual(task.content,undefined)
        assert.equal(task.content, "Go to Kaspa.org")
        assert.equal(task.completed, false)
        assert.equal(Taskcount.toNumber(),1)  
    })

    it('creates tasks', async () => {

        const result = await this.todoList.createTask('clean your room')
        const taskCount  = await this.todoList.taskCount()
        const event  = result.logs[0].args
        assert.equal(taskCount.toNumber(), 2)
        assert.equal(event.id, taskCount.toNumber() )
        assert.equal(event.content,'clean your room')
        assert.equal(event.completed, false)

    })

    it('checks competed tasks', async () => {

        const result = await this.todoList.toggleCompleted(1)
        const task  = await this.todoList.tasks(1)
        const event  = result.logs[0].args
        assert.equal(task.completed, true)
        assert.equal(event.id, 1)
        assert.equal(event.completed, true)

    })
})