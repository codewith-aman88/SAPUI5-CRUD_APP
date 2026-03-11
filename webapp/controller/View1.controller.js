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

    var API_BASE = "/api/customers";

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
            this._loadFromServer();
        },

        _loadFromServer: function () {
            var oModel = this.getOwnerComponent().getModel();
            fetch(API_BASE)
                .then(function (r) { return r.json(); })
                .then(function (data) { oModel.setData(data); })
                .catch(function () { /* fallback: manifest already loaded data.json */ });
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
            this._loadFromServer();
            this.byId("customerTable").getBinding("items").filter([]);
            this.byId("SearchField").setValue("");
            MessageToast.show("Data refreshed");
        },

        onAddCustomer: function () {
            this._editIndex = null;
            this._editCustomerId = null;
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
            this._editCustomerId = oCustomer.id;
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
            var that = this;

            var payload = {
                Title: oData.dialogTitle2,
                FirstName: oData.dialogFirstName.trim(),
                LastName: oData.dialogLastName.trim(),
                City: oData.dialogCity.trim(),
                Address: oData.dialogAddress.trim(),
                RegisterDate: oData.dialogRegisterDate,
                Notes: oData.dialogNotes.trim()
            };

            if (this._editIndex === null) {
                fetch(API_BASE, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                })
                .then(function (r) { return r.json(); })
                .then(function (newCustomer) {
                    aCustomers.push(newCustomer);
                    oModel.setProperty("/Customers", aCustomers);
                    MessageToast.show("Customer added successfully.");
                    that._closeDialog();
                })
                .catch(function () {
                    MessageBox.error("Could not reach server. Change is only in memory.");
                });
            } else {
                fetch(API_BASE + "/" + this._editCustomerId, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                })
                .then(function (r) { return r.json(); })
                .then(function (updated) {
                    aCustomers[that._editIndex] = updated;
                    oModel.setProperty("/Customers", aCustomers);
                    MessageToast.show("Customer updated successfully.");
                    that._closeDialog();
                })
                .catch(function () {
                    MessageBox.error("Could not reach server. Change is only in memory.");
                });
            }
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
                        fetch(API_BASE + "/" + oCustomer.id, { method: "DELETE" })
                        .then(function () {
                            var aList = oModel.getProperty("/Customers").slice();
                            var nIdx = aList.findIndex(function (c) { return c.id === oCustomer.id; });
                            if (nIdx > -1) {
                                aList.splice(nIdx, 1);
                                oModel.setProperty("/Customers", aList);
                                MessageToast.show(sName + " deleted.");
                            }
                        })
                        .catch(function () {
                            MessageBox.error("Could not reach server. Change is only in memory.");
                        });
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
