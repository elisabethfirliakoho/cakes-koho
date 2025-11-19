document.addEventListener('DOMContentLoaded', function () {

  // =============================
  // Footer Year
  // =============================
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // =============================
  // Mobile Navbar
  // =============================
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  if (nav && navToggle) {
    navToggle.addEventListener('click', function () {
      nav.style.display = (nav.style.display === 'flex') ? 'none' : 'flex';
    });
  }

  // =============================
  // Tombol Demo ke Produk
  // =============================
  const demoBtn = document.getElementById('demoBtn');
  if (demoBtn) {
    demoBtn.addEventListener('click', function () {
      const products = document.getElementById('products');
      if (products) {
        products.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ===================================================
  // 🎉 FITUR KERANJANG
  // ===================================================

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartList = document.getElementById("cart-list");
  const totalText = document.getElementById("total");

  // Fungsi baru: ambil total keranjang
  function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  // Semua tombol tambah
  const buttons = document.querySelectorAll(".add-cart");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);

      addToCart(id, name, price);
      animateAdd(btn);
    });
  });

  function animateAdd(btn) {
    btn.style.transform = "scale(0.9)";
    setTimeout(() => btn.style.transform = "scale(1)", 150);
  }

  function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);

    if (existing) {
      existing.qty++;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }
    saveCart();
    updateCart();
  }

  function updateCart() {
    cartList.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
      const li = document.createElement("li");

      li.innerHTML = `
        <strong>${item.name}</strong>
        <div class="qty-box">
          <button class="qty-btn" onclick="minusQty('${item.id}')">−</button>
          <span class="qty-text">${item.qty}</span>
          <button class="qty-btn" onclick="plusQty('${item.id}')">+</button>
          <span class="delete-btn" onclick="deleteItem('${item.id}')">✖</span>
        </div>
        <small>Rp ${ (item.price * item.qty).toLocaleString() }</small>
      `;

      cartList.appendChild(li);
      total += item.price * item.qty;
    });

    totalText.textContent =`Total: Rp ${total.toLocaleString()}`;
  }

  window.plusQty = function (id) {
    const item = cart.find(i => i.id === id);
    item.qty++;
    saveCart();
    updateCart();
  }

  window.minusQty = function (id) {
    const item = cart.find(i => i.id === id);
    if (item.qty > 1) {
      item.qty--;
    } else {
      cart = cart.filter(i => i.id !== id);
    }
    saveCart();
    updateCart();
  }

  window.deleteItem = function (id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCart();
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Form Kontak — versi FIX
const form = document.getElementById("contactForm");
const notice = document.getElementById("formNotice");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = new FormData(form);
    const name = data.get("name");
    const email = data.get("email");
    const message = data.get("message");

    Swal.fire({
      icon: "success",
      title: "Pesan Terkirim!",
      text: "Terima kasih, kami akan segera menghubungi Anda!"
    });

    form.reset();
  });
}

  // =============================
// Tombol Bayar (Fix)
// =============================
const payBtn = document.getElementById("pay-btn");
if (payBtn) {
    payBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Keranjang Kosong",
                text: "Silakan pilih produk terlebih dahulu ",
                confirmButtonText: "Oke",
                confirmButtonColor: "#ff7f88"
            });
            return;
        }

        const total = getCartTotal();
        const itemsHtml = cart
            .map(it => `${it.name} × ${it.qty} — Rp ${ (it.price * it.qty).toLocaleString() }`)
            .join("<br>");

        Swal.fire({
            title: "Konfirmasi Pembayaran",
            html: `<div style="text-align:left">${itemsHtml}<hr><strong>Total: Rp ${total.toLocaleString()}</strong></div>`,
            showCancelButton: true,
            confirmButtonText: "Bayar",
            cancelButtonText: "Batal",
            confirmButtonColor: "#ff6f61",
            preConfirm: () => {
                // Simulasi proses pembayaran singkat (bisa diganti dengan request API)
                return new Promise(resolve => setTimeout(resolve, 600));
            }
        }).then(result => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "success",
                    title: "Pembayaran Berhasil!",
                    text: "Terima kasih sudah berbelanja yaa!",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#ff6f61"
                });

                cart = [];
                saveCart();
                updateCart();
            }
        });
    });
}

  // Inisialisasi tampilan keranjang saat halaman dimuat
  updateCart();
});