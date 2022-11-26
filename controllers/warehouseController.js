const { v4: uuidv4 } = require("uuid");
const knex = require("knex")(require("../knexfile"));

exports.index = (_req, res) => {
  knex("warehouses")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).send(`Error retrieving Warehouse ${err}`));
};

exports.singleWarehouse = (req, res) => {
  knex("warehouses")
    .where({ id: req.params.id })
    .then((data) => {
      if (!data.length) {
        return res
          .status(404)
          .send(`Record with id: ${req.params.id} is not found`);
      }
      // Knex returns an array of records, so we need to send response with a single object only
      res.status(200).json(data[0]);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving warehouse ${req.params.id} ${err}`)
    );
};

exports.allWarehouses = (_req, res) => {
  knex("warehouses")
    .select("id", "warehouse_name")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(500).send(`Error retrieving warehouses ${err}`));
};

exports.warehouseInventories = (req, res) => {
  knex("warehouses")
    .join("inventories", "inventories.warehouse_id", "warehouses.id")
    .where({ warehouse_id: req.params.id })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) =>
      res
        .status(400)
        .send(
          `Error retrieving inventories for Warehouse ${req.params.id} ${err}`
        )
    );
};

exports.addWarehouse = (req, res) => {
  console.log(req.body, "body");
  if (
    !req.body.warehouse_name ||
    !req.body.address ||
    !req.body.city ||
    !req.body.country ||
    !req.body.contact_name ||
    !req.body.contact_position ||
    !req.body.contact_phone ||
    !req.body.contact_email
  ) {
    return res
      .status(400)
      .send("Please provide details about warehouse and it's contacts!");
  }

  const newWarehouseId = uuidv4();
  knex("warehouses")
    .insert({ ...req.body, id: newWarehouseId })
    .then((_data) => {
      knex("warehouses")
        .where({ id: newWarehouseId })
        .then((data) => {
          res.status(201).json(data[0]);
        });
    })
    .catch((err) =>
      res.status(400).send(`Error creating new Warehouse: ${err}`)
    );
};

exports.editWarehouse = (req, res) => {
  knex("warehouses")
    .where({ id: req.params.id })
    .update(req.body)
    .then((_data) => {
      knex("warehouses")
        .where({ id: req.params.id })
        .then((data) => {
          res.status(200).json(data[0]);
        });
    })
    .catch((err) =>
      res
        .status(400)
        .send(`Error updating Warehouse with ID: ${req.params.id} ${err}`)
    );
};

exports.remove = (req, res) => {
  knex("warehouses")
    .delete()
    .where({ id: req.params.id })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) =>
      res
        .status(400)
        .send(`Error warehouse ${req.params.id} does not exists ${err}`)
    );
};
