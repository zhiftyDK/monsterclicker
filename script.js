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
    ["Gex fans", "Gex fans drikker uvirkelige mængder af monster, automatisk 5 pant hvert sekund, buch mann!", "gexfan", 120, "gex.jpg", 5],
    ["Landmænd", "Landmænd skal meget tidligt op om morgenen, automatisk 10 pant hvert sekund!", "landmand", 200, "farmer.png", 10],
    ["Software studerende", "Disse studerende har det hårdt, software er ikke nemt, automatisk 12 pant hvert sekund!", 250, "programmer.png", 12],
    ["Karen", "Det kræver helt sikkert en masse energi at være så sur hele tiden, automatisk 15 pant hvert sekund!", 270, "karen.png", 15],
    ["Mcdonalds medarbejder", "Ingen gider at arbejde på mcdonalds det kræver noget specielt, automatisk 20 pant hvert sekund!", 340, "mcdonalds.png", 20]
];
function unlockUpgrade(i) {
    if(i !== false) {
        addUpgrade(upgrades[i][0], upgrades[i][1], upgrades[i][2], upgrades[i][3], upgrades[i][4], upgrades[i][5]);
        unlockedUpgrades.push(upgrades[i]);
        upgrades[i] = false;
    }
}

//Save progress
function saveProgress() {
    let formattedUpgrades = [];
    if(unlockedUpgrades.length > 0) {
        unlockedUpgrades.forEach(upgrade => {
            const upgradeId = upgrade[2];
            formattedUpgrades.push({"upgrade": upgrade, "count": parseInt(document.getElementById(`${upgradeId}count`).innerText), "currentprice": document.getElementById(`${upgradeId}btn`).innerText})
        });
    } else {
        formattedUpgrades = false;
    }
    const save = {
        "defaultUpgrades": [
            {"clickercount": parseInt(clickercount.innerText), "currentprice": document.getElementById("clickerbtn").innerText},
            {"trampercount": parseInt(document.getElementById("trampercount").innerText), "currentprice": document.getElementById("tramperbtn").innerText}
        ],
        "upgrades": formattedUpgrades,
        "pant": parseInt(monsterPoint.innerText)
    };
    localStorage.setItem("monsterClickerSave", JSON.stringify(save));
}

setInterval(() => {
    saveProgress()
}, 1000);

//Load progress on page load
if(localStorage.getItem("monsterClickerSave")) {
    const save = JSON.parse(localStorage.getItem("monsterClickerSave"));
    monsterPoint.innerHTML = save.pant
    document.getElementById("tramperbtn").setAttribute("onclick", `buyUpgrade('tramper', ${parseInt(save.defaultUpgrades[1].currentprice.replace(" pant", ""))}, 1);`)
    document.getElementById("tramperbtn").innerText = save.defaultUpgrades[1].currentprice;
    document.getElementById("trampercount").innerText = save.defaultUpgrades[1].trampercount;
    document.getElementById("clickerbtn").innerText = save.defaultUpgrades[0].currentprice;
    document.getElementById("clickercount").innerText = save.defaultUpgrades[0].clickercount;
    document.getElementById("cpsStats").innerText = parseInt(document.getElementById("cpsStats").innerText) + parseInt(save.defaultUpgrades[1].trampercount);
    if(save.upgrades) {
        save.upgrades.forEach(upgrade => {
            unlockedUpgrades.push(upgrade.upgrade)
            addUpgrade(upgrade.upgrade[0], upgrade.upgrade[1], upgrade.upgrade[2], upgrade.upgrade[3], upgrade.upgrade[4], upgrade.upgrade[5])
            document.getElementById(`${upgrade.upgrade[2]}btn`).innerText = upgrade.currentprice;
            document.getElementById(`${upgrade.upgrade[2]}count`).innerText = upgrade.count;
            document.getElementById(`${upgrade.upgrade[2]}btn`).setAttribute("onclick", `buyUpgrade('${upgrade.upgrade[2]}', ${parseInt(upgrade.currentprice.replace(" pant", ""))}, ${upgrade.upgrade[5]});`)
        });
    }
}