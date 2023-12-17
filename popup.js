const themeData = "data-theme";
const tokenTheme = "themeId";
const tokenPreferences = "preferencesId";
const tokenWhishList = "whishListId";

let whishList = [];

let preferences = {
    method: 1,
    shippingCost: 150.0,
    porcentage: 0.7,
    currencyId: 7
};

document.addEventListener("DOMContentLoaded", async () => {
    startThemes();
    startTabs();
    loadConfigurationPreferences();
    startButtons();
    loadWishList();
});

const startButtons = () => {
    document.getElementById("saveConfig").addEventListener("click", saveNewConfigurationPreferences);
    document.getElementById("deleteWhishes").addEventListener("click", deleteWhishList);
    document.getElementById("resetConfig").addEventListener("click", resetConfigurationPreferences);
}

const startTabs = () => {
    const switchers = document.querySelectorAll(".tp-btn-tab");
    const tabs = document.querySelectorAll(".tab");

    for (let i = 0; i < switchers.length; i++) {
        let btn = switchers[i];
        btn.addEventListener("click", (e) => {
            switchers.forEach(tab => { tab.classList.remove("active") })
            btn.classList.add("active");
            let switchLine = document.querySelector(".tp-switch-line");
            switchLine.style.width = e.target.offsetWidth + "px";
            switchLine.style.left = e.target.offsetLeft + "px";

            tabs.forEach(content => { content.classList.remove("active") });
            tabs[i].classList.add("active");
        });
    }
}

const themes = ["Default Mode", "Solaris Mode", "Dark Mode 1", "Dark Mode 2"];
const themesId = ["default", "solaris-mode", "dark-mode-blue", "dark-mode-red"];
let btnThemes = document.getElementById("switchMode");
let htmlClassList = document.querySelector("html").classList;

const startThemes = () => {
    btnThemes = document.getElementById("switchMode");
    htmlClassList = document.querySelector("html").classList;
    loadThemePreference();
    btnThemes.addEventListener("click", () => {
        changeTheme();
    });
}

const changeTheme = () => {
    let currentThemeId = parseInt(btnThemes.getAttribute(themeData));
    htmlClassList.toggle(themesId[(currentThemeId)]);
    nextThemeId = currentThemeId + 1;
    if (nextThemeId >= themesId.length) {
        nextThemeId = 0;
    }
    updateTheme(nextThemeId);
    saveThemePreference(nextThemeId);
}

const updateTheme = (themeId) => {
    btnThemes.innerText = themes[themeId];
    btnThemes.setAttribute(themeData, themeId);
    htmlClassList.toggle(themesId[themeId]);
}

const loadThemePreference = () => {
    let themeId = localStorage.getItem(tokenTheme);
    if (!themeId) {
        console.info(`Couldn't load theme preference. \nThe value has been set to default (0)`);
        showMessage(false, "Couldn't load theme preference");
        themeId = 0;
        saveThemePreference(themeId);
    }
    updateTheme(themeId);
}

const saveThemePreference = (themeId) => {
    if (themeId < 0 || themeId >= themesId.length) {
        console.info(`Couldn't save theme preference. ThemeId: ${themeId} \nThe value has been set to default (0)`);
        showMessage(false, "Couldn't save theme preference");
        themeId = 0;
    }
    localStorage.setItem(tokenTheme, themeId);
}

const loadConfigurationPreferences = () => {
    chrome.storage.local.get({ tokenPreferences }, function (result) {
        const pre = result.tokenPreferences;
        if (!pre.currencyId) {
            console.info(`SolarisTruePriece. Couldn't load preferences. \nThe values have been set to default`);
            showMessage(false, "Couldn't load preferences");
            resetConfigurationPreferences();
            return;
        }
        preferences = pre;
        updateFields();
    });
}

const saveConfigurationPreferences = (options) => {
    chrome.storage.local.set({ tokenPreferences: options });
}

const updateFields = () => {
    document.getElementById(`ship-method${preferences.method}`).checked = true;
    document.getElementById("shipCost").value = preferences.shippingCost;
    document.getElementById("taxPercent").value = preferences.porcentage;
    document.getElementById("currency").value = preferences.currencyId;
}

const saveNewConfigurationPreferences = () => {
    preferences.method = document.querySelector('input[name="ship"]:checked').value;
    preferences.shippingCost = document.getElementById("shipCost").value;
    preferences.porcentage = document.getElementById("taxPercent").value;
    preferences.currencyId = document.getElementById("currency").value;
    saveConfigurationPreferences(preferences);
    showMessage(true, "Preferences Saved!");
}

const resetConfigurationPreferences = () => {
    setDefaultConfigurationPreferences();
    saveConfigurationPreferences(preferences);
    updateFields();
    showMessage(true, "Preferences reseted");
}

const setDefaultConfigurationPreferences = () => {
    preferences.currencyId = 0;
    preferences.method = 1;
    preferences.shippingCost = 100;
    preferences.porcentage = 0.7;
}

const deleteWhishList = () => {
    saveWhishList([]);
    loadWishList();
    showMessage(true, "No Wishes Left");
}

const showSaveMsg = (success) => {
    const msg = success ? "Save Completed!" : "Something Went Wrong! Try again?";
    showErrorMessage(msg);
}

const loadWishList = () => {
    chrome.storage.local.get({ tokenWhishList }, function (result) {
        whishList = result.tokenWhishList;

        if (!whishList) {
            whishList = [];
        }

        listWhishes();
        startItemButtons();
    });
}

const listWhishes = () => {
    const wishSpace = document.getElementById("whishes");
    wishSpace.innerHTML = "";

    for (let i = 0; i < whishList.length; i++) {
        const newItem = document.createElement("div");
        newItem.innerHTML =
            `
                <div class="tp-bookmark-item">
                    <div class="tp-item-title">
                        <h2>
                            <a target="_blank"
                                href="${whishList[i].url}">
                                ${whishList[i].title}
                            </a>
                        </h2>
                    </div>
                    <div class="tp-bookmark-item-flex">
                        <div class="tp-item-image-container">
                            <img class="tp-item-image"
                                src="${whishList[i].image}"
                                alt="">
                        </div>
                        <div class="tp-item-price">
                            <p class="tp-price tp-price-base">Base: <b>${whishList[i].price} </b>&nbsp;&nbsp;&nbsp;</p>
                            <p class="tp-price tp-price-true">True: <b>${whishList[i].truePrice} </b></p>
                            <p class="tp-price tp-price-ship">Shipping: <b>${whishList[i].shippingCost} </b>&nbsp&nbsp</p>
                        </div>
                    </div>
                    <div class="tp-item-actions">
                        <div class="tp-item-actions-button" title="Favorite">
                            <img class="tp-action-icon" src="./assets/${checkFavoriteImage(whishList[i].favorite)}" alt="">
                            <span name="favoriteItem" data-id="${whishList[i].id}">Favorite</span>
                        </div>
                        <div class="tp-item-actions-button" title="View">
                            <img class="tp-action-icon" src="./assets/tp-view-icon2.svg" alt="">
                            <span name="viewItem" data-id="${whishList[i].url}">View</span>
                        </div>
                        <div class="tp-item-actions-button" title="Delete">
                            <img class="tp-action-icon" src="./assets/tp-delete-icon2.svg" alt="">
                            <span name="deleteItem" data-id="${whishList[i].id}">Delete</span>
                        </div>
                    </div>
                </div>
            `;
        wishSpace.appendChild(newItem);
    }

    if (wishSpace.innerHTML == "") {
        wishSpace.innerHTML =`
    <div class="tp-bookmark-item">
        <div class="tp-item-title">
            <h2>
                <a>
                    Add something Already!
                </a>
            </h2>
        </div>
        <div class="tp-bookmark-item-flex">
        <div class="tp-item-image-container">
            <img class="tp-item-image"
                src="./assets/Stp-icon2.png"
                alt="">
        </div>
            <div class="tp-item-price">
                <p class="tp-price tp-price-base">Base: <b> Normal Price</b>&nbsp;&nbsp;&nbsp;</p>
                <p class="tp-price tp-price-true">True: <b> True Price </b></p>
                <p class="tp-price tp-price-ship">Shipping: <b> Shipping Cost </b>&nbsp&nbsp</p>
            </div>
        </div>
        <div class="tp-item-actions">
            <div class="tp-item-actions-button" title="Favorite">
                <img class="tp-action-icon" src="./assets/tp-favorited-icon.svg" alt="">
                <span>Favorite</span>
            </div>
            <a style="text-decoration: none; color: white;" target="_blank" href="https://solarisjapan.com/">
                <div class="tp-item-actions-button" title="View">
                    <img class="tp-action-icon" src="./assets/tp-view-icon2.svg" alt="">
                    <span>View</span>
                </div>
            </a>    
            <div class="tp-item-actions-button" title="Delete">
                <img class="tp-action-icon" src="./assets/tp-delete-icon2.svg" alt="">
                <span>Delete</span>
            </div>
        </div>
    </div>`
    }
}

const checkFavoriteImage = (isFavorite) => {
    if (isFavorite) {
        return "tp-favorited-icon.svg"
    }
    return "tp-favorite-icon.svg"
}

const startItemButtons = () => {

    const viewBtns = document.getElementsByName("viewItem");
    for (let i = 0; i < viewBtns.length; i++) {
        viewBtns[i].addEventListener("click", (e) => {
            window.open(e.target.dataset.id, "_blank");
        });
    }

    const deleteBtns = document.getElementsByName("deleteItem");
    for (i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener("click", (e) => {
            deleteItem(e.target.dataset.id);
        });
    }

    const favoriteBtns = document.getElementsByName("favoriteItem");
    for (i = 0; i < favoriteBtns.length; i++) {
        favoriteBtns[i].addEventListener("click", (e) => {
            favoriteItem(e.target.dataset.id);
        });
    }
}

const deleteItem = (id) => {
    const newList = [];
    chrome.storage.local.get({ tokenWhishList }, function (result) {
        whishList = result.tokenWhishList;
        for (i = 0; i < whishList.length; i++) {
            if (whishList[i].id != id) {
                newList.push(whishList[i]);
            }
        }
        saveWhishList(newList);
        loadWishList();
    });
}

const favoriteItem = (id) => {
    const newList = [];
    chrome.storage.local.get({ tokenWhishList }, function (result) {
        whishList = result.tokenWhishList;
        for (i = 0; i < whishList.length; i++) {
            if (whishList[i].id == id) {
                whishList[i].favorite = !whishList[i].favorite;
            }
            newList.push(whishList[i]);
        }
        saveWhishList(newList);
        loadWishList();
    });
}

const saveWhishList = (list) => {
    chrome.storage.local.set({ tokenWhishList: list });
}

//

const showMessage = (isSuccess, message) => {

    result = isSuccess ? "success" : "error";

    const container = document.getElementById(`${result}-message-container`);

    container.getElementsByTagName("span")[0].innerText = message;
    container.style = "display: block";

    const btn = document.getElementById(`close-${result}-btn`);

    btn.addEventListener("click", () => {
        container.className = `${result}-container message-container msg-hide`;
    });

    setTimeout(() => {
        container.className = `${result}-container message-container msg-hide`;
        setTimeout(() => {
            container.style = "display: none";
            container.className = `${result}-container message-container msg-show`;
        }, 1000);
    }, 4000);
}