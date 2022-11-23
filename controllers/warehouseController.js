const knex = require('knex')(require('../knexfile'))

exports.index = (_req, res) => {
  knex('warehouses')
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) => res.status(400).send(`Error retrieving Warehouse ${err}`))
}

exports.singleWarehouse = (req, res) => {
  knex('warehouses')
    .where({ id: req.params.id })
    .then((data) => {
      if (!data.length) {
        return res
          .status(404)
          .send(`Record with id: ${req.params.id} is not found`)
      }
      // Knex returns an array of records, so we need to send response with a single object only
      res.status(200).json(data[0])
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving warehouse ${req.params.id} ${err}`)
    )
}

exports.warehouseInventories = (req, res) => {
  knex('inventories')
    .where({ warehouse_id: req.params.id })
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) =>
      res
        .status(400)
        .send(
          `Error retrieving inventories for Warehouse ${req.params.id} ${err}`
        )
    )
}
