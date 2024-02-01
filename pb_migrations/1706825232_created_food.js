/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "znin8zz46u3ewta",
    "created": "2024-02-01 22:07:12.913Z",
    "updated": "2024-02-01 22:07:12.913Z",
    "name": "food",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "yaz392jb",
        "name": "ï»¿name",
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
        "id": "fllswxtg",
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
        "id": "u0jlufxl",
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
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("znin8zz46u3ewta");

  return dao.deleteCollection(collection);
})
