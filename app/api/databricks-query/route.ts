import { NextResponse } from "next/server";

export async function GET() {
  const host = process.env.DATABRICKS_HOST;
  const httpPath = process.env.DATABRICKS_HTTP_PATH;
  const token = process.env.DATABRICKS_TOKEN;

  if (!host || !httpPath || !token) {
    return NextResponse.json(
      { error: "Missing Databricks environment variables" },
      { status: 500 }
    );
  }

  const endpoint = `https://${host}/api/2.0/sql/statements`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        statement: "WITH ranked AS (SELECT date, notification_name, get_json_object(CAST(notification_attributes AS STRING), '$.my_product_id') AS my_product_id, alert_id, ROW_NUMBER() OVER (PARTITION BY alert_id ORDER BY date) AS rn FROM nimble_us.data_alerts.stg_alerts WHERE get_json_object(CAST(notification_attributes AS STRING), '$.my_product_id') IS NOT NULL) SELECT date, notification_name, my_product_id, alert_id FROM ranked WHERE rn = 1",
        warehouse_id: httpPath.split("/").pop(),
        catalog: "nimble_us",
        schema: "demo"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Databricks API error: ${data.error}`);
    }

    return NextResponse.json({ success: true, result: data });
  } catch (error) {
    const err = error as Error;
    console.error("Error querying Databricks:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
