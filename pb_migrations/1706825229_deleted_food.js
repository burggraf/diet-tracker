/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("6ehaw0rh7r8ehhd");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "6ehaw0rh7r8ehhd",
    "created": "2024-02-01 21:56:31.109Z",
    "updated": "2024-02-01 21:56:31.109Z",
    "name": "food",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "hwbsqyxy",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "ezb4uqt1",
        "name": "portion",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "boaz2zm0",
        "name": "calories",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
