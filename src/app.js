//const { isBoolean } = require("web3/lib/utils/utils")

App = {

    loading: false,
    contracts: {},

    load: async () =>{
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },
    
    

    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider
          web3 = new Web3(web3.currentProvider)
        } else {
          window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
          window.web3 = new Web3(ethereum)
          try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */})
          } catch (error) {
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = web3.currentProvider
          window.web3 = new Web3(web3.currentProvider)
          // Acccounts always exposed
          web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      },

      loadAccount: async () => {
        //set the current Blockchain account
        App.account = web3.eth.accounts[0]
        console.log(App.account)
      },

      loadContract: async () =>{
        // Create a JavaScript version of the smart contract
        const todoList = await $.getJSON('Todolist.json')
        App.contracts.TodoList = TruffleContract(todoList)
        App.contracts.TodoList.setProvider(App.web3Provider)

        //Hydrate the smart contract with values from the blockchain
        App.todoList = await App.contracts.TodoList.deployed()
      },

      render: async ()=> {
        //prevent double render
        if(App.loading){
            return
        }

        //update app loading state
        App.setLoading(true)

        //render the account 
        $('#account').html(App.account)

        await App.renderTasks()

        //updat the loading state
        App.setLoading(false)
      },

      setLoading: (boolean) => {
        
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if(boolean){
            loader.show()
            content.hide()

        }else{

            loader.hide()
            content.show()
        }

      },

      renderTasks: async () =>{
        //load the total task count from the blockchain
        const taskCount = await App.todoList.taskCount()
        const $taskTemplate = $('.taskTemplate')


        //redner each task with a new template
        for(var i = 1; i <= taskCount;i++){

            //pull all the info of each task
            const task = await App.todoList.tasks(i)
            const taskId = task[0].toNumber()
            const taskContent = task[1]
            const taskCompleted = task[2]

            //create the html for the task
            const $newTaskTemplate = $taskTemplate.clone()
            $newTaskTemplate.find('.content').html(taskContent)
            $newTaskTemplate.find('input')
                            .prop('name',taskId)
                            .prop('checked',taskCompleted)
                            .on('click',App.toggleCompleted)

            //put the task in the correct list
            if(taskCompleted){
                $('#completedTaskList').append($newTaskTemplate)

            } else {

                $('#taskList').append($newTaskTemplate)
            }

            //Show the task
            $newTaskTemplate.show()
        }

      },

      createTask: async () => {
        App.setLoading(true)
        const content = $('#newTask').val()
        await App.todoList.createTask(content)
        window.location.reload()

      },

      toggleCompleted: async (e) =>{
        App.setLoading(true)
        const taskId = e.target.name 
        await App.todoList.toggleCompleted(taskId)
        window.location.reload()

      },
      
}

$(()=> {
    $(window).load(() => {
        App.load()
    })
})