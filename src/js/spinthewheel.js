    const kef = document.querySelector("#kef")
    const result = document.querySelector("#result")
    const guess = document.querySelector("#guess")
    const acc = document.querySelector("#acc")
    let web3;
    let account;
    let balance=-1;
    let gss;
    let isK = 0, isG = 0;
    let won;
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
    window.addEventListener("load", async () => {
    if (isMetaMaskInstalled()) {
    await switchToSepolia();

    web3 = new Web3(window.ethereum);
    try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length > 0) {
    account = accounts[0];
    const balanceWei = await web3.eth.getBalance(account);
    const balanceEth = web3.utils.fromWei(balanceWei, "ether");
    balance = parseFloat(balanceEth).toFixed(5);
    acc.innerText = "Profile";
}
} catch (err) {
    console.error("Autoconnect failed:", err);
    result.innerHTML = "Connect metamask first!"
    result.style.color = "red";
    kef.readOnly = true;
}
}
});

    const sectors = Array.from({ length: 100 }, (_, i) => {
    const num = i + 1;
    const isEven = num % 2 === 0;
    return {
    color: isEven ? "#000" : "#d62828",
    text: "#fff",
    label: num.toString()
};
});
    kef.addEventListener("change", (e) => {
    e.preventDefault()
    isK = 1;
    if(e.target.value > balance){
    result.innerHTML = `Not enough eth`;
    result.style.color = "yellow";
    isK = 0;
}else{
    let win = e.target.value * 25;
    won = win;
    result.innerHTML = `You can win: <br\> ${win.toFixed(4)}eth`;
    result.style.color = "#fff";
}

})
    guess.addEventListener("change", (e) => {
    e.preventDefault()
    isG = 1;
    gss = e.target.value
})
    const events = {
    listeners: {},
    addListener: function (eventName, fn) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(fn);
},
    fire: function (eventName, ...args) {
    if (this.listeners[eventName]) {
    for (let fn of this.listeners[eventName]) {
    fn(...args);
}
}
},
};

    const rand = (m, M) => Math.random() * (M - m) + m;
    const tot = sectors.length;
    const spinEl = document.querySelector("#spin");
    const ctx = document.querySelector("#wheel").getContext("2d");
    const dia = ctx.canvas.width;
    const rad = dia / 2;
    const PI = Math.PI;
    const TAU = 2 * PI;
    const arc = TAU / tot;

    const friction = 0.997;
    let angVel = 0;
    let ang = 0;
    let spinButtonClicked = false;

    const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

    function drawSector(sector, i) {
    const ang = arc * i;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = sector.text;
    ctx.font = "bold 22px \"Bitcount Grid Single\", system-ui";
    ctx.fillText(sector.label, rad - 10, 10);

    ctx.restore();
}

    function rotate() {
    const sector = sectors[getIndex()];
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
    if(angVel) {
    guess.readOnly  = true;
    kef.readOnly = true;
    spinEl.textContent = sector.label;
}else{
    guess.readOnly  = false;
    kef.readOnly = false;
}
    spinEl.style.background = sector.color;
    spinEl.style.color = sector.text;
}

function frame() {
    if (!angVel && spinButtonClicked) {

    const finalSector = sectors[getIndex()];
    events.fire("spinEnd", finalSector);
    spinButtonClicked = false;
    return;
}
    angVel *= friction;
    if (angVel < 0.002) angVel = 0;
    ang += angVel;
    ang %= TAU;
    rotate();
}

    function engine() {
    frame();
    requestAnimationFrame(engine);
}

    function init() {
    sectors.forEach(drawSector);
    rotate();
    engine();
        if(isG && isK) {
            spinEl.addEventListener("click", () => {
                if (!angVel) angVel = rand(0.25, 0.45);
                spinButtonClicked = true;
            });
        }

}

    init();
    async function sendStake(amountEth) {
    const amountWei = web3.utils.toWei(amountEth, "ether");
    const tx = await web3.eth.sendTransaction({
    from: account,
    to: "0xc168cfbb0a8ded7d940d144d21bdbb8067ff2bee",
    value: amountWei,
});
    console.log("Stake sent:", tx.transactionHash);
}

    async function sendPrize(amountEth) {
    const amountWei = web3.utils.toWei(amountEth, "ether");
    const tx = await web3.eth.sendTransaction({
    from: "0xc168cfbb0a8ded7d940d144d21bdbb8067ff2bee",
    to: account,
    value: amountWei,
});
    console.log("Prize sent:", tx.transactionHash);
}

    events.addListener("spinEnd", async (sector) => {
    if (sector.label === gss) {
    alert(`You won ${won} 🤩`);
    await sendPrize(won);
} else {
    alert("You lose 😥");
    await sendStake(kef.value);
}
});

