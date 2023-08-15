const monster = document.getElementById("monster");
const monsterPoint = document.getElementById("monsterPoint");

//Eksponentiel funktion til prisberegning
function ekspo(x) {
    result = x ** 1.1;
    return Math.floor(result)
}

//Køb clicks per second
const clickerbtn = document.getElementById("clickerbtn");
const clickercount = document.getElementById("clickercount");
let clickerPris = 48;
clickerbtn.innerText = `${clickerPris} pant`;
clickerbtn.addEventListener("click", () => {
    if(parseInt(monsterPoint.innerText) >= clickerPris) {
        clickercount.innerText = parseInt(clickercount.innerText) + 1;
        monsterPoint.innerText = parseInt(monsterPoint.innerText) - clickerPris;
        clickerPris = ekspo(clickerPris);
        clickerbtn.innerText = `${clickerPris} pant`;
        document.getElementById("cpcStats").innerText = 1 + parseInt(clickercount.innerText);
    } else {
        console.log("ik nok");
    }
});

// Clicker funktion
monster.addEventListener("click", () => {
    const multiplier = 1 + parseInt(clickercount.innerText);
    monster.classList.add("monsterclick");
    setTimeout(() => {
        monster.classList.remove("monsterclick");
    }, 100);
    monsterPoint.innerText = parseInt(monsterPoint.innerText) + 1 * multiplier;
});

//Autoclicker
setInterval(() => {
    monsterPoint.innerText = parseInt(monsterPoint.innerText) + parseInt(document.getElementById("cpsStats").innerText);
}, 1000);

// Buy upgrade
function buyUpgrade(id, price, cps) {
    const count = document.getElementById(`${id}count`);
    const btn = document.getElementById(`${id}btn`);
    if(parseInt(monsterPoint.innerText) >= price) {
        count.innerText = parseInt(count.innerText) + 1;
        monsterPoint.innerText = parseInt(monsterPoint.innerText) - price;
        price = ekspo(price);
        btn.innerText = `${price} pant`;
        btn.setAttribute("onclick", `buyUpgrade('${id}', ${price}, ${cps});`)
        document.getElementById("cpsStats").innerText = parseInt(document.getElementById("cpsStats").innerText) + cps;
    } else {
        console.log("ik nok");
    }
}

//Add upgrades
let upgradeIndex = 0;
function addUpgrade(name, desc, id, price, img, cps) {
    const upgrades = document.getElementById("upgrades");
    const template = `
    <div class="col-2">
        <img src="./images/${img}" alt="" width="80%">
    </div>
    <div class="col">
        <h5>${name}: <span id="${id}count">0</span></h5>
        <p class="m-1">${desc}</p>
    </div>
    <div class="col-3 text-center">
        <button class="btn btn-main" id="${id}btn" onclick="buyUpgrade('${id}', ${price}, ${cps}); unlockUpgrade(${upgradeIndex})">${price} pant</button>
    </div>
    `;
    upgradeIndex++;
    const hr = document.createElement("hr");
    upgrades.appendChild(hr);
    const div = document.createElement("div");
    div.id = id;
    div.classList = "row justify-content-center align-items-center g-2 p-4 pt-0 pb-0";
    div.innerHTML = template;
    upgrades.appendChild(div);
}

addUpgrade("Trampertøser", "En trampertøs drikker hurtigt, men tramper nogengange på panten, automatisk 1 pant hvert sekund!", "tramper", 34, "tramper.png", 1);

// Unlock upgrades
let unlockedUpgrades = [];
let upgrades = [
    ["HTX'ere", "En htx'er drikker mange monstere, automatisk 3 pant hvert sekund!", "htxer", 72, "nerd.png", 3],
    ["Gex fans", "Gex fans drikker uvirkelige mængder af monster, automatisk 5 pant hvert sekund, buch mann!", "gexfan", 120, "gex.jpg", 5]
];
function unlockUpgrade(i) {
    addUpgrade(upgrades[i][0], upgrades[i][1], upgrades[i][2], upgrades[i][3], upgrades[i][4], upgrades[i][5]);
    unlockedUpgrades.push(upgrades[i]);
    upgrades[i] = false;
}

//Save progress
function saveProgress() {
    let formattedUpgrades = [];
    if(unlockedUpgrades.length > 0) {
        unlockedUpgrades.forEach(upgrade => {
            const upgradeId = upgrade[2];
            formattedUpgrades.push({"upgrade": upgrade, "count": parseInt(document.getElementById(`${upgradeId}count`).innerText)})
        });
    } else {
        formattedUpgrades = false;
    }
    const save = {
        "defaultUpgrades": {
            "clickercount": parseInt(clickercount.innerText),
            "trampercount": parseInt(document.getElementById("trampercount").innerText)
        },
        "upgrades": formattedUpgrades,
        "pant": parseInt(monsterPoint.innerText)
    };
    localStorage.setItem("monsterClickerSave", JSON.stringify(save));
}

function loadProgress() {
    const save = JSON.parse(localStorage.getItem("monsterClickerSave"));
    console.log(save);
}