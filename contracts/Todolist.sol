pragma solidity ^0.5.0;
// import "@openzeppelin/contracts/utils/Strings.sol";

contract Todolist{

    uint public taskCount = 0;

    event TaskCreated(
        uint id,
        string content,
        bool completed

    );

    event TaskCompleted(

        uint id,
        bool completed

    );

    struct Task{

        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Task) public tasks;

    constructor() public{
        createTask("Go to Kaspa.org");

    }

    function rawString(string memory str) public pure returns(string memory){
        
        bytes memory _str = bytes(str); //converted from thring to bytes to be irrrated over
        bytes memory roughstring = bytes(str); //used to get the raw string up till # character
        uint i = 0;

        //had to change bytes1 to dynamic bytes then convert it to string to compare it to characters
        while(_str[i] != byte('#')){

            if(_str[i] != byte(' ')){
                roughstring[i] = _str[i];
            }

            i++;
        }

        //cuts the rest of the characters after #
        bytes memory rawstring = new bytes(i);
        for(uint j = 0; j < i ; j++) {
            rawstring[j] = roughstring[j];
        }

        return string(rawstring);


    }

    function checkContent(string memory _content_) public view returns (uint)  {

        uint contentCheck = 1;

        for(uint i = 0; i < taskCount; i++){

            if(compareStrings(tasks[i].content,_content_)){

                    contentCheck++;
            }
        }

        return contentCheck;

        
    }

    function createTask(string memory _content) public{

        
        taskCount ++;
        //checks if the task alredy exists and if so then modify it
        
        uint i = checkContent(_content);

        if (i > 1){

            //concatnates the the number of times that task is there and the task 
            _content = concatenateStrings(_content , concatenateStrings( ' #', uintToString(i))); 
        }


        
        tasks[taskCount] = Task(taskCount, _content , false);
        emit TaskCreated(taskCount, _content, false);

    }

    function toggleCompleted(uint _id) public {
        
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;

        emit TaskCompleted(_id, _task.completed);

    }


      function concatenateStrings(string memory a, string memory b) public pure returns (string memory) {
        bytes memory concatenatedBytes = abi.encodePacked(a, b);
        return string(concatenatedBytes);
    }

    function uintToString(uint v) public pure returns (string memory) {
        uint maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint i = 0;
        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = byte(uint8(48 + remainder)); // 48 is the ASCII value for '0'
        }
        bytes memory s = new bytes(i); // Trim off any leading zeros
        for (uint j = 0; j < i; j++) {
            s[j] = reversed[i - j - 1]; // Reverse the string
        }
        return string(s); // Convert to string
    }

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b)));
    }
    
    
}