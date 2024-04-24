// Copyright (c) 2023, Aron Wiederkehr and contributors
// For license information, please see license.txt

frappe.ui.form.on('Termin', {
    refresh: function (frm) {
        var allowed_statuses = ['Wiedervorlage', 'Privat Fichtel - Praxis', 'Termin bestätigt, Gutachten', 'Planung Fahrer', 'Vergebliche Anfahrt', 'abgs. Praxis - neu terminieren', 'Termin mitgeteilt, nicht bestätigt', 'Termin geplant nicht mitgeteilt', 'Urlaub', 'Arbeitszeiten (An- und Abwesenheit)'];
        if (allowed_statuses.includes(frm.doc.status)) {
            frm.add_custom_button(__('Neuer Termin'), function () {
                frappe.model.with_doctype('Termin', function () {
                    var new_doc = frappe.model.get_new_doc('Termin');
                    new_doc.gutachten = frm.doc.gutachten;
                    new_doc.date = frm.doc.date;
                    new_doc.last_name = frm.doc.last_name;
                    frappe.set_route('Form', 'Termin', new_doc.name);
                });

            });
        } else {
            frm.add_custom_button(__('Neuer Termin'), function () {
                frappe.msgprint(__('Bitte den Status des Termins auf einen der folgenden setzen:\n {0}', [allowed_statuses.join(', ')]));
            }).addClass('disabled');
        }
        frm.set_value("color", "#B04DD0")
    },
    status: function (frm) {
        var color = getStatusColor(frm.doc.status);
        frm.set_value('color', color);
    }
});

function getStatusColor(status) {
    var statusColorMapping = {

        "Wiedervorlage": "#B04DD0",
        "Privat Fichtel - Praxis": "#000000",
        "Termin bestätigt, Gutachten": "#DA2B4D",
        "Planung Fahrer": "#629EF2",
        "Vergebliche Anfahrt": "#D0D0D0",
        "abgs. Praxis - neu terminieren": "#E07F26",
        "Termin mitgeteilt, nicht bestätigt": "#63D13B",
        "Termin geplant nicht mitgeteilt": "#629EF2",
        "Urlaub": "#629EF2",
        "Arbeitszeiten (An- und Abwesenheit)": "#B04DD0",

        /*
        "Wiedervorlage": "#FAD7A0",
        "Privat Fichtel - Praxis": "#FDEBD0",
        "Termin bestätigt, Gutachten": "#85C1E9",
        "Planung Fahrer": "#82E0AA",
        "Vergebliche Anfahrt": "#FAD7A0",
        "abgs. Praxis - neu terminieren": "#E6B0AA",
        "Termin mitgeteilt, nicht bestätigt": "#E6B0AA",
        "Termin geplant nicht mitgeteilt": "#E6B0AA",
        "Urlaub": "#E6B0AA",
        "Arbeitszeiten (An- und Abwesenheit)": "#E6B0AA",
        */
    };

    return statusColorMapping[status];
}