"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(qi) {
    const hash = await bcrypt.hash("admin123", 10);

    // users (kasir)
    await qi.bulkInsert("users", [
      {
        email: "kasir@warungmpokncum.com",
        name: "Kasir Utama",
        password: hash,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // categories
    await qi.bulkInsert("menu_categories", [
      {
        id: 1,
        name: "Makanan",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: "Minuman",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: "Camilan",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // menu_items
    await qi.bulkInsert("menu_items", [
      {
        id: 1,
        menu_category_id: 1,
        name: "Seblak",
        base_price: 15000,
        description: "Seblak pedas",
        image_url: "/images/seblak.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        menu_category_id: 1,
        name: "Bakso Aci",
        base_price: 18000,
        description: "Bakso aci kuah",
        image_url: "/images/bakso-aci.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        menu_category_id: 1,
        name: "Nasi Goreng",
        base_price: 20000,
        description: "Nasi goreng spesial",
        image_url: "/images/nasi-goreng.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        menu_category_id: 1,
        name: "Mie Tek Tek",
        base_price: 19000,
        description: "Goreng/Kuah",
        image_url: "/images/mie-tek-tek.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        menu_category_id: 1,
        name: "Kwetiaw",
        base_price: 21000,
        description: "Goreng/Kuah",
        image_url: "/images/kwetiaw.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        menu_category_id: 2,
        name: "Es Teh",
        base_price: 6000,
        description: "Manis/less sugar",
        image_url: "/images/es-teh.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        menu_category_id: 3,
        name: "Kerupuk",
        base_price: 3000,
        description: "Gurih",
        image_url: "/images/kerupuk.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // variants (contoh untuk Seblak id=1)
    await qi.bulkInsert("variants", [
      {
        menu_item_id: 1,
        name: "Level 1",
        extra_price: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        menu_item_id: 1,
        name: "Level 3",
        extra_price: 2000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        menu_item_id: 1,
        name: "Level 5",
        extra_price: 4000,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // addons (global)
    await qi.bulkInsert("addons", [
      {
        name: "Telur",
        price: 5000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Keju",
        price: 4000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Sayur Extra",
        price: 2000,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(qi) {
    await qi.bulkDelete("payments", null, {});
    await qi.bulkDelete("order_item_addons", null, {});
    await qi.bulkDelete("order_items", null, {});
    await qi.bulkDelete("orders", null, {});
    await qi.bulkDelete("addons", null, {});
    await qi.bulkDelete("variants", null, {});
    await qi.bulkDelete("menu_items", null, {});
    await qi.bulkDelete("menu_categories", null, {});
    await qi.bulkDelete("users", null, {});
  },
};
