const btn = document.getElementById("connect");
const accountEl = document.getElementById("account");
const balanceEl = document.getElementById("balance");
const transferBox = document.getElementById("transfer");
const sendBtn = document.getElementById("send");
const statusEl = document.getElementById("status");

const buyBtn = document.createElement("button");
buyBtn.textContent = "💰 Buy Ethereum";
buyBtn.id = "buy";
buyBtn.style.display = "none";
document.querySelector(".content").appendChild(buyBtn);

let web3;
let account;

const SEPOLIA_PARAMS = {
    chainId: "0xaa36a7",
    chainName: "Sepolia Test Network",
    nativeCurrency: {
        name: "SepoliaETH",
        symbol: "ETH",
        decimals: 18
    },
    rpcUrls: ["https://rpc.sepolia.org"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"]
};

function isMetaMaskInstalled() {
    return typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask;
}

async function switchToSepolia() {
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: SEPOLIA_PARAMS.chainId }]
        });
    } catch (switchError) {
        if (switchError.code === 4902) {
            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [SEPOLIA_PARAMS]
            });
        } else {
            console.error("Failed to switch network:", switchError);
        }
    }
}

btn.onclick = async () => {
    if (!isMetaMaskInstalled()) {
        alert("⚠️ Please install MetaMask from https://metamask.io/");
        return;
    }

    await switchToSepolia(); // Переключаем на Sepolia

    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
    accountEl.innerText = "Account: " + account;

    const balanceWei = await web3.eth.getBalance(account);
    const balanceEth = web3.utils.fromWei(balanceWei, "ether");
    balanceEl.innerText = "Balance: " + parseFloat(balanceEth).toFixed(6) + " ETH";

    btn.style.display = "none";
    transferBox.style.display = "block";
    buyBtn.style.display = "inline-block";
};

window.addEventListener("load", async () => {
    if (isMetaMaskInstalled()) {
        await switchToSepolia();

        web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            if (accounts.length > 0) {
                account = accounts[0];
                accountEl.innerText = "Account: " + account;

                const balanceWei = await web3.eth.getBalance(account);
                const balanceEth = web3.utils.fromWei(balanceWei, "ether");
                balanceEl.innerText = "Balance: " + parseFloat(balanceEth).toFixed(6) + " ETH";

                btn.style.display = "none";
                transferBox.style.display = "block";
                buyBtn.style.display = "inline-block";
            }
        } catch (err) {
            console.error("Autoconnect failed:", err);
        }
    }
});

// 💸 Отправка транзакции
sendBtn.onclick = async () => {
    const to = document.getElementById("toAddress").value.trim();
    const amount = document.getElementById("amount").value.trim();

    if (!web3 || !account) {
        return alert("❗ Please connect MetaMask first!");
    }

    if (!to || !amount) {
        return alert("⚠️ Enter receiver address and amount!");
    }

    try {
        statusEl.innerText = "⏳ Sending transaction...";
        const amountWei = web3.utils.toWei(amount, "ether");

        const tx = await web3.eth.sendTransaction({
            from: account,
            to,
            value: amountWei
        });

        statusEl.innerText = `✅ Transaction sent! Hash: ${tx.transactionHash}`;
    } catch (error) {
        console.error(error);
        statusEl.innerText = "❌ Transaction failed: " + (error.message || error);
    }
};
buyBtn.onclick = () => {
    window.open("https://portfolio.metamask.io/buy", "_blank");
};
