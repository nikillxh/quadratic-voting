## Getting Started
**For Non-voter friends,**

**I Judged you non-voters so hard that I accidentally got internship under a Supreme Court Judge**

### Pre-requisite
Install npm, forge, anvil, etc

### How to run?
#### Terminal 1
Run the NextJS app
```
npm run dev
```

#### Terminal 2
Run the local chain
```
anvil
```

#### Terminal 3
1. Go to contracts folder
    ```
    cd contracts
    ```
2. Check out the `anvil_chain.md` and update the set PRIVATE_KEY according to your shell into `.env` file in this folder. Then set env variables.
    ```
    source .env
    ```
3. Run deploy script
    ```
    forge script script/QuadVoting.s.sol:DeployQuadVoting --rpc-url http://localhost:8545 --broadcast
    ```
4. Update `.env` with CONTRACT_ADDRESS with deployed address. Then update env variables.
    ```
    source .env
    ```
5. Run voter setup script
    ```
    forge script script/QuadVoting.s.sol:SetupVoters --rpc-url http://localhost:8545 --broadcast
    ```
6. Run vote casting script
    ```
    forge script script/QuadVoting.s.sol:CastVote --rpc-url http://localhost:8545 --broadcast
    ```