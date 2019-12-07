import './scss/main.scss';
var cart = {};
var data;
var cartGoods = 0;
var counter = 0;
let categoriesArr = [9];
var name;
var phone;
var email;


function write2categoryArray(JsonObj) {
    categoriesArr[0] = 'All';
    for (var i = 1; i < 9; i++) {
        categoriesArr[i] = document
    }

}

$('document').ready(function () {
    var requestURL = 'https://nit.tron.net.ua/api/product/list';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function () {
        data = request.response;
        checkCart();
        changeCart(0);
    }

    getBrand();
    loadGoods('https://nit.tron.net.ua/api/product/list', 'All Products');
});


function getBrand() {
    var requestURL = 'https://nit.tron.net.ua/api/category/list';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    /*method send() sends the request to the server.
    send() accepts an optional parameter which lets you specify
    the request's body; this is primarily used for requests such as PUT
    */
    request.onload = function () {
        var brands = request.response;//brands = menu
        var outBrand = "<a " +
            "onclick='changeGoods(this)' " +
            "data-brand-id='1' " +
            "class=\"brands\">All  " +
            "</a>";
        brands.forEach(function (item) {
            outBrand += "<a onclick='changeGoods(this)' " +
                "data-art='" + item.id + "' " +
                "class=\"brands\">";
            outBrand += item.name + "  ";
            outBrand += "</a>";
        });
        $('#brandFilter').html(outBrand);
    }
}

// function loadBrandfromCategories(item) {
//     for ( var i in car){
//         if ( cart[item].)
//     }
// }

function changeGoods(item) {
    if ($(item).attr('data-brand-id') == 1)
        loadGoods('https://nit.tron.net.ua/api/product/list', item.innerHTML + 'Products');
    else
        loadGoods('https://nit.tron.net.ua/api/product/list/category/' + $(item).attr('data-art'), item.innerHTML);
}

//this method add under the header information about e

function loadGoods(url, header) {
    var requestURL = url;
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    //var out='<h2 class="content_header">'+header+'</h2><div class="row ">';
    var out = '<div class="row ">';
    request.onload = function () {
        var products = request.response;
        products.forEach(function (item) {
            out += '<div class="brandForm col-lg-3 col-md-4 col-sm-6 col-xs-12">';
            out += '<img src="' + item.image_url + '" data-toggle="modal" data-target="#productModalWindow"   alt="img" data-art="' + item.id + '"><br>';
            if (item.special_price != null) {
                out += '<span class="price last_price">' + item.price + '$</span>'
                out += '<span class="price text-danger">' + item.special_price + '$</span><br>';
            } else {
                out += '<span class="price">' + item.price + '$</span><br>';
            }
            //додати кнопку для перегляду інформації
            out += '<a onclick="prodModal(this)" ' +
                'data-toggle="modal" ' +
                'data-target="#productModalWindow" ' +
                'data-art="' + item.id + '">' + item.name + '</a> <br>' +
                '<button class="buy_button btn btn-outline-info" onclick="prodModal(this)" data-art="' + item.id + '" data-toggle="modal" data-target="#productModalWindow" >More</button>    ' +
                '<button class="buy_button btn btn-outline-primary" onclick="addToCart(this)" data-art="' + item.id + '"  data-target="#cartModal" >Buy</button></div>';
//виправити і зробити нормальним
            //    out+='<a onclick="prodModal(this)" data-toggle="modal" data-target="#productModalWindow" data-art="'+item.id+'">'+item.name+'</a> <br><button class="veiw_item_button" onclick="addToCart(this)" data-art="'+item.id+'" data-toggle="modal" data-target="#cartModal" >More</button></div>';
        });
        out += '</div>';
        $('.container').html(out);
    }
}

function getElementById(id) {
    for (var k in data) {
        if (data[k].id == id) return data[k];
    }
}

function addToCart(item) {
    if (cart[$(item).attr('data-art')] != undefined) {
        cart[$(item).attr('data-art')]++;
    } else {
        cart[$(item).attr('data-art')] = 1;
    }
    changeCart(1);
}

function prodModal(item) {
    var el = getElementById(($(item).attr('data-art')));
    $('.product-title').html("Product Information");
    var outModal = ' <img id="modal-image" ' +
        'class=" modal-image rounded mx-auto d-block mw-75  mh-75" ' +
        'style="max-width: 400px; max-height: 400px;" ' +
        'src="' + el.image_url + '" alt="img" data-art="' + item.id + '"><br>';
    outModal += '<br><h3 class="text-center">' + el.name + '</h3><br>';
    if (el.special_price != null) {
        outModal += '<span class="price last_price">' + el.price + '$ </span>'
        outModal += '<span class="font-weight-bold text-danger price"> ' + el.special_price + '$</span><br>';
    } else {
        outModal += '<span class="price">  ' + el.price + '$</span><br>';
    }
    outModal += '<br><p class="description">' + el.description + '</p>';
    $('#product-content').html(outModal);
    outModal = '<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button> ' +
        '<button type="button" class="btn btn-primary" data-dismiss="modal" data-toggle="modal"  onclick="addToCart(this)" data-art="' + el.id + '" >Buy</button>'
    $('.prod').html(outModal);
}


function changeCart(num) {
    var output = '';
    var total = 0;
    var totalS = '';
    var img = '';
    cartGoods += num;
    if (cartGoods == 0) {
        output = '<span class="empty text-danger font-weight-bold text-md-center"><h3>P. U. S. T. O</h3></span>';
    } else {
        var el;
        for (var i in cart) {
            el = getElementById(i);
            var totalCount = el.price * cart[i];
            /*var price = 0 ;
            * if (el.special_price==null)
            *    price = el.price;
            * else
            *    price = el.special_price;
            * */
            var price = el.special_price != null ? el.special_price : el.price;

            img += '<div class="image-form"><img src="' + el.image_url + '"></div>';
            output += "<table><tr class='col-lg-3 col-md-4 col-sm-6 col-xs-12'>"
                + "<td>" +
                "<img class='image-form' id='image-form' src=" + el.image_url + ">"
                + "<td class='align-items-center text-right'>" +
                "<div class='all_operations '><h5>Price : " + price + "</h5>"
                + "<div><span class='change'><button class='minus_button' data-art='" + i + "'+>-</button>"  //мінус
                + "<span class='num'>" + cart[i] + "</span>"
                + "<button class='plus_button' data-art='" + i + "'+>+</button>"                           //плюс
                + "</div>"
                + "<button class='delete text-danger' data-art='" + i + "'>X</button> " + "<h4>Sum : <span class='total'>" + price * cart[i] + "$</span></span></h4> </div></td>"
                + "</tr>"
                + "<tr><td class='brandName'>" + el.name + "</td></tr></table>";

            total += price * cart[i];
        }
        totalS = '<br>' + 'Total  : ' + total + ' $';
    }
    var buttons = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
    if (cartGoods != 0) {
        buttons += '<button type="button" class="btn btn-primary" data-dismiss="modal" data-toggle="modal" data-target="#buyModal">Buy</button>'
    }
    addToScreenID(cartGoods, totalS, output, buttons);
    addToScreenClass(deleteFromCart, plus, minus);
    if (cartGoods == 0) {
        output = '<span class="empty text-danger font-weight-bold text-md-center"><h3>P. U. S. T. O</h3></span>';
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}


function plus() {
    var chlen = getItem(this);
    cart[chlen]++;
    counter++;
    console.log("add");
    changeCart(1);
}

function getItem(item) {
    return $(item).attr('data-art');
}

function minus() {
    var chlen = getItem(this);
    if (cart[chlen] > 0) {
        cart[chlen]--;
        counter--;
        console.log("minus");
        changeCart(-1);
    }
    if (cart[chlen] == 0) {
        var chlen2 = getItem(this);
        cartGoods = cartGoods - 1 * cart[chlen2];
        delete cart[chlen2];
        counter = 0;
        changeCart(0);
    }
}

function addToScreenID(numCart, totalSuma, output, but) {
    $('#countGoods').html(numCart);
    $('#cart_total').html(totalSuma);
    $('#cart-content').html(output);
    $('#cartTotal').html(but);

}

function addToScreenClass(del, plus, minus) {
    $('button.delete').on('click', del);
    $('button.plus_button').on('click', plus);
    $('button.minus_button').on('click', minus);
}

function deleteFromCart() {
    var articul = getItem(this);
    cartGoods = cartGoods - 1 * cart[articul];
    delete cart[articul];
    count = 0;
    console.log("delete from cart");
    changeCart(0);
}


function checkCart() {
    if (localStorage.getItem('cart') != null) {
        cart = JSON.parse(localStorage.getItem('cart'));
        for (var i in cart) cartGoods += cart[i];
    }
}

function postCart(name, surname, phone, email) {
    $.post('https://nit.tron.net.ua/api/order/add/', {
            token: 'EDJSV-Ro3IeH7530Ksn2',
            name: name,
            surname: surname,
            phone: phone,
            async: false,
            email: email,
            products: cart,
        },
        function (data, textStatus, jqXHR) {
            //when mistake
            if (data.status === 'error') {
                var errors = "";
                for (var er in data.errors) {
                    errors += data.errors[er] + "\n";
                }
                alert(errors);
            }
            //when all good
            else {
                document.getElementById('name').value = "";
                document.getElementById('surname').value = "";
                document.getElementById('phone').value = "";
                document.getElementById('email').value = "";
                cart = {};
                cartGoods = 0;
                localStorage.setItem('cart', JSON.stringify(cart));
                if (!alert('wait your email (you got a bonus)')) {
                    window.location.reload();
                }
            }
        });
}
