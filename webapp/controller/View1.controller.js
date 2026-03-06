sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (Controller, Filter, FilterOperator, JSONModel, MessageBox, MessageToast, Fragment) {
    "use strict";

    return Controller.extend("customer.com.ui5app.controller.View1", {

        onInit: function () {
            this.getView().setModel(new JSONModel({
                dialogTitle: "Add Customer",
                dialogTitle2: "Mr",
                dialogFirstName: "",
                dialogLastName: "",
                dialogCity: "",
                dialogAddress: "",
                dialogRegisterDate: "",
                dialogNotes: ""
            }), "dialog");
            this._editIndex = null;
        },

        onSearch: function (oEvent) {
            var sValue = oEvent.getParameter("newValue");
            var oBinding = this.byId("customerTable").getBinding("items");
            if (sValue) {
                oBinding.filter(new Filter({
                    filters: [
                        new Filter("FirstName", FilterOperator.Contains, sValue),
                        new Filter("LastName", FilterOperator.Contains, sValue),
                        new Filter("City", FilterOperator.Contains, sValue)
                    ],
                    and: false
                }));
            } else {
                oBinding.filter([]);
            }
        },

        onItemPress: function (oEvent) {
            var oItem = oEvent.getParameter("listItem") || oEvent.getSource();
            var oContext = oItem.getBindingContext();
            if (!oContext) { return; }
            this.getOwnerComponent().getRouter().navTo("RouteView2", {
                id: oContext.getProperty("id")
            });
        },

        onRefresh: function () {
            var oModel = this.getOwnerComponent().getModel();
            oModel.loadData("model/data.json", null, true);
            this.byId("customerTable").getBinding("items").filter([]);
            this.byId("SearchField").setValue("");
            MessageToast.show("Data refreshed");
        },

        onAddCustomer: function () {
            this._editIndex = null;
            this.getView().getModel("dialog").setData({
                dialogTitle: "Add Customer",
                dialogTitle2: "Mr",
                dialogFirstName: "",
                dialogLastName: "",
                dialogCity: "",
                dialogAddress: "",
                dialogRegisterDate: new Date().toISOString().split("T")[0],
                dialogNotes: ""
            });
            this._openDialog();
        },

        onEditCustomer: function (oEvent) {
            oEvent.cancelBubble();
            oEvent.preventDefault();
            var oContext = oEvent.getSource().getBindingContext();
            if (!oContext) { return; }
            var oCustomer = oContext.getObject();
            var aCustomers = this.getOwnerComponent().getModel().getProperty("/Customers");
            this._editIndex = aCustomers.findIndex(function (c) { return c.id === oCustomer.id; });
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

            if (this._editIndex === null) {
                var nMaxId = aCustomers.reduce(function (max, c) {
                    return Math.max(max, parseInt(c.id, 10) || 0);
                }, 0);
                aCustomers.push({
                    id: String(nMaxId + 1),
                    Title: oData.dialogTitle2,
                    FirstName: oData.dialogFirstName.trim(),
                    LastName: oData.dialogLastName.trim(),
                    City: oData.dialogCity.trim(),
                    Address: oData.dialogAddress.trim(),
                    RegisterDate: oData.dialogRegisterDate,
                    Notes: oData.dialogNotes.trim()
                });
                MessageToast.show("Customer added successfully.");
            } else {
                aCustomers[this._editIndex] = Object.assign({}, aCustomers[this._editIndex], {
                    Title: oData.dialogTitle2,
                    FirstName: oData.dialogFirstName.trim(),
                    LastName: oData.dialogLastName.trim(),
                    City: oData.dialogCity.trim(),
                    Address: oData.dialogAddress.trim(),
                    RegisterDate: oData.dialogRegisterDate,
                    Notes: oData.dialogNotes.trim()
                });
                MessageToast.show("Customer updated successfully.");
            }

            oModel.setProperty("/Customers", aCustomers);
            this._closeDialog();
        },

        onDeleteCustomer: function (oEvent) {
            oEvent.cancelBubble();
            oEvent.preventDefault();
            var oContext = oEvent.getSource().getBindingContext();
            if (!oContext) { return; }
            var oCustomer = oContext.getObject();
            var sName = [oCustomer.Title, oCustomer.FirstName, oCustomer.LastName].filter(Boolean).join(" ");
            var oModel = this.getOwnerComponent().getModel();

            MessageBox.confirm("Are you sure you want to delete " + sName + "?", {
                title: "Confirm Delete",
                actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.DELETE,
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.DELETE) {
                        var aCustomers = oModel.getProperty("/Customers").slice();
                        var nIdx = aCustomers.findIndex(function (c) { return c.id === oCustomer.id; });
                        if (nIdx > -1) {
                            aCustomers.splice(nIdx, 1);
                            oModel.setProperty("/Customers", aCustomers);
                            MessageToast.show(sName + " deleted.");
                        }
                    }
                }
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