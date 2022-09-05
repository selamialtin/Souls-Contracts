// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

/// @title Managers Contract for The Unfettered Game
/// @author Yusuf Özcan GÜLER (y.ozcan.guler@gmail.com)
/// @notice Defines 5 manager and allows opening new topics to vote by these managers.
/// If 3 of managers approved a topic approves the topic.
contract Managers is Ownable {
    struct Topic {
        address source;
        string title;
        uint256 approveCount;
    }
    struct TopicApproval {
        address source;
        bool approved;
        bytes value;
    }

    struct Source {
        address sourceAddress;
        string sourceName;
    }

    Topic[] public activeTopics;

    address public manager1;
    address public manager2;
    address public manager3;
    address public manager4;
    address public manager5;

    mapping(string => mapping(address => TopicApproval)) public managerApprovalsForTopic;

    mapping(address => Source) public trustedSources;

    event AddTrustedSource(address indexed _address, string indexed _name);
    event ApproveTopic(address indexed _by, string indexed _title, bytes indexed _valueInBytes);
    event CancelTopicApproval(address indexed _by, string indexed _title);

    constructor(
        address _manager1,
        address _manager2,
        address _manager3,
        address _manager4,
        address _manager5
    ) {
        require(
            _manager1 != address(0) &&
                _manager2 != address(0) &&
                _manager3 != address(0) &&
                _manager4 != address(0) &&
                _manager5 != address(0),
            "Invalid address in managers"
        );
        manager1 = _manager1;
        require(!isManager(_manager2), "Cannot set same address for two different manager");
        manager2 = _manager2;
        require(!isManager(_manager3), "Cannot set same address for two different manager");
        manager3 = _manager3;
        require(!isManager(_manager4), "Cannot set same address for two different manager");
        manager4 = _manager4;
        require(!isManager(_manager5), "Cannot set same address for two different manager");
        manager5 = _manager5;

        _addAddressToTrustedSources(address(this), "Managers");
        _addAddressToTrustedSources(msg.sender, "Proxy");
    }

    modifier onlyManagers(address _caller) {
        require(isManager(_caller), "ONLY MANAGERS: Not authorized");
        _;
    }

    modifier onlyTrustedSources(address _sender) {
        require(trustedSources[_sender].sourceAddress != address(0), "MANAGERS: Untrusted source");
        _;
    }

    //***** WRITE FUNCTIONS

    /// @notice Adds a smart contract address to trusted sources list.
    /// @dev Because onlyManagers modifier is calling with tx.origin parameter in some functions
    /// adds extra security to block function calls from untrusted senders.
    /// @param _address is the address of the smart contract which can interact with this contract.

    function addAddressToTrustedSources(address _address, string memory _name) external onlyOwner {
        _addAddressToTrustedSources(_address, _name);
    }

    /// @notice Approves a topic for manager who started the transaction to caller contract of this function
    /// @dev Must be called from contracts instead of Externally Owned Accounts. And Because this function will be
    /// called by other contracts, `msg.sender` is not the manager address.
    /// For that, uses `onlyManagers` modifier with `tx.origin` global variable as parameter. To block untrusted calls
    /// from chained transactions which starts from manager wallet filters calls with `onlyTrustedSources` modifier.
    /// @param _title to vote by admins
    /// @param _valueInBytes keccak256 hash of the paramaeters of the function which calling this function.

    function approveTopic(string memory _title, bytes memory _valueInBytes)
        public
        onlyManagers(tx.origin)
        onlyTrustedSources(msg.sender)
    {
        _approveTopic(_title, _valueInBytes);
    }

    function cancelTopicApproval(string memory _title) public onlyManagers(msg.sender) {
        (bool _titleExists, uint256 _topicIndex) = _indexOfTopic(_title);
        require(_titleExists, "Topic not found");
        require(managerApprovalsForTopic[_title][msg.sender].approved, "Topic not approved by manager");

        activeTopics[_topicIndex].approveCount--;
        if (activeTopics[_topicIndex].approveCount == 0) {
            _deleteTopic(_title);
        } else {
            managerApprovalsForTopic[_title][msg.sender].approved = false;
        }
        emit CancelTopicApproval(msg.sender, _title);
    }

    function deleteTopic(string memory _title) external onlyManagers(tx.origin) onlyTrustedSources(msg.sender) {
        string memory _prefix = string.concat(trustedSources[msg.sender].sourceName, ": ");
        _title = string.concat(_prefix, _title);
        _deleteTopic(_title);
    }

    function changeManager1Address(address _newAddress) external onlyManagers(msg.sender) {
        require(msg.sender != manager1, "Cannot approve to set own address");
        require(!isManager(_newAddress), "Cannot set same address for two different manager");

        string memory _title = "Change Manager 1 Address";
        bytes memory _valueInBytes = abi.encode(_newAddress);
        _approveTopic(_title, _valueInBytes);

        if (isApproved(_title, _valueInBytes)) {
            manager1 = _newAddress;
            _deleteTopic(string.concat("Managers: ", _title));
        }
    }

    function changeManager2Address(address _newAddress) external onlyManagers(msg.sender) {
        require(msg.sender != manager2, "Cannot approve to set own address");
        require(!isManager(_newAddress), "Cannot set same address for two different manager");
        string memory _title = "Change Manager 2 Address";
        bytes memory _valueInBytes = abi.encode(_newAddress);
        _approveTopic(_title, _valueInBytes);
        if (isApproved(_title, _valueInBytes)) {
            manager2 = _newAddress;
            _deleteTopic(string.concat("Managers: ", _title));
        }
    }

    function changeManager3Address(address _newAddress) external onlyManagers(msg.sender) {
        require(msg.sender != manager3, "Cannot approve to set own address");
        require(!isManager(_newAddress), "Cannot set same address for two different manager");

        string memory _title = "Change Manager 3 Address";
        bytes memory _valueInBytes = abi.encode(_newAddress);
        _approveTopic(_title, _valueInBytes);

        if (isApproved(_title, _valueInBytes)) {
            manager3 = _newAddress;
            _deleteTopic(string.concat("Managers: ", _title));
        }
    }

    function changeManager4Address(address _newAddress) external onlyManagers(msg.sender) {
        require(msg.sender != manager4, "Cannot approve to set own address");
        require(!isManager(_newAddress), "Cannot set same address for two different manager");

        string memory _title = "Change Manager 4 Address";
        bytes memory _valueInBytes = abi.encode(_newAddress);
        _approveTopic(_title, _valueInBytes);

        if (isApproved(_title, _valueInBytes)) {
            manager4 = _newAddress;
            _deleteTopic(string.concat("Managers: ", _title));
        }
    }

    function changeManager5Address(address _newAddress) external onlyManagers(msg.sender) {
        require(msg.sender != manager5, "Cannot approve to set own address");
        require(!isManager(_newAddress), "Cannot set same address for two different manager");

        string memory _title = "Change Manager 5 Address";
        bytes memory _valueInBytes = abi.encode(_newAddress);
        _approveTopic(_title, _valueInBytes);

        if (isApproved(_title, _valueInBytes)) {
            manager5 = _newAddress;
            _deleteTopic(string.concat("Managers: ", _title));
        }
    }

    function _deleteTopic(string memory _title) internal {
        (bool _titleExists, uint256 _topicIndex) = _indexOfTopic(_title);
        require(_titleExists, "Topic not found");
        managerApprovalsForTopic[_title][manager1].approved = false;
        managerApprovalsForTopic[_title][manager2].approved = false;
        managerApprovalsForTopic[_title][manager3].approved = false;
        managerApprovalsForTopic[_title][manager4].approved = false;
        managerApprovalsForTopic[_title][manager5].approved = false;
        if (_topicIndex < activeTopics.length - 1) {
            activeTopics[_topicIndex] = activeTopics[activeTopics.length - 1];
        }
        activeTopics.pop();
    }

    function _approveTopic(string memory _title, bytes memory _valueInBytes) internal {
        string memory _prefix = "";
        address _source;
        if (bytes(trustedSources[msg.sender].sourceName).length > 0) {
            _prefix = string.concat(trustedSources[msg.sender].sourceName, ": ");
            _source = trustedSources[msg.sender].sourceAddress;
        } else {
            if (isManager(msg.sender)) {
                _prefix = "Managers: ";
                _source = address(this);
            } else {
                revert("MANAGERS: Untrusted source");
            }
        }

        _title = string.concat(_prefix, _title);

        require(!managerApprovalsForTopic[_title][tx.origin].approved, "Already voted");

        managerApprovalsForTopic[_title][tx.origin].approved = true;
        managerApprovalsForTopic[_title][tx.origin].value = _valueInBytes;
        managerApprovalsForTopic[_title][tx.origin].source = _source;

        (bool _titleExists, uint256 _topicIndex) = _indexOfTopic(_title);

        if (!_titleExists) {
            activeTopics.push(Topic({source: _source, title: _title, approveCount: 1}));
        } else {
            activeTopics[_topicIndex].approveCount++;
        }
        emit ApproveTopic(tx.origin, _title, _valueInBytes);
    }

    function _addAddressToTrustedSources(address _address, string memory _name) internal {
        trustedSources[_address].sourceAddress = _address;
        trustedSources[_address].sourceName = _name;
        emit AddTrustedSource(_address, _name);
    }

    //***** READ FUNCTIONS

    function isManager(address _address) public view returns (bool) {
        return (_address == manager1 ||
            _address == manager2 ||
            _address == manager3 ||
            _address == manager4 ||
            _address == manager5);
    }

    function getActiveTopics() public view returns (Topic[] memory) {
        return activeTopics;
    }

    /// @notice Checks if a title approved by 3 of managers with same parameters.
    /// @param _title to check if voted or no
    /// @param _value keccak256 hash of the parameters of caller function
    /// @return  _isApproved true if the title approved by 3 of managers with same parameters

    function isApproved(string memory _title, bytes memory _value) public view returns (bool _isApproved) {
        string memory _prefix = "";
        if (bytes(trustedSources[msg.sender].sourceName).length > 0) {
            _prefix = string.concat(trustedSources[msg.sender].sourceName, ": ");
        } else {
            if (isManager(msg.sender)) {
                _prefix = "Managers: ";
            } else {
                revert("MANAGERS: Untrusted source");
            }
        }
        _title = string.concat(_prefix, _title);
        bytes memory _manager1Approval = managerApprovalsForTopic[_title][manager1].value;
        bytes memory _manager2Approval = managerApprovalsForTopic[_title][manager2].value;
        bytes memory _manager3Approval = managerApprovalsForTopic[_title][manager3].value;
        bytes memory _manager4Approval = managerApprovalsForTopic[_title][manager4].value;
        bytes memory _manager5Approval = managerApprovalsForTopic[_title][manager5].value;

        uint256 _totalValidVotes = 0;

        _totalValidVotes += managerApprovalsForTopic[_title][manager1].approved &&
            keccak256(_manager1Approval) == keccak256(_value)
            ? 1
            : 0;
        _totalValidVotes += managerApprovalsForTopic[_title][manager2].approved &&
            keccak256(_manager2Approval) == keccak256(_value)
            ? 1
            : 0;
        _totalValidVotes += managerApprovalsForTopic[_title][manager3].approved &&
            keccak256(_manager3Approval) == keccak256(_value)
            ? 1
            : 0;
        _totalValidVotes += managerApprovalsForTopic[_title][manager4].approved &&
            keccak256(_manager4Approval) == keccak256(_value)
            ? 1
            : 0;
        _totalValidVotes += managerApprovalsForTopic[_title][manager5].approved &&
            keccak256(_manager5Approval) == keccak256(_value)
            ? 1
            : 0;
        _isApproved = _totalValidVotes >= 3;
    }

    function getManagerApprovalsForTitle(string calldata _title)
        public
        view
        returns (TopicApproval[] memory _returnData)
    {
        _returnData = new TopicApproval[](5);
        _returnData[0] = managerApprovalsForTopic[_title][manager1];
        _returnData[1] = managerApprovalsForTopic[_title][manager2];
        _returnData[2] = managerApprovalsForTopic[_title][manager3];
        _returnData[3] = managerApprovalsForTopic[_title][manager4];
        _returnData[4] = managerApprovalsForTopic[_title][manager5];
    }

    function _compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function _indexOfTopic(string memory _element) private view returns (bool found, uint256 i) {
        for (i = 0; i < activeTopics.length; i++) {
            if (_compareStrings(activeTopics[i].title, _element)) {
                return (true, i);
            }
        }
        return (false, 0); //Cannot return -1 with type uint256. For that check the first parameter is true or false always.
    }
}
