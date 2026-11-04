
from datetime import date, datetime
from typing import Optional
from ..config import settings


SHEET_ID = settings.google_sheet_id


def get_sheets_client():
    import gspread
    from google.oauth2.service_account import Credentials

    creds = Credentials.from_service_account_file(
        "credentials.json",
        scopes=[
            "https://www.googleapis.com/auth/spreadsheets"
        ],
    )

    return gspread.authorize(creds)


HEADERS = [
    "ID",
    "Company",
    "Position",
    "Application Date",
    "Status",
    "Location",
    "Source",
    "Job URL",
    "Required Skills"
]


def append_to_sheet(app_dict: dict):
    if not SHEET_ID:
        return

    gc = get_sheets_client()
    sheet = gc.open_by_key(SHEET_ID).sheet1

    if not sheet.row_values(1):
        sheet.append_row(HEADERS)

    application_date = app_dict["application_date"]

    if isinstance(application_date, (date, datetime)):
        application_date = application_date.isoformat()

    skills = app_dict.get("required_skills", [])

    if isinstance(skills, list):
        skills = ", ".join(str(skill) for skill in skills)

    sheet.append_row([
        app_dict["id"],
        app_dict["company"],
        app_dict["position"],
        application_date,
        app_dict["status"],
        app_dict.get("location", ""),
        app_dict.get("source", ""),
        app_dict.get("job_url", ""),
        skills,
    ], value_input_option="USER_ENTERED")



def format_sheet(sheet):

    sheet_id = sheet.id
    spreadsheet = sheet.spreadsheet

    def rgb(hex_color):
        hex_color = hex_color.lstrip("#")
        return {
            "red": int(hex_color[0:2], 16) / 255,
            "green": int(hex_color[2:4], 16) / 255,
            "blue": int(hex_color[4:6], 16) / 255,
        }

    NAVY = "#090D18"
    CARD = "#111827"
    ELEVATED = "#1B2234"
    CYAN = "#22D3EE"
    VIOLET = "#A78BFA"
    WHITE = "#F1F5F9"
    MUTED = "#94A3B8"

    status_colors = {
        "Applied": ("#164E63", "#67E8F9"),
        "Interview": ("#312E81", "#C4B5FD"),
        "Offer": ("#14532D", "#86EFAC"),
        "Rejected": ("#881337", "#FDA4AF"),
        "Pending": ("#78350F", "#FDE68A"),
        "Withdrawn": ("#334155", "#CBD5E1"),
    }


    metadata = spreadsheet.fetch_sheet_metadata(
        params={
            "fields": "sheets(properties(sheetId),bandedRanges,conditionalFormats)"
        }
    )

    requests = []

    for sheet_info in metadata.get("sheets", []):
        if sheet_info.get("properties", {}).get("sheetId") == sheet_id:

            for band in sheet_info.get("bandedRanges", []):
                band_id = band.get("bandedRangeId")

                if band_id is not None:
                    requests.append({
                        "deleteBanding": {
                            "bandedRangeId": band_id
                        }
                    })

            old_rules = sheet_info.get("conditionalFormats", [])

            for index in reversed(range(len(old_rules))):
                requests.append({
                    "deleteConditionalFormatRule": {
                        "sheetId": sheet_id,
                        "index": index
                    }
                })


    requests.append({
        "updateSheetProperties": {
            "properties": {
                "sheetId": sheet_id,
                "gridProperties": {
                    "frozenRowCount": 1
                }
            },
            "fields": "gridProperties.frozenRowCount"
        }
    })


    requests.append({
        "repeatCell": {
            "range": {
                "sheetId": sheet_id,
                "startRowIndex": 0,
                "endRowIndex": 1,
                "startColumnIndex": 0,
                "endColumnIndex": 9
            },
            "cell": {
                "userEnteredFormat": {
                    "backgroundColor": rgb(NAVY),
                    "textFormat": {
                        "foregroundColor": rgb(WHITE),
                        "bold": True,
                        "fontSize": 10,
                        "fontFamily": "Arial"
                    },
                    "horizontalAlignment": "CENTER",
                    "verticalAlignment": "MIDDLE",
                    "wrapStrategy": "WRAP"
                }
            },
            "fields": "userEnteredFormat"
        }
    })

    for column_index in [1, 2, 4]:
        requests.append({
            "repeatCell": {
                "range": {
                    "sheetId": sheet_id,
                    "startRowIndex": 0,
                    "endRowIndex": 1,
                    "startColumnIndex": column_index,
                    "endColumnIndex": column_index + 1
                },
                "cell": {
                    "userEnteredFormat": {
                        "textFormat": {
                            "foregroundColor": rgb(CYAN),
                            "bold": True
                        }
                    }
                },
                "fields": "userEnteredFormat.textFormat"
            }
        })

    requests.append({
        "repeatCell": {
            "range": {
                "sheetId": sheet_id,
                "startRowIndex": 0,
                "endRowIndex": 1,
                "startColumnIndex": 8,
                "endColumnIndex": 9
            },
            "cell": {
                "userEnteredFormat": {
                    "textFormat": {
                        "foregroundColor": rgb(VIOLET),
                        "bold": True
                    }
                }
            },
            "fields": "userEnteredFormat.textFormat"
        }
    })

    requests.append({
        "updateDimensionProperties": {
            "range": {
                "sheetId": sheet_id,
                "dimension": "ROWS",
                "startIndex": 0,
                "endIndex": 1
            },
            "properties": {
                "pixelSize": 38
            },
            "fields": "pixelSize"
        }
    })


    requests.append({
        "addBanding": {
            "bandedRange": {
                "range": {
                    "sheetId": sheet_id,
                    "startRowIndex": 0,
                    "startColumnIndex": 0,
                    "endColumnIndex": 9
                },
                "rowProperties": {
                    "headerColor": rgb(NAVY),
                    "firstBandColor": rgb(CARD),
                    "secondBandColor": rgb(ELEVATED)
                }
            }
        }
    })


    requests.append({
        "setBasicFilter": {
            "filter": {
                "range": {
                    "sheetId": sheet_id,
                    "startRowIndex": 0,
                    "startColumnIndex": 0,
                    "endColumnIndex": 9
                }
            }
        }
    })



    requests.append({
        "repeatCell": {
            "range": {
                "sheetId": sheet_id,
                "startRowIndex": 1,
                "startColumnIndex": 3,
                "endColumnIndex": 4
            },
            "cell": {
                "userEnteredFormat": {
                    "numberFormat": {
                        "type": "DATE",
                        "pattern": "dd mmm yyyy"
                    },
                    "horizontalAlignment": "CENTER",
                    "textFormat": {
                        "foregroundColor": rgb(MUTED),
                        "fontSize": 9
                    }
                }
            },
            "fields": "userEnteredFormat.numberFormat,"
                      "userEnteredFormat.horizontalAlignment,"
                      "userEnteredFormat.textFormat"
        }
    })

 

    requests.append({
        "setDataValidation": {
            "range": {
                "sheetId": sheet_id,
                "startRowIndex": 1,
                "endRowIndex": 1000,
                "startColumnIndex": 4,
                "endColumnIndex": 5
            },
            "rule": {
                "condition": {
                    "type": "ONE_OF_LIST",
                    "values": [
                        {"userEnteredValue": "Applied"},
                        {"userEnteredValue": "Interview"},
                        {"userEnteredValue": "Offer"},
                        {"userEnteredValue": "Rejected"},
                        {"userEnteredValue": "Pending"},
                        {"userEnteredValue": "Withdrawn"}
                    ]
                },
                "showCustomUi": True,
                "strict": True
            }
        }
    })

  

    column_widths = [
        65, 200, 220, 150, 135, 170, 145, 260, 300
    ]

    for index, width in enumerate(column_widths):
        requests.append({
            "updateDimensionProperties": {
                "range": {
                    "sheetId": sheet_id,
                    "dimension": "COLUMNS",
                    "startIndex": index,
                    "endIndex": index + 1
                },
                "properties": {
                    "pixelSize": width
                },
                "fields": "pixelSize"
            }
        })

   

    requests.append({
        "repeatCell": {
            "range": {
                "sheetId": sheet_id,
                "startRowIndex": 1,
                "startColumnIndex": 0,
                "endColumnIndex": 9
            },
            "cell": {
                "userEnteredFormat": {
                    "verticalAlignment": "MIDDLE",
                    "wrapStrategy": "WRAP",
                    "textFormat": {
                        "fontFamily": "Arial",
                        "fontSize": 9,
                        "foregroundColor": rgb(WHITE)
                    }
                }
            },
            "fields": "userEnteredFormat"
        }
    })

    
    requests.append({
        "repeatCell": {
            "range": {
                "sheetId": sheet_id,
                "startRowIndex": 1,
                "startColumnIndex": 1,
                "endColumnIndex": 2
            },
            "cell": {
                "userEnteredFormat": {
                    "textFormat": {
                        "bold": True,
                        "foregroundColor": rgb(CYAN),
                        "fontSize": 9
                    }
                }
            },
            "fields": "userEnteredFormat.textFormat"
        }
    })

    
    requests.append({
        "repeatCell": {
            "range": {
                "sheetId": sheet_id,
                "startRowIndex": 1,
                "startColumnIndex": 2,
                "endColumnIndex": 3
            },
            "cell": {
                "userEnteredFormat": {
                    "textFormat": {
                        "bold": True,
                        "foregroundColor": rgb(WHITE),
                        "fontSize": 9
                    }
                }
            },
            "fields": "userEnteredFormat.textFormat"
        }
    })

    
    requests.append({
        "repeatCell": {
            "range": {
                "sheetId": sheet_id,
                "startRowIndex": 1,
                "startColumnIndex": 8,
                "endColumnIndex": 9
            },
            "cell": {
                "userEnteredFormat": {
                    "textFormat": {
                        "foregroundColor": rgb(VIOLET),
                        "fontSize": 9
                    }
                }
            },
            "fields": "userEnteredFormat.textFormat"
        }
    })

 
    requests.append({
        "repeatCell": {
            "range": {
                "sheetId": sheet_id,
                "startRowIndex": 1,
                "startColumnIndex": 7,
                "endColumnIndex": 8
            },
            "cell": {
                "userEnteredFormat": {
                    "textFormat": {
                        "foregroundColor": rgb(CYAN),
                        "underline": True,
                        "fontSize": 9
                    }
                }
            },
            "fields": "userEnteredFormat.textFormat"
        }
    })

    requests.append({
        "updateDimensionProperties": {
            "range": {
                "sheetId": sheet_id,
                "dimension": "ROWS",
                "startIndex": 1
            },
            "properties": {
                "pixelSize": 34
            },
            "fields": "pixelSize"
        }
    })

   

    for status, (background, foreground) in status_colors.items():

        if status == "Applied":
            continue

        requests.append({
            "addConditionalFormatRule": {
                "rule": {
                    "ranges": [{
                        "sheetId": sheet_id,
                        "startRowIndex": 1,
                        "endRowIndex": 1000,
                        "startColumnIndex": 0,
                        "endColumnIndex": 9
                    }],
                    "booleanRule": {
                        "condition": {
                            "type": "CUSTOM_FORMULA",
                            "values": [{
                                "userEnteredValue": f'=$E2="{status}"'
                            }]
                        },
                        "format": {
                            "backgroundColor": rgb(background),
                            "textFormat": {
                                "foregroundColor": rgb(foreground),
                                "bold": True
                            }
                        }
                    }
                },
                "index": 0
            }
        })


    spreadsheet.batch_update({
        "requests": requests
    })

    print("NEXTMOVE dark theme styling applied successfully!")
def update_status_in_sheet(application_id: int, status: str):
    """
    Update the status of an existing application in Google Sheets.

    Column A = Application ID
    Column E = Status
    """

    if not SHEET_ID:
        print("Google Sheets sync skipped: SHEET_ID is not configured.")
        return

    client = get_sheets_client()
    sheet = client.open_by_key(SHEET_ID).sheet1

    # Find the application ID in column A
    cell = sheet.find(str(application_id), in_column=1)

    if cell is None:
        print(
            f"Application {application_id} not found in Google Sheets."
        )
        return

  
    sheet.update_cell(cell.row, 5, status)

    print(
        f"Google Sheets updated: application {application_id} -> {status}"
    )