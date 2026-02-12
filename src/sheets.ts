import { google } from "googleapis";
import fs from "fs";

export async function appendToSheet(row: string[]) {

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID!,
    range: "Sheet1",
    valueInputOption: "RAW",
    requestBody: {
      values: [row],
    },
  });
}