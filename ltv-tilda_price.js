function set(key, value) {
    let curtime = new Date().getTime();
    localStorage.setItem(key, JSON.stringify({ val: value, time: curtime }));
    // console.log("Setting curse");
}

function get(key, exp) {
    var val = localStorage.getItem(key);
    var dataobj = JSON.parse(val);

    let days_after = Math.round(dataobj.time / 3600000);
    let razn = days_after - Math.round(exp / 3600000);

    if (razn <= -24) {
        var URL = "https://www.cbr-xml-daily.ru/daily_json.js";
        $.getJSON(URL, function (d) {
            var curEurVal = d.Valute.EUR.Value;
            set("cacheEurPrice", curEurVal);
        });
        return curEurVal;
    } else {
        return dataobj.val;
    }
}

function change_price(eurprice) {
    let countElements = $(".js-product-price");

    for (var i = countElements.length - 1; i >= 0; i--) {
        let eurPrice = countElements[i].getAttribute("data-product-price-def");
        let changePrice = eurprice * eurPrice;
        countElements[i].innerHTML = changePrice.toFixed(2);
    }
    // console.log("Price changed");
}

function start_change() {
    if (localStorage.getItem("cacheEurPrice") === null) {
        var URL = "https://www.cbr-xml-daily.ru/daily_json.js";
        $.getJSON(URL, function (d) {
            var curEurVal = d.Valute.EUR.Value;
            set("cacheEurPrice", curEurVal);
        });
        change_price(curEurVal);
    } else {
        //// console.log("already save");
        let newtime = new Date().getTime();
        let Eur_Price = get("cacheEurPrice", newtime);
        // console.log(Eur_Price);
        change_price(Eur_Price);
    }
}

function change_pricePopup() {
    let newtime = new Date().getTime();
    let product_price = +$(".js-store-prod-price .notranslate").text();
    let popup_eurprice = get("cacheEurPrice", newtime);
    let popup_changePrice = popup_eurprice * product_price;
    $(".t-store__prod-popup__container .js-store-prod-price-val").text(popup_changePrice.toFixed(2));
    // console.log("Price popup changed");
}

$(".js-store-grid-cont").on('click','a.js-store-prod-btn', function(event) {
    setTimeout(change_pricePopup, 500);
});

/*
$(".js-store-load-more-btn").click(function () {
    // console.log("click btn show all");
    setTimeout(start_change, 500);
});

$(document).ready(function ($) {
    setTimeout(start_change, 2000);
});
*/

$(document).ajaxComplete(function() {
  setTimeout(start_change, 500);
});
