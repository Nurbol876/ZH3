const btn = document.getElementById("connect");
const accountEl = document.getElementById("account");
const balanceEl = document.getElementById("balance");
const transferBox = document.getElementById("transfer");
const sendBtn = document.getElementById("send");
const statusEl = document.getElementById("status");
const acc = document.querySelector(".acc")

let web3;
let account;


btn.onclick = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];
        accountEl.innerText = "Account: " + account;

        const balanceWei = await web3.eth.getBalance(account);
        const balanceEth = web3.utils.fromWei(balanceWei, "ether");
        balanceEl.innerText = "Balance: " + parseFloat(balanceEth).toFixed(4) + " ETH";
        btn.style.display = "none";
        transferBox.style.display = "block";
    } else {
        alert("⚠️ Please install MetaMask!");
    }
};
window.addEventListener("load", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            if (accounts.length > 0) {
                account = accounts[0];
                accountEl.innerText = "Account: " + account;

                const balanceWei = await web3.eth.getBalance(account);
                const balanceEth = web3.utils.fromWei(balanceWei, "ether");
                balanceEl.innerText = "Balance: " + parseFloat(balanceEth).toFixed(4) + " ETH";

                btn.style.display = "none";
                transferBox.style.display = "block";

            }
        } catch (err) {
            console.error("Autoconnect failed:", err);
        }
    }
});
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
            value: amountWei,
        });

        statusEl.innerText = `✅ Transaction sent! Hash: ${tx.transactionHash}`;
    } catch (error) {
        console.error(error);
        statusEl.innerText = "❌ Transaction failed: " + (error.message || error);
    }
};