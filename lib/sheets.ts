// lib/sheets.ts
import { google } from 'googleapis';
import { Activity } from './kpi';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);
  return new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
}

export async function appendActivity(activity: Activity) {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: 'Activity_Log!A:Z',
    valueInputOption: 'RAW',
    requestBody: { values: [activityToRow(activity)] },
  });
}

function activityToRow(a: Activity): (string | number)[] {
  return [
    a.id,
    a.area,
    a.timeSlot,
    a.successfulOpenings,
    a.totalHours,
    a.fieldHours,
    a.approachCount,
    a.conversationCount,
    a.registrationStartCount,
    a.registrationSuccessCount,
  ];
}

export async function fetchActivities(): Promise<Activity[]> {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: 'Activity_Log!A2:J', // skip header row
  });
  const rows = res.data.values ?? [];
  return rows.map((r) => ({
    id: String(r[0]),
    area: String(r[1]),
    timeSlot: String(r[2]),
    successfulOpenings: Number(r[3]),
    totalHours: Number(r[4]),
    fieldHours: Number(r[5]),
    approachCount: Number(r[6]),
    conversationCount: Number(r[7]),
    registrationStartCount: Number(r[8]),
    registrationSuccessCount: Number(r[9]),
  }));
}
