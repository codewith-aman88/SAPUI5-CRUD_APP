sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], function (UIComponent, JSONModel, Device) {
    "use strict";

    return UIComponent.extend("customer.com.ui5app.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            // Device model
            this.setModel(new JSONModel(Device), "device");

            // Load data from backend API (persists to disk)
            // Falls back to data.json if API not available
            var oModel = new JSONModel();
            var that = this;

            fetch("/api/customers")
                .then(function (r) {
                    if (!r.ok) throw new Error("API error");
                    return r.json();
                })
                .then(function (data) {
                    oModel.setData(data);
                })
                .catch(function () {
                    // Fallback: load directly from file
                    oModel.loadData("model/data.json");
                });

            this.setModel(oModel);
            this.getRouter().initialize();
        }

    });
});
