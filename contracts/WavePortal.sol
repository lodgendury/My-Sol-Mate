// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract TinderPortal {

   
    event NewMatch(uint userId, string name, uint magicNum);

    uint magicDigits = 3;
    uint magicModulus = 10 ** magicDigits;

    struct User {
        string name;
        uint magicNum;
    }

    User[] public users;

    function _createMatch(string memory _name, uint _magicNum) private {
        users.push(User(_name, _magicNum));
        uint id = users.length - 1;
        emit NewMatch(id, _name, _magicNum);
        
    }

    function _generateRandomMagicNum(string memory _str) public view returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(_str)));
        return rand % magicModulus;
    }

    function createRandomMatch(string memory _name) public {
        uint randMagic = _generateRandomMagicNum(_name);
        _createMatch(_name, randMagic);
    }

}
