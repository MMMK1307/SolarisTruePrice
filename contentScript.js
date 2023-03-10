(() => {
    let priceButton;
    let currentFigureId = "";
    let figureTruePrice = "";
    let figurePriceDifference = "";
    let ShippingMethods = ['saver', 'regular', 'express'];
    let preferences = {
        method: 1,
        shippinCost: 150.0,
        porcentage: 0.7,
        currency: 'BR'
    }

    const showPriceProducts = () => {

        const truePricebtnExists = document.getElementById("truePriceBtn")

        if (!truePricebtnExists) {

            const truePrieceInfo = document.createElement("div");
            truePrieceInfo.className = "product-submit__btn product-submit__btn--red"

            const truePriceButton = document.createElement("button");
            truePriceButton.className = "btn btn__main-content add-js active:!tw-scale-90";
            truePriceButton.style = "background-color: rgb(153, 24, 153);";
            truePriceButton.id = "truePriceBtn";

            calculatePrice("h5--body product__price");

            const btnText = document.createElement("div");
            btnText.innerHTML = '<div class="product__sale-badge tw-animate-beat"><span class="sale-badge__percent">'
                + 'UNSALE ' + preferences.porcentage * 100 + '% ON</span>'
                + '</div><div class="product__btn-text"><div class="product__btn-label">Add to WishList</div>'
                + '<div class="product__btn-desc">price with taxes and shipping</div></div>'
                + '<div class="h5--body product__price" data-price-wrapper="">'
                + '<span style="color: #f2ccf2; font-size: 12px; position: relative; right: 7%;"'
                + 'data-currency-brl="R$ ' + figurePriceDifference + '" data-currency="BRL">R$ ' + figurePriceDifference + '</span>'
                + '<span class="money"'
                + 'data-currency-brl="R$ ' + figureTruePrice + '" data-currency="BRL">R$ ' + figureTruePrice + '</span></div>'

            truePriceButton.innerHTML = btnText.innerHTML;
            truePrieceInfo.appendChild(truePriceButton);

            priceButton = document.getElementsByClassName("product__form")[0];
            priceButton.appendChild(truePrieceInfo);
        }
    }

    const  showPriceProductsList = () => {
        const productList = document.getElementsByClassName('product__labels-wrapper');
        observer.disconnect();

        for (let i = 0; i < productList.length; i++) {

            if (productList[i].innerText.includes('TRUE PRICE'))
                continue;
            
            let listedPrice = productList[i].getElementsByClassName('money')[0];

            if (listedPrice == null)
                continue;
            
            if (!listedPrice.innerText.includes('R$'))
                continue;

            calculatePriceList(listedPrice);

            const buttonDiv = document.createElement('div');
            buttonDiv.className = 'product-label product-label--pre-order tw-relative';
            buttonDiv.style = "background-color: rgb(153, 24, 153);";
            buttonDiv.innerHTML = '<span class="product-label__title">True Price</span>'
                + '<span class="price">'
                + '<span class="money" data-currency="BRL">R$ ' + figureTruePrice + '</span>'
                + '</span>';

            const buttonSpace = productList[i];
            buttonSpace.appendChild(buttonDiv);
        }
        startObserving();
    }

    const showPriceProductsSearch = () => {
        waitForElementToLoad('.product__labels-wrapper .money', 1000, 200000 );
        const productList = document.getElementsByClassName('product__labels-wrapper');
        observer.disconnect();

        for (let i = 0; i < productList.length; i++) {
        
            if (productList[i].innerText.includes('TRUE PRICE'))
            {
                if(productList[i].innerText.includes('not Available')){
                    const lent = (productList.length) - 1;
                    productList[lent].remove();
                } else {
                    continue;
                }
            }
            
            waitForElementToLoad('iut', 1000, 20000 );

            let listedPrice = productList[i].getElementsByClassName('money')[0];

            if (listedPrice == null) {
                figureTruePrice = "0.00 not Available";
                continue;
            } else {
                console.log(listedPrice.innerText);
                calculatePriceList(listedPrice);
            }

            console.log(figureTruePrice);

            const buttonDiv = document.createElement('div');
            buttonDiv.className = 'product-label product-label--pre-order tw-relative';
            buttonDiv.style = "background-color: rgb(153, 24, 153);";
            buttonDiv.innerHTML = '<span class="product-label__title">True Price</span>'
                + '<span class="price">'
                + '<span class="money" data-currency="BRL">R$ ' + figureTruePrice + '</span>'
                + '</span>';

            const buttonSpace = productList[i];
            buttonSpace.appendChild(buttonDiv);
        }
        startObserving();
    }

    const addPorcetage = (cleanPrice) => {
        cleanPrice = cleanPrice.split("R$");
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
        ogNumber = ogNumber.toString().replace('.', ',');

        if (ogNumber.length > 6) {
            pointposition = ogNumber.length - 6;
            ogNumber = [ogNumber.slice(0, pointposition), '.', ogNumber.slice(pointposition)].join('');
        }
        return ogNumber
    }

    const formatStringToFloat = (ogString) => {
        return parseFloat(ogString.replace('.', '').replace(',', '.'));
    }

    const receivePageLoad = (type, figureId) => {

        currentFigureId = figureId;

        console.log(type);
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
    }

    const getShippingPrice = () => {

        waitForElementToLoad(".worldwide-shipping .money", 1000, 200000);
        let listShippingPrices = document.getElementsByClassName('worldwide-shipping')[0].getElementsByClassName('money');
        let returnPrice;

        if (listShippingPrices.length > 0) {
            if (document.querySelector("#" + ShippingMethods[preferences.method] + " .money")) {
                returnPrice = listShippingPrices[preferences.method].innerText;
            } else {
                returnPrice = listShippingPrices[0].innerText;
            }
            return formatStringToFloat(returnPrice.split("R$")[1]);
        }
        return preferences.shippinCost;
    }

    const waitForElementToLoad = (selector, checkFrequencyInMs, timeoutInMs) => {
        let startTimeInMs = Date.now();
        (function loopSearch() {
            if (document.querySelector(selector) != null)
                return;
            else {
                setTimeout(() => {
                    if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
                        return;
                    loopSearch();
                }, checkFrequencyInMs);
            }
        })();
    }

    const windowReloaded = () => {
        const url = window.location.href;
        if (url && url.includes("solarisjapan.com")) {
            const linkInfo = url.split("com")[1];
            let productType = linkInfo.split("/")[1];

            if (linkInfo.includes('products'))
                productType = 'products';
            
            if (linkInfo == '/'){
                receivePageLoad('home', '');
                return;
            }

            receivePageLoad(productType, linkInfo.split("/")[2].split("?")[0]);
        }
    }

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    let observer = new MutationObserver(function (mutations, observer) {
        
        if (mutations.length > 30){
            showPriceProductsList();
        } else if (mutations.length > 3) {
            //showPriceProductsSearch();
        }
    });

    const startObserving = () => {
        observer.observe(document, {
            subtree: true,
            childList: true,
        });
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

