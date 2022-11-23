const { v4: uuidv4 } = require("uuid");
const knex = require("knex")(require("../knexfile"));

/*
 * @param object representing req.body
 * @return boolean on whether any of the values were null
 */
function validateBody(request) {
  for (const property in request) {
    if (!request[property]) return false;
  }
  return true;
}
exports.index = (_req, res) => {
  knex("inventories")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).send(`Error retrieving Inventories; ${err}`));
};

exports.add = (req, res) => {
  if (!validateBody(req.body)) {
    return res
      .status(400)
      .send("Bad request: please ensure none of the fields (name, description, category, status, warehouse) are empty");
  }
  const newItemId = uuidv4();
  knex("inventories")
    .insert({ ...req.body, id: newItemId })
    .then((_data) => {
      knex("inventories")
        .where({ id: newItemId })
        .then((data) => res.status(201).json(data[0]));
    })
    .catch((err) => res.status(500).send(`Error while adding new inventory item to database: ${err}`));
};
