import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

describe('Goflow', function () {
  let goflow: Contract, owner: SignerWithAddress, otherAccount: SignerWithAddress;

  const deployContract = async () => {
    // Contracts are deployed using the first signer/account by default
    // but we can create multiple user accounts for testing
    const [_owner, _otherAccount] = await ethers.getSigners();

    // Make sure the string argument passed to getContractFactory matches
    // the exact name of your token contract!
    const Goflow = await ethers.getContractFactory('Goflow');
    goflow = await Goflow.deploy();

    owner = _owner;
    otherAccount = _otherAccount;
  };

  beforeEach(async () => {
    await deployContract();
  });

  describe('Deployment', () => {
    it('Should deploy and return correct symbol', async () => {
      // If you've changed the symbol/name of your token then change it here
      expect(await goflow.symbol()).to.equal('GOFLOW');
    });
  });
});