/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["customer/com/ui5app/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
