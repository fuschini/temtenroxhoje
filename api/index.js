const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_SECRET });

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    let httpMethod = event.httpMethod;
    let response;

    const timezone = event.queryStringParameters?.timezone;

    if (!timezone) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: "Missing required parameter: timezone",
            }),
        };
    }

    // Get today in the specified timezone as a ISO 8601 string
    const todayDate = new Date().toLocaleDateString("en-US", {
        timeZone: timezone,
    });

    const date = new Date(todayDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed in JavaScript
    const day = String(date.getDate()).padStart(2, "0");

    const today = `${year}-${month}-${day}`;

    const notionRes = await notion.databases.query({
        database_id: process.env.NOTION_DB_ID,
        filter: {
            property: "Date",
            date: {
                equals: today,
            },
        },
        sorts: [
            {
                property: "Date",
                direction: "ascending",
            },
        ],
    });

    console.log(notionRes);

    response = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            notionRes.results.length > 0 ? simplifyNotionObject(notionRes.results[0]) : null
        ),
    };

    return response;
};

function simplifyNotionObject(notionObject) {
    let res = {
        id: notionObject.id,
        created_time: notionObject.created_time,
        last_edited_time: notionObject.last_edited_time,
    };

    for (const column in notionObject.properties) {
        const sanitizedColumnName = column.replace(/\s/g, "_").toLocaleLowerCase();
        switch (notionObject.properties[column].type) {
            case "title":
                // @ts-ignore
                res[sanitizedColumnName] = notionObject.properties[column].title[0]?.plain_text;
                break;
            case "rich_text":
                // @ts-ignore
                res[sanitizedColumnName] = notionObject.properties[column].rich_text[0]?.plain_text;
                break;
            case "date":
                // @ts-ignore
                res[sanitizedColumnName] = notionObject.properties[column].date?.start ?? null;
                break;
            case "select":
                // @ts-ignore
                res[sanitizedColumnName] = notionObject.properties[column].select.name;
                break;
            case "number":
                // @ts-ignore
                res[sanitizedColumnName] = notionObject.properties[column].number;
                break;
            case "checkbox":
                // @ts-ignore
                res[sanitizedColumnName] = notionObject.properties[column].checkbox;
                break;
            case "multi_select":
                // @ts-ignore
                res[sanitizedColumnName] = notionObject.properties[column].multi_select.map(
                    (option) => option.name
                );
                break;
            case "select":
                // @ts-ignore
                res[sanitizedColumnName] = notionObject.properties[column].select.name;
                break;
            // default:
            //     throw new CustomError("NOTION_ERROR", "Invalid notion property type");
        }
    }

    return res;
}
