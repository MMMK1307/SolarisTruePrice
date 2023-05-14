(() => {
    let priceButton;
    let currentFigureId = "";
    let figureTruePrice = "";
    let figurePriceDifference = "";
    let currencyTemp = 0;
    const ShippingMethods = ['saver', 'regular', 'express'];
    const currencyPatern1 = {
        decimal: ',',
        hundred: '.',
        id: 0
    };
    const currencyPatern2 = {
        decimal: '.',
        hundred: ',',
        id: 1
    };
    const currencySignsPatern = [currencyPatern1, currencyPatern2];
    let currencySignsPaternId = 0;

    const currency = {
        symbol: ['¥', '$', '€', '£', 'SFr.', '$', '$', 'R$'],
        country: ['JPY', 'USD', 'EUR', 'GBP', 'CHF', 'CAD', 'AUD', 'BRL']
    }

    let preferences = {
        method: 1,
        shippinCost: 150.0,
        porcentage: 0.7,
        currencyId: 7
    }

    const showPriceProducts = () => {

        const truePricebtnExists = document.getElementById("truePriceBtn");
        calculatePrice("h5--body product__price");

        if (truePricebtnExists) {
            document.getElementById('truePriceBtn').innerHTML = getTruePriceButton();
            return;
        }

        const truePrieceInfo = document.createElement("div");
        truePrieceInfo.className = "product-submit__btn product-submit__btn--red";

        const truePriceButton = document.createElement("button");
        truePriceButton.className = "btn btn__main-content add-js active:!tw-scale-90";
        truePriceButton.style = "background-color: rgb(153, 24, 153);";
        truePriceButton.id = "truePriceBtn";

        truePriceButton.innerHTML = getTruePriceButton();
        truePrieceInfo.appendChild(truePriceButton);

        priceButton = document.getElementsByClassName("product__form")[0];
        priceButton.appendChild(truePrieceInfo);
    }

    const getTruePriceButton = () => {
        return `
        <div class="product__sale-badge tw-animate-beat">
            <span class="sale-badge__percent">
                UNSALE ${preferences.porcentage * 100}% ON
            </span>
        </div>
        <div class="product__btn-text">
            <div class="product__btn-label">
                Add to WishList
            </div>
            <div class="product__btn-desc">
                price with taxes and shipping
            </div>
        </div>
        <div class="h5--body product__price" data-price-wrapper="">
            <span style="color: #f2ccf2; font-size: 12px; position: relative; right: 7%;"
                data-currency-${currency.country[currencyTemp].toLowerCase()}="${currency.symbol[currencyTemp]} ${figurePriceDifference} "
                data-currency="${currency.country[currencyTemp]}">
                    ${currency.symbol[currencyTemp]} ${figurePriceDifference}
            </span>
            <span class="money"
                data-currency-${currency.country[currencyTemp].toLowerCase()}="${currency.symbol[currencyTemp]} ${figureTruePrice}" data-currency="${currency.country[currencyTemp]}">
                ${currency.symbol[currencyTemp]} ${figureTruePrice}
            </span>
        </div>`;
    }

    const showPriceProductsList = () => {
        const productList = document.getElementsByClassName('product__labels-wrapper');

        for (let i = 0; i < productList.length; i++) {
            if (productList[i].innerText.includes('TRUE PRICE')) {
                continue;
            }

            let listedPrice = productList[i].getElementsByClassName('money')[0];

            if (listedPrice == null) {
                continue;
            }

            if (!listedPrice.innerText.includes(currency.symbol[currencyTemp])) {
                continue;
            }

            calculatePriceList(listedPrice);

            const buttonSpace = productList[i];
            buttonSpace.appendChild(getTruePriceListButton());
        }
    }

    const getTruePriceListButton = () => {
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'product-label product-label--pre-order tw-relative';
        buttonDiv.style = "background-color: rgb(153, 24, 153);";
        buttonDiv.innerHTML =
            `<span class="product-label__title">True Price</span> 
         <span class="price"> 
            <span class="money" data-currency="${currency.country[currencyTemp]}"> 
                ${currency.symbol[currencyTemp]} ${figureTruePrice}
            </span>
         </span>`;

        return buttonDiv;
    }

    const showPriceProductsSearch = () => {
        const productList = document.getElementsByClassName('product__labels-wrapper');

        for (let i = 0; i < productList.length; i++) {

            if (productList[i].innerText.includes('TRUE PRICE')) {
                if (productList[i].innerText.includes('not Available')) {
                    console.log("not Av");
                    const lent = (productList.length) - 1;
                    productList[lent].remove();
                } else {
                    continue;
                }
            }

            const listedPrice = productList[i].getElementsByClassName('money')[0];

            if (listedPrice == null) {
                figureTruePrice = "0.00 not Available";
                continue;
            }

            calculatePriceList(listedPrice);

            if (figureTruePrice.includes("NaN")) {
                continue;
            }

            const buttonSpace = productList[i];
            buttonSpace.appendChild(getTruePriceListButton());
        }
    }

    const addPorcetage = (cleanPrice) => {
        cleanPrice = cleanPrice.split(currency.symbol[currencyTemp]);
        cleanPrice = formatStringToFloat(cleanPrice[cleanPrice.length - 1]);
        calcPrice = ((cleanPrice + calcShipping) + ((cleanPrice + calcShipping) * preferences.porcentage)).toFixed(2);

        figurePriceDifference = formatNumberToString(((calcPrice - cleanPrice).toFixed(2)));
        figureTruePrice = formatNumberToString(calcPrice);
    }

    const calculatePrice = (selector) => {
        const allListedPrices = document.getElementsByClassName(selector);

        if (allListedPrices.length < 1) {
            figureTruePrice = "0.00 not Available";
            return;
        }

        calcShipping = getShippingPrice();
        addPorcetage(allListedPrices[0].innerText);
    }

    const calculatePriceList = (priceElement) => {
        calcShipping = preferences.shippinCost;
        addPorcetage(priceElement.innerText);
    }

    const formatNumberToString = (ogNumber) => {

        if (currencySignsPaternId == currencyPatern1.Id) {
            ogNumber = ogNumber.toString().replace('.', ',');
        }

        if (ogNumber.length > 6) {
            pointposition = ogNumber.length - 6;
            ogNumber = [ogNumber.slice(0, pointposition), currencySignsPatern[currencySignsPaternId].hundred, ogNumber.slice(pointposition)].join('');
        }
        return ogNumber;
    }

    const formatStringToFloat = (ogString) => {
        if (currencySignsPaternId == currencyPatern1.id) {
            return parseFloat(ogString.replace('.', '').replace(',', '.'));
        }
        return parseFloat(ogString);
    }

    const getCurrencyPatern = () => {
        if (currencyTemp == 0 || currencyTemp == 7) {
            currencySignsPaternId = currencyPatern1.id;
            return;
        }
        currencySignsPaternId = currencyPatern2.id;
    }

    const updateCurrency = () => {
        let currencyExample = document.getElementsByClassName('money')[0].innerText.split(' ')[0];

        for (i = 0; i < currencyExample.length; i++) {
            if (!isNaN(currencyExample.charAt(i))) {
                currencyExample = currencyExample.substring(0, i);
            }
        }

        for (i = 0; i < currency.symbol.length; i++) {
            if (currencyExample == currency.symbol[i]) {
                currencyTemp = i;
                return;
            }
        }
        console.log("Default Currency");
        currencyTemp = preferences.currencyId;
    }

    const receivePageLoad = (type, figureId) => {
        console.log(type);

        currentFigureId = figureId;
        updateCurrency();
        getCurrencyPatern();
        stopObserving();

        switch (type) {
            case 'home':
                showPriceProductsList();
                break;
            case 'products':
                showPriceProducts();
                break;
            case 'collections':
                showPriceProductsList();
                break;
            case 'search':
                showPriceProductsSearch();
                break;
            default:
                console.log("Didn't quite work. " + type);
        }
        startObserving();
    }

    const getShippingPrice = () => {

        let listShippingPrices = document.getElementsByClassName('worldwide-shipping')[0].getElementsByClassName('money');
        let returnPrice;

        if (listShippingPrices.length > 0) {

            if (!listShippingPrices[1].innerText.includes(currency.symbol[currencyTemp])) {
                return preferences.shippinCost;
            }

            if (document.querySelector("#" + ShippingMethods[preferences.method] + " .money")) {
                returnPrice = listShippingPrices[preferences.method].innerText;
            } else {
                returnPrice = listShippingPrices[0].innerText;
            }

            return formatStringToFloat(returnPrice.split(currency.symbol[currencyTemp])[1]);
        }
        return preferences.shippinCost;
    }
    
    const windowReloaded = () => {
        const url = window.location.href;
        if (url && url.includes("solarisjapan.com")) {
            const linkInfo = url.split("com")[1];
            let productType = linkInfo.split("/")[1];

            if (linkInfo.includes('products')) {
                productType = 'products';
            }

            if (linkInfo == '/') {
                receivePageLoad('home', '');
                return;
            }
            receivePageLoad(productType, linkInfo.split("/")[2].split("?")[0]);
        }
    }

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    let observer = new MutationObserver(function (mutations, observer) {
        if (mutations.length > 2) {
            windowReloaded();
        }
    });

    const startObserving = () => {
        observer.observe(document, {
            subtree: true,
            childList: true,
        });
    }

    const stopObserving = () => {
        observer.disconnect();
    }

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, figureId } = obj;
        receivePageLoad(type, figureId);
    });

    window.addEventListener("load", function () {
        console.log("Window Refresh");
        windowReloaded();
    });
})();