pragma solidity ^0.5.0;

contract Tether {
    string public name = "Tether";
    string public symbol = "USDT";
    uint256 public totalSupply = 1000000000000000000000000; // 1 million tokens issued
    uint8 public decimals = 18;
    address _from;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        //require that the value is greater or equal from transfers
        require(balanceOf[msg.sender] >= _value);
        // transfer the amount and subtract the value
        balanceOf[msg.sender] -= _value;
        // add the amount to the receivers account
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function Approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        // add the balance
        balanceOf[_to] += _value;
        // subtract the balance
        balanceOf[_from] -= _value;

        allowance[msg.sender][_from] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }
}
