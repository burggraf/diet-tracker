/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4pjuu795ly99790")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_qCAmDmL` ON `days` (\n  `user_id`,\n  `date`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4pjuu795ly99790")

  collection.indexes = []

  return dao.saveCollection(collection)
})
