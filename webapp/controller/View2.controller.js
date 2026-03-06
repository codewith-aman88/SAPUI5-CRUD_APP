sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (Controller, JSONModel, MessageBox, MessageToast, Fragment) {
    "use strict";

    return Controller.extend("customer.com.ui5app.controller.View2", {

        onInit: function () {
            this.getOwnerComponent().getRouter()
                .getRoute("RouteView2")
                .attachPatternMatched(this._onObjectMatched, this);
            this.getView().setModel(new JSONModel({}), "dialog");
        },

        _onObjectMatched: function (oEvent) {
            var sId = oEvent.getParameter("arguments").id;
            var oModel = this.getOwnerComponent().getModel();
            var aCustomers = oModel.getProperty("/Customers");
            if (!aCustomers) {
                oModel.attachRequestCompleted(function () {
                    this._bindById(sId);
                }.bind(this));
            } else {
                this._bindById(sId);
            }
        },

        _bindById: function (sId) {
            var oModel = this.getOwnerComponent().getModel();
            var aCustomers = oModel.getProperty("/Customers");
            var nIdx = aCustomers.findIndex(function (c) { return c.id === sId; });
            if (nIdx > -1) {
                this._currentIndex = nIdx;
                this.getView().bindElement("/Customers/" + nIdx);
            }
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },

        onEditCustomer: function () {
            var oCustomer = this.getOwnerComponent().getModel().getProperty("/Customers/" + this._currentIndex);
            this.getView().getModel("dialog").setData({
                dialogTitle: "Edit Customer",
                dialogTitle2: oCustomer.Title || "Mr",
                dialogFirstName: oCustomer.FirstName,
                dialogLastName: oCustomer.LastName,
                dialogCity: oCustomer.City,
                dialogAddress: oCustomer.Address || "",
                dialogRegisterDate: oCustomer.RegisterDate || "",
                dialogNotes: oCustomer.Notes || ""
            });
            this._openDialog();
        },

        onSaveCustomer: function () {
            var oData = this.getView().getModel("dialog").getData();
            if (!oData.dialogFirstName.trim() || !oData.dialogLastName.trim() || !oData.dialogCity.trim()) {
                MessageBox.error("Please fill in all required fields: First Name, Last Name, and City.");
                return;
            }
            var oModel = this.getOwnerComponent().getModel();
            var aCustomers = oModel.getProperty("/Customers").slice();
            aCustomers[this._currentIndex] = Object.assign({}, aCustomers[this._currentIndex], {
                Title: oData.dialogTitle2,
                FirstName: oData.dialogFirstName.trim(),
                LastName: oData.dialogLastName.trim(),
                City: oData.dialogCity.trim(),
                Address: oData.dialogAddress.trim(),
                RegisterDate: oData.dialogRegisterDate,
                Notes: oData.dialogNotes.trim()
            });
            oModel.setProperty("/Customers", aCustomers);
            this.getView().bindElement("/Customers/" + this._currentIndex);
            MessageToast.show("Customer updated successfully.");
            this._closeDialog();
        },

        onDeleteCustomer: function () {
            var oModel = this.getOwnerComponent().getModel();
            var oCustomer = oModel.getProperty("/Customers/" + this._currentIndex);
            var sName = [oCustomer.Title, oCustomer.FirstName, oCustomer.LastName].filter(Boolean).join(" ");

            MessageBox.confirm("Are you sure you want to delete " + sName + "?", {
                title: "Confirm Delete",
                actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.DELETE,
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.DELETE) {
                        var aCustomers = oModel.getProperty("/Customers").slice();
                        aCustomers.splice(this._currentIndex, 1);
                        oModel.setProperty("/Customers", aCustomers);
                        MessageToast.show(sName + " deleted.");
                        this.getOwnerComponent().getRouter().navTo("RouteView1");
                    }
                }.bind(this)
            });
        },

        _openDialog: function () {
            var oView = this.getView();
            if (!this._pDialogPromise) {
                this._pDialogPromise = Fragment.load({
                    id: oView.getId(),
                    name: "customer.com.ui5app.view.CustomerDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this._pDialogPromise.then(function (oDialog) { oDialog.open(); });
        },

        _closeDialog: function () {
            if (this._pDialogPromise) {
                this._pDialogPromise.then(function (oDialog) { oDialog.close(); });
            }
        },

        onCancelDialog: function () { this._closeDialog(); }
    });
});