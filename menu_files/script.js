(function () {
  let ls = new SecureLS({
    encodingType: "aes",
  });

  // ls.removeAll();
  cartAddBtns = document.querySelectorAll(".cd-add-to-cart");
  images = document.querySelectorAll(".imageMain");
  title = document.querySelectorAll(".title");
  price = document.querySelectorAll(".pr-font.dm-price");
  IdCollector = ls.get("ids");
  let products = [];
  if (ls.get("products")) {
    products = ls.get("products");
  } else {
    products = [];
  }

  setInterval(() => {
    console.log(products);
  }, 2000);
  const crypto = new Uint32Array(cartAddBtns.length);
  self.crypto.getRandomValues(crypto);
  var names = [];
  for (let i = 0; i < cartAddBtns.length; i++) {
    names.push(title[i].innerText.toLowerCase().trim());
    cartAddBtns[i].classList.add("my-cart-btn");
    cartAddBtns[i].setAttribute("data-id", `0${crypto[i]}`);
    cartAddBtns[i].setAttribute("data-name", title[i].innerHTML);
    price[i].innerHTML = parseInt(price[i].innerHTML.replace(/\D+/, ""));

    cartAddBtns[i].setAttribute(
      "data-price",
      `${parseFloat(price[i].innerHTML)}.00`
    );
    cartAddBtns[i].setAttribute("data-quantity", 1);
    cartAddBtns[i].setAttribute(
      "data-image",
      "./" +
        images[i].src
          .split(/\b/)
          .slice(images[i].src.split(/\b/).indexOf("images"))
          .join("")
    );
    cartAddBtns[i].setAttribute("class", "cd-add-to-cart js-cd-add-to-cart");
    cartAddBtns[i].setAttribute("href", "#0");
  }

  var cart = document.getElementsByClassName("js-cd-cart");
  if (cart.length > 0) {
    var cartAddBtns = document.getElementsByClassName("js-cd-add-to-cart"),
      cartBody = cart[0].getElementsByClassName("cd-cart__body")[0],
      cartMain = document.querySelector(".cd-cart__content"),
      cartList = cartBody.getElementsByTagName("ul")[0],
      cartListItems = cartList.getElementsByClassName("cd-cart__product"),
      cartTotal = cart[0]
        .getElementsByClassName("cd-cart__checkout")[0]
        .getElementsByTagName("span")[0],
      cartCount = cart[0].getElementsByClassName("cd-cart__count")[0],
      cartCountItems = cartCount.getElementsByTagName("li"),
      cartUndo = cart[0].getElementsByClassName("cd-cart__undo")[0],
      productId = 0, //this is a placeholder -> use your real product ids instead
      cartTimeoutId = false,
      animatingQuantity = false;
    console.log(sumQuantity());
    cartCountItems[0].innerText = sumQuantity();
    cartCountItems[1].innerText = sumQuantity() + 1;
    initCartEvents();
    // dragElement(cartMain);

    function initCartEvents() {
      // add products to cart
      for (var i = 0; i < cartAddBtns.length; i++) {
        (function (i) {
          cartAddBtns[i].addEventListener("click", addToCart);
          if (products.length > 0) {
            if (
              ls
                .get("products")
                .map((m) => m.name)
                .includes(cartAddBtns[i].getAttribute("data-name"))
            ) {
              cartAddBtns[i].innerHTML = "Added";
              cartAddBtns[i].setAttribute(
                "style",
                "background-color: grey !important; pointer-events: none; cursor: not-allowed;"
              );
            }
          }
        })(i);
      }

      // open/close cart
      cart[0]
        .getElementsByClassName("cd-cart__trigger")[0]
        .addEventListener("click", function (event) {
          event.preventDefault();
          toggleCart();
        });

      cart[0].addEventListener("click", function (event) {
        if (event.target == cart[0]) {
          // close cart when clicking on bg layer
          toggleCart(true);
        } else if (event.target.closest(".cd-cart__delete-item")) {
          // remove product from cart
          but = event.target;
          event.preventDefault();

          removeProduct(event.target.closest(".cd-cart__product"));
          // console.log(
          //   but.parentElement.parentElement.childNodes[1].textContent.trim()
          // );

          for (var i = 0; i < cartAddBtns.length; i++) {
            if (
              but.parentElement.parentElement.childNodes[1].textContent.trim() ==
              cartAddBtns[i].getAttribute("data-name")
            ) {
              cartAddBtns[i].removeAttribute("style");
              cartAddBtns[i].innerHTML = "Add To Cart";
              break;
            }
          }
        }
      });
      AddThem();

      // update product quantity inside cart
      cart[0].addEventListener("change", function (event) {
        if (event.target.tagName.toLowerCase() == "select")
          quickUpdateCart(event);
        // updateTarget(event);
      });

      //reinsert product deleted from the cart
      cartUndo.addEventListener("click", function (event) {
        if (event.target.tagName.toLowerCase() == "a") {
          event.preventDefault();

          if (cartTimeoutId) clearInterval(cartTimeoutId);
          // reinsert deleted product
          var deletedProduct = cartList.getElementsByClassName(
            "cd-cart__product--deleted"
          )[0];
          for (var i = 0; i < cartAddBtns.length; i++) {
            let btnName = cartAddBtns[i].getAttribute("data-name");
            let dpName =
              deletedProduct.childNodes[3].childNodes[1].textContent.trim();
            if (dpName == btnName) {
              cartAddBtns[i].setAttribute(
                "style",
                "background-color: grey !important; pointer-events: none; cursor: not-allowed;"
              );
              cartAddBtns[i].innerHTML = "Added";
            }
          }
          Util.addClass(deletedProduct, "cd-cart__product--undo");
          deletedProduct.addEventListener("animationend", function cb() {
            deletedProduct.removeEventListener("animationend", cb);
            Util.removeClass(
              deletedProduct,
              "cd-cart__product--deleted cd-cart__product--undo"
            );
            deletedProduct.removeAttribute("style");
            quickUpdateCart();
          });
          Util.removeClass(cartUndo, "cd-cart__undo--visible");
        }
      });
    }

    if (products.length > 0) {
      Util.removeClass(cart[0], "cd-cart--empty");
    } else {
      Util.addClass(cart[0], "cd-cart--empty");
    }
    function addToCart(event) {
      event.preventDefault();
      let but = event.target;
      but.setAttribute(
        "style",
        "background-color: grey !important; pointer-events: none; cursor: not-allowed;"
      );

      but.innerHTML = "Added";

      if (animatingQuantity) return;
      var cartIsEmpty = Util.hasClass(cart[0], "cd-cart--empty");
      //update cart product list
      addProduct(this);
      //update number of items
      updateCartCount(sumQuantity);

      //update total price
      updateCartTotal(this.getAttribute("data-price"), true);
      //show cart
      Util.removeClass(cart[0], "cd-cart--empty");
    }

    function toggleCart(bool) {
      // toggle cart visibility
      var cartIsOpen =
        typeof bool === "undefined"
          ? Util.hasClass(cart[0], "cd-cart--open")
          : bool;

      if (cartIsOpen) {
        Util.removeClass(cart[0], "cd-cart--open");
        //reset undo
        if (cartTimeoutId) clearInterval(cartTimeoutId);
        Util.removeClass(cartUndo, "cd-cart__undo--visible");
        removePreviousProduct(); // if a product was deleted, remove it definitively from the cart

        setTimeout(function () {
          cartBody.scrollTop = 0;
          //check if cart empty to hide it
          if (Number(cartCountItems[0].innerText) == 0)
            Util.addClass(cart[0], "cd-cart--empty");
        }, 500);
      } else {
        Util.addClass(cart[0], "cd-cart--open");
      }
    }

    function AddThem() {
      document.querySelector(".cd-cart__body ul").innerHTML = "";
      for (let i = 0; i < products.length; i++) {
        // console.log(cartAddBtns.map((m) => m.name).includes(products[i]));
        var productAdded = `<li class="cd-cart__product">
          <div class="cd-cart__image">
          <a href="#0">
          <img src="${products[i].image}" alt="placeholder">
          </a>
          </div>
          <div class="cd-cart__details">
          <h3 class="truncate">
          <a href="#0">${products[i].name}</a>
          </h3>
          <span class="cd-cart__price">${products[i].price}ETB</span>
          <div class="cd-cart__actions">
          <a href="#0" class="cd-cart__delete-item" id = '${products[i].id}' >Delete</a>
          <div class="cd-cart__quantity"><label for="cd-product-'+ productId +'">Qty</label>
          <span class="cd-cart__select">
          <select class="reset" id="cd-product-'+ productId +'" name="quantity">
          <option value="1">1</option><option value="2">2</option>
          <option value="3">3</option><option value="4">4</option>
          <option value="5">5</option><option value="6">6</option>
          <option value="7">7</option><option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          </select><svg class="icon" viewBox="0 0 12 12">
          <polyline fill="none" stroke="currentColor" points="2,4 6,8 10,4 "/></svg></span>
          </div></div></div></li>`;

        cartList.insertAdjacentHTML("beforeend", productAdded);
        let element = cartListItems[i].querySelector(".reset");
        element.value = products[i].quantity;
        updateCartTotal(products[i].price, true);
        // quickUpdateCart();
      }
    }

    function addProduct(target) {
      // console.log(products.length);
      if (!products.map((m) => m.id).includes(target.getAttribute("data-id"))) {
        products.push({
          id: target.getAttribute("data-id"),
          image: target.getAttribute("data-image"),
          name: target.getAttribute("data-name"),
          price: target.getAttribute("data-price"),
          quantity: target.getAttribute("data-quantity"),
        });

        ls.set("products", products);
        productId = productId + 1;
        var productAdded = `<li class="cd-cart__product">
          <div class="cd-cart__image">
          <a href="#0">
          <img src="${target.getAttribute("data-image")}" alt="placeholder">
          </a>
          </div>
          <div class="cd-cart__details">
          <h3 class="truncate">
          <a href="#0">${target.getAttribute("data-name")}</a>
          </h3>
          <span class="cd-cart__price">${target.getAttribute(
            "data-price"
          )}ETB</span>
          <div class="cd-cart__actions">
          <a href="#0" class="cd-cart__delete-item">Delete</a>
          <div class="cd-cart__quantity"><label for="cd-product-'+ productId +'">Qty</label>
          <span class="cd-cart__select">
          <select class="reset" id="cd-product-'+ productId +'" name="quantity">
          <option value="1">1</option><option value="2">2</option>
          <option value="3">3</option><option value="4">4</option>
          <option value="5">5</option><option value="6">6</option>
          <option value="7">7</option><option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          </select><svg class="icon" viewBox="0 0 12 12">
          <polyline fill="none" stroke="currentColor" points="2,4 6,8 10,4 "/></svg></span>
          </div></div></div></li>`;

        cartList.insertAdjacentHTML("beforeend", productAdded);
      } else return;
    }

    function removeProduct(product) {
      if (cartTimeoutId) clearInterval(cartTimeoutId);
      removePreviousProduct(); // prduct previously deleted -> definitively remove it from the cart

      var topPosition = product.offsetTop,
        productQuantity = Number(
          product.getElementsByTagName("select")[0].value
        ),
        productTotPrice =
          Number(
            product
              .getElementsByClassName("cd-cart__price")[0]
              .innerText.replace("ETB", "")
          ) * productQuantity;

      product.style.top = topPosition + "px";
      Util.addClass(product, "cd-cart__product--deleted");

      //update items count + total price
      updateCartTotal(productTotPrice, false);

      updateCartCount(sumQuantity());

      Util.addClass(cartUndo, "cd-cart__undo--visible");

      //wait 8sec before completely remove the item
      cartTimeoutId = setTimeout(function () {
        Util.removeClass(cartUndo, "cd-cart__undo--visible");
        removePreviousProduct();
      }, 8000);
    }

    function removePreviousProduct() {
      // definitively removed a product from the cart (undo not possible anymore)
      var deletedProduct = cartList.getElementsByClassName(
        "cd-cart__product--deleted"
      );
      // products;

      let ids = products.map((m) => m.id);
      if (deletedProduct.length > 0) {
        let productId = deletedProduct[0].querySelector(
          ".cd-cart__delete-item"
        ).id;
        deletedProduct[0].remove();
        products.splice(ids.indexOf(productId), 1);
        ls.set("products", products);
      }
      updateCartCount(sumQuantity());
      // console.log(products);
      // console.log(products.length);
    }

    function updateCartCount(emptyCart, quantity) {
      if (typeof quantity === "undefined") {
        actual = sumQuantity();
        next = actual + 1;

        if (emptyCart) {
          cartCountItems[0].innerText = actual;
          cartCountItems[1].innerText = next;
          animatingQuantity = false;
        } else {
          Util.addClass(cartCount, "cd-cart__count--update");
          setTimeout(function () {
            cartCountItems[0].innerText = actual;
          }, 230);

          setTimeout(function () {
            Util.removeClass(cartCount, "cd-cart__count--update");
          }, 200);

          setTimeout(function () {
            cartCountItems[1].innerText = next;
            animatingQuantity = false;
          }, 230);
        }
      } else {
        var actual = cartCountItems[0].innerText + quantity;

        var next = actual + 1;

        cartCountItems[0].innerText = actual;
        cartCountItems[1].innerText = next;
        animatingQuantity = false;
      }
    }

    // function selectElement(classes, valueToSelect) {
    //   let element = document.getElementsByClassName(`${classes}`);
    //   element.value = valueToSelect;
    // }

    function updateCartTotal(price, bool) {
      cartTotal.innerText = bool
        ? (Number(cartTotal.innerText) + Number(price)).toFixed(2)
        : (Number(cartTotal.innerText) - Number(price)).toFixed(2);
    }

    // function updateTarget(target, event) {
    //   target.setAttribute("data-quantity", event.target.value);
    // }

    function sumQuantity() {
      let sum = 0;
      for (var i = 0; i < cartListItems.length; i++) {
        var singleQuantity = Number(
          cartListItems[i].getElementsByTagName("select")[0].value
        );
        sum += singleQuantity;
      }
      return sum;
    }
    function quickUpdateCart(event) {
      var quantity = 0;
      var price = 0;
      console.log(event.target.value);
      let name =
        event.target.parentElement.parentElement.parentElement.parentElement.childNodes[1].innerText
          .trim()
          .toLowerCase();
      cartAddBtns[names.indexOf(name)].setAttribute(
        "data-quantity",
        event.target.value
      );
      for (var i = 0; i < cartListItems.length; i++) {
        if (!Util.hasClass(cartListItems[i], "cd-cart__product--deleted")) {
          var singleQuantity = Number(
            cartListItems[i].getElementsByTagName("select")[0].value
          );

          if (cartListItems[i].childNodes[3].childNodes[1].innerText == name) {
            products[i].quantity = event.target.value;
          }

          quantity = quantity + singleQuantity;
          price =
            price +
            singleQuantity *
              Number(
                cartListItems[i]
                  .getElementsByClassName("cd-cart__price")[0]
                  .innerText.replace("ETB", "")
              );
        }
      }

      // updateCartCount(true, sum);
      updateCartCount(false, sumQuantity);
      ls.set("products", products);

      cartTotal.innerText = price.toFixed(2);
      cartCountItems[0].innerText = quantity;
      cartCountItems[1].innerText = quantity + 1;
    }
  }
})();
