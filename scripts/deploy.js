const main = async () => {
  const tinderContractFactory = await hre.ethers.getContractFactory("TinderPortal");
  const tinderContract = await tinderContractFactory.deploy();

  await tinderContract.deployed();

  console.log("TinderPortal address: ", tinderContract.address);
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