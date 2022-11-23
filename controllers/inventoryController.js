const knex = require('knex')(require('../knexfile'))

export.index = (_req, res) => {
  knex("inventories").then((data) => {
    res.status(200).json(data)
  })
  .catch((err) => res.status(400).send(`Error retrieving Inventories; ${err}`))
}




