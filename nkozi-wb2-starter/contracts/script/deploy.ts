import { ethers } from "hardhat";

async function main() {
  const artist = process.env.ARTIST!;
  const platform = process.env.PLATFORM!;
  const artistBps = 6000; // 60%

  const Split = await ethers.getContractFactory("RoyaltySplitter");
  const split = await Split.deploy(artist, platform, artistBps);
  await split.waitForDeployment();

  console.log("RoyaltySplitter deployed to:", await split.getAddress());
}

main().catch((e) => { console.error(e); process.exit(1); });
