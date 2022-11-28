const { v4: uuidv4 } = require("uuid");
const knex = require("knex")(require("../knexfile"));

/*
 * @param object representing req.body
 * @return boolean on whether any of the values were null
 */
function validateBody(request) {
  for (const property in request) {
    if (!request[property] && property !== "quantity") return false;
  }
  return true;
}
exports.index = (_req, res) => {
  knex("inventories")
    .select("inventories.*")
    .select("warehouses.warehouse_name")
    .join("warehouses", "inventories.warehouse_id", "warehouses.id")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving Inventories; ${err}`)
    );
};

exports.get = (req, res) => {
  knex("inventories")
    .select("inventories.*")
    .select("warehouses.warehouse_name")
    .join("warehouses", "inventories.warehouse_id", "warehouses.id")
    .where({ "inventories.id": req.params.id })
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

exports.update = (req, res) => {
  if (!validateBody(req.body)) {
    return res
      .status(400)
      .send(
        "Bad request: please ensure none of the fields (name, description, category, status, warehouse) are empty"
      );
  }
  const { id } = req.params;
  knex("inventories")
    .where({ id: id })
    .update(req.body)
    .then((_data) => {
      knex("inventories")
        .where({ id: id })
        .then((data) => res.status(200).json(data[0]));
    })
    .catch((err) =>
      res.status(500).send(`Error while updating item ${id}: ${err}`)
    );
};

exports.add = (req, res) => {
  if (!validateBody(req.body)) {
    return res
      .status(400)
      .send(
        "Bad request: please ensure none of the fields (name, description, category, status, warehouse) are empty"
      );
  }
  const newItemId = uuidv4();
  knex("inventories")
    .insert({ ...req.body, id: newItemId })
    .then((_data) => {
      knex("inventories")
        .where({ id: newItemId })
        .then((data) => res.status(201).json(data[0]));
    })
    .catch((err) =>
      res
        .status(500)
        .send(`Error while adding new inventory item to database: ${err}`)
    );
};

exports.remove = (req, res) => {
  knex("inventories")
    .delete()
    .where({ id: req.params.id })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      status(400).send(
        `Error inventory ${req.params.id} does not exists ${err}`
      );
    });
};

exports.categories = (req, res) => {
  knex("inventories")
    .select("category")
    .distinct()
    .then((data) => {
      res.status(200).json(data.map((item) => item.category));
    })
    .catch((err) => {
      res.status(500).send(`Error retrieving categories from database ${err}`);
    });
};
