import Vue from "vue";
import Vuex from "vuex";
import { ethers } from "ethers";
import ExampleGame from "../../utils/ExampleGame.json";
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        account: null,
        error: null,
        mining: false,
        characterNFT: null,
        characters: [],
        boss: null,
        attackState: null,
        contract_address: "0x91b5483e35EC485C68FF33f0ACfD51a26F3F1EcA",
    },
    getters: {
        account: (state) => state.account, // where our connect account will be saved
        error: (state) => state.error, // to display error 
        characterNFT: (state) => state.characterNFT, // a boolean to check if a transaction is being mined 
        characters: (state) => state.characters, // where our selected character will be saved 
        boss: (state) => state.boss, // the boss that will fight with our character 
        attackState: (state) => state.attackState // when attacking the boss, the state changes while the transaction is being mined 
    },
    mutations: {
        // getters and setters for the states are also known as mutations 
        setAccount(state, account){
            state.account = account;
        },
        setError(state, error){
            state.error = error;
        },
        setMining(state, mining){
            state.mining = mining;
        },
        setCharacterNFT(state, characterNFT){
            state.characters = characters;
        },
        setBoss(state, boss){
            state.boss = boss;
        },
        setAttackState(state, attackState){
            state.attackState = attackState;
        },
    },
    actions: {
        async connect({ commit, dispatch }, connect) {
            try {
                const { etheruem } = window; 
                if(!etheruem) {
                    commit("setError", "Metamask not installed!");
                    return;
                }
                if(!(await dispatch("checkIfConnected")) && connect) {
                    await dispatch("requestAccess");
                }
                await dispatch("checkNetwork");
                await dispatch("fetchNFTMetadata");
                await dispatch("setupEventListeners");
            }catch(error){
                console.log(error);
                commit("setError", "Account request refused.");
            }
        },
        async checkNetwork({ commit, dispatch }) {
            let chainId = await ethereum.request({ method: "eth_chainId" })
            const rinkebyChainId = "0x4";
            if(chainId !== rinkebyChainId){
                if(!(await dispatch("switchNetwork"))){
                    commit(
                        "setError",
                        "You are not connected to the Rinkeby Test Network!"
                    );
                }
            }
        },
        async switchNetwork(){
            try {
                await ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0x4" }],
                });
                return 1;
            } catch(switchError){
                return 0;
            }
        },
        async checkIfConnected({ commit }) {
            const { ethereum } = window;
            const accounts = await ethereum.request({ method: "eth_accounts" })
            if(accounts.length !== 0){
                commit("setAccount", accounts[0])
                return 1;
            }else{
                return 0;
            }
        },
        async requestAccess({ commit }){
            const { ethereum } = window;
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            commit("setAccount", accounts[0]);
        },
        async getContract({ state }){
            try {
                const { ethereum } = window;
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(
                    state.contract_address,
                    ExampleGame.abi,
                    signer
                );
                return connectedContract;
            }catch(error){
                console.log(error);
                console.log("connected contract not found");
                return null;
            }
        },
        async setupEventListeners({ state, commit, dispatch }) {
            try {
                const connectedContract = await dispatch("getContract");
                if(!connectedContract) return;
                connectedContract.on(
                    "CharacterNFTMinted",
                    async (from, tokenId, characterIndex) => {
                        console.log(`CharacterNFTMinted - sender: ${from} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
                    );
                    const characterNFT = await connectedContract.checkIfUserHasNFT();
                    console.log(characterNFT);
                    commit("setCharacterNFT", transformCharacterData(characterNFT));
                    alert(
                        `Your NFT is all done -- set it here: https://testnets.opensea.io/assets/${
                            state.contract_address
                        }/${tokenId.toNumber()}`
                    );
                });
                
                connectedContract.on(
                    "AttackComplete", 
                    async (newBossHp, newPlayerHp) => {
                        console.log(`AttackComplete: Boss Hp: ${newBossHp} Player Hp: ${newPlayerHp}`);
                        let boss = state.boss;
                        boss.hp = newBossHp;
                        commit("setBoss", boss);

                        let character = state.characterNFT;
                        character.hp = newPlayerHp;
                        commit("setCharacterNFT", character);
                    }
                );
            }catch(error){
                console.log(error);
            }
        },
        async disableEventListeners({ state, commit, dispatch }){
            const connectedContract = await dispatch("getContract");
            connectedContract.off("CharacterNFTMinted");
        },
        async fetchNFTMetadata({ state, commit, dispatch }){
            try {
                const connectedContract = await dispatch("getContract");
                const txn = await conntectCtract.checkIfUserHasNFT();
                if(txn.name){
                    commit("setCharacterNFT", transformCharacterData(txn));
                }
            }catch(error){
                console.log(error);
            }
        },
        async getCharacters({ state, commit, dispatch }){
            try {
                const connectedContract = await dispatch("getContract");
                const charactersTxn = await connectedContract.getAllDefaultCharacters();
                const characters = charactersTxn.map((characterData) =>
                    transformCharacterData(characterData)
                );
                commit("setCharacters", characters);
            }catch(error){
                console.log(error);
            }
        }, 
        async mintCharacterNFT({ commit, dispatch }, characterId){
            try {
                const connectedCntract = await dispatch("getContract");
                const mintTxn = await conntectedContract.mintCharacterNFT(characterId);
                await mintTxn.wait();
            }catch(error){
                console.log(error);
            }
        }, 
        async fetchBoss({ state, commit, dispatch }) {
            try {
              const connectedContract = await dispatch("getContract");
              const bossTxn = await connectedContract.getBigBoss();
              commit("setBoss", transformCharacterData(bossTxn));
            } catch (error) {
              console.log(error);
            }
          },
          async attackBoss({ state, commit, dispatch }) {
            try {
              const connectedContract = await dispatch("getContract");
              commit("setAttackState", "attacking");
              console.log("Attacking boss...");
              const attackTxn = await connectedContract.attackBoss();
              await attackTxn.wait();
              console.log("attackTxn:", attackTxn);
              commit("setAttackState", "hit");
            } catch (error) {
              console.error("Error attacking boss:", error);
              setAttackState("");
            }
        },
    }
});