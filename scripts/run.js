const main = async () => {
  const tinderContractFactory = await hre.ethers.getContractFactory("TinderPortal");
  const tinderContract = await tinderContractFactory.deploy();
  await tinderContract.deployed();
  console.log("Contract addy:", tinderContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    tinderContract.address
  );
  

  /*
   * Let's try two waves now
   */
  const tinderTxn = await tinderContract.createRandomMatch("This is match #1");
  await tinderTxn.wait();

  const tinderTxn2 = await tinderContract.createRandomMatch("This is match #2");
  await tinderTxn2.wait();

  contractBalance = await hre.ethers.provider.getBalance(tinderContract.address);
  
  let randomNum = await tinderContract._generateRandomMagicNum("This is Random Num");
  console.log(randomNum);
  
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();