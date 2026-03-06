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

            // JSON model
            var oModel = new JSONModel();
            oModel.loadData(
                sap.ui.require.toUrl("customer/com/ui5app/model/data.json")
            );
            this.setModel(oModel);

            this.getRouter().initialize();
        }

    });
});