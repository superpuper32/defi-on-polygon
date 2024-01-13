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

  const mint = async (user: SignerWithAddress, amount: number) => {
	// We mock different users with the `connect` method
    const tx = await goflow.connect(user).mint(amount);
    await tx.wait();
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

  describe("Minting", () => {
    it("Should mint tokens to user", async () => {
      await mint(owner, 100);
      expect(await goflow.balanceOf(owner.address)).to.equal(100);
    });
  });

  describe("Transfer", () => {
    it("Should transfer tokens to user", async () => {
      await mint(owner, 200);
      await goflow.transfer(otherAccount.address, 100);
      expect(await goflow.balanceOf(owner.address)).to.equal(100);
      expect(await goflow.balanceOf(otherAccount.address)).to.equal(100);
    });
  });

  describe("TransferFrom", () => {
    it("Should transferFrom tokens to user", async () => {
      await mint(owner, 100);

      const approve = await goflow.approve(otherAccount.address, 100);
      await approve.wait();

      const transferFrom = await goflow.connect(otherAccount).transferFrom(owner.address, otherAccount.address, 100);
      await transferFrom.wait();

      expect(await goflow.balanceOf(owner.address)).to.equal(0);
      expect(await goflow.balanceOf(otherAccount.address)).to.equal(100);
    });

    it("Should not allow a spender to transfer more tokens than they have", async () => {
        await mint(owner, 100); // owner should start with 100 tokens
        expect(await goflow.balanceOf(owner.address)).to.equal(100);

        // the approve method should throw an error 
        // if the user tries to approve more tokens than they have
        // NOTE: move `await` to the beginning of the expect statement
        // NOTE: the error message comes from our approve method's `require` statement
        await expect(goflow.approve(otherAccount.address, 200)).to.be.revertedWith('insufficient balance for approval!');
    });
  });
});