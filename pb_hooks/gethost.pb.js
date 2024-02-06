/// <reference path="../pb_data/types.d.ts" />

routerAdd('GET', '/gethost', async (c) => {
   return c.json(200, process.env.HOST);
})
