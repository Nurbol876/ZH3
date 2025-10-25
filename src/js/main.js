const acc = document.getElementById("acc")
window.addEventListener("load", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            if (accounts.length > 0) {

                acc.innerText = "Profile";
            }
        } catch (err) {
            console.error("Autoconnect failed:", err);
        }
    }
});

let i = 0;
let txt = 'Welcome to Zhayil ETH tool';
let speed = 100;

function typeWriter() {
    if (i < txt.length) {
        document.getElementById("title").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}
typeWriter()
