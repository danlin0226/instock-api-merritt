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

exports.update = (req, res) => {
  console.log("got here");
  if (!validateBody(req.body)) {
    return res
      .status(400)
      .send("Bad request: please ensure none of the fields (name, description, category, status, warehouse) are empty");
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
    .catch((err) => res.status(500).send(`Error while updating item ${id}: ${err}`));
};
