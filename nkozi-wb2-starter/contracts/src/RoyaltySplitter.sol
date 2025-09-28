// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title RoyaltySplitter - forwards ETH with a simple basis-point split
/// @notice Minimal demo: 60% to artist, 40% to platform on ETH payments.
contract RoyaltySplitter is Ownable {
    address payable public artist;
    address payable public platform;

    uint16 public artistBps; // e.g., 6000 = 60%
    uint16 public constant DENOM = 10_000;

    event Split(address indexed payer, uint256 weiAmount, uint256 artistWei, uint256 platformWei);
    event ArtistUpdated(address indexed artist);
    event SplitsUpdated(uint16 artistBps);

    constructor(address payable _artist, address payable _platform, uint16 _artistBps)
        Ownable(msg.sender)
    {
        require(_artist != address(0) && _platform != address(0), "zero address");
        require(_artistBps > 0 && _artistBps < DENOM, "bps");
        artist = _artist;
        platform = _platform;
        artistBps = _artistBps;
    }

    receive() external payable { _splitEth(msg.value); }
    function split() external payable { _splitEth(msg.value); }

    function updateArtist(address payable _artist) external onlyOwner {
        require(_artist != address(0), "zero address");
        artist = _artist;
        emit ArtistUpdated(_artist);
    }

    function updateSplits(uint16 _artistBps) external onlyOwner {
        require(_artistBps > 0 && _artistBps < DENOM, "bps");
        artistBps = _artistBps;
        emit SplitsUpdated(_artistBps);
    }

    function _splitEth(uint256 value) internal {
        uint256 a = (value * artistBps) / DENOM;
        uint256 p = value - a;
        (bool sa, ) = artist.call{value: a}("");
        (bool sp, ) = platform.call{value: p}("");
        require(sa && sp, "send fail");
        emit Split(msg.sender, value, a, p);
    }
}
