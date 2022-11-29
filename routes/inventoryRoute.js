const router = require("express").Router();
const inventoryController = require("../controllers/inventoryController");

router.route("/").get(inventoryController.index).post(inventoryController.add);

router.route("/categories").get(inventoryController.categories);

router
  .route("/:id")
  .get(inventoryController.get)
  .patch(inventoryController.update)
  .delete(inventoryController.remove);

module.exports = router;
