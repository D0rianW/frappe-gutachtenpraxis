# Copyright (c) 2023, Aron Wiederkehr and contributors
# For license information, please see license.txt

import frappe
import requests
import json
from datetime import datetime, timedelta
from frappe.model.document import Document


class Gutachten(Document):
    def validate(self):
        self.file_name = self.name
        self.geolocation = address_to_geojson(self)
    def onload(self):
        print(self.geolocation)
        
    def address_string(self):
        if self.patient_a_patient_street:
            return f"{self.patient_a_patient_street}, {self.patient_a_patient_zipcode} {self.patient_a_patient_city}"
        else:
            return f"{self.patient_m_patient_street}, {self.patient_m_patient_zipcode} {self.patient_m_patient_city}"


@frappe.whitelist(allow_guest=True)
def generate_pdf(doctype, name):
    # Get the default Letter Head
    options = {"format": "A4", "orientation": "Portrait"}

    # Generate the HTML for the Print Format
    html = frappe.get_print(doctype, name, print_format="Anamnesebogen")

    # Create the PDF
    pdf = frappe.utils.pdf.get_pdf(html)

    # Set the file name
    filename = "{name}.pdf".format(name=name)

    # Set the response headers for PDF file
    frappe.local.response.filename = filename
    frappe.local.response.filecontent = pdf
    frappe.local.response.type = "download"


def update_kanban(doc, method):
    # Set the Kanban column to the linked Amtsgericht
    frappe.db.set_value("Gutachten", doc.name, "kanban_column", doc.court)


        

def address_to_geojson(doc):
    response = requests.get(
        "https://nominatim.openstreetmap.org/search",
        params={"q": doc.address_string(), "format": "json"},
    )
    data = response.json()
    if data:
        geojson = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {"name": "Adresse"},
                    "geometry": {
                        "type": "Point",
                        "coordinates": [data[0]["lon"], data[0]["lat"]],
                    },
                }
            ],
        }
        return json.dumps(geojson)
