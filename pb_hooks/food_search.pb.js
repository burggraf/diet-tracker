/// <reference path="../pb_data/types.d.ts" />
/*
SELECT days.*
FROM days,
     json_each(days.food_log, '$.entries') AS entries
WHERE json_extract(entries.value, '$.desc') LIKE '%search_string%'
   OR json_extract(entries.value, '$.title') LIKE '%search_string%';
*/

routerAdd('POST', '/food_search', async (c) => {
	const { select } = require(`${__hooks}/sql.js`)
	const data = $apis.requestInfo(c).data
	const info = $apis.requestInfo(c)
	const user = info.authRecord // empty if not authenticated as regular auth record
	if (!user) {
		return c.json(200, { data: null, error: 'not logged in' })
	}
	if (!data?.search_string) {
		return c.json(200, { data: null, error: 'search_string is required' })
	}
    const search_string = data?.search_string;
    if (search_string.length < 3) {
        return c.json(200, { data: null, error: 'search_string must be at least 3 characters' })
    }
	
	const { data: records, error } = 
		select({food_log: {}},
		`SELECT days.food_log
        FROM days,
             json_each(days.food_log, '$.entries') AS entries
        WHERE json_extract(entries.value, '$.desc') LIKE '%${search_string}%'
           OR json_extract(entries.value, '$.title') LIKE '%${search_string}%'
        ORDER BY date desc
        LIMIT 50`);
    if (error) {
        return c.json(500, { data: null, error: error })
    } else {
        return c.json(200, { data: records, error: null })
    }

})