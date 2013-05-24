const Cc = Components.classes;
const Ci = Components.interfaces;

function toggleGraphite(window) {
  var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
  var graphitePref = prefManager.getBoolPref("gfx.font_rendering.graphite.enabled"); 

    if (graphitePref==false) {
	prefManager.setBoolPref("gfx.font_rendering.graphite.enabled", true); 
	window.NativeWindow.toast.show("Turning Graphite support ON.", "short");
    } else {
	prefManager.setBoolPref("gfx.font_rendering.graphite.enabled", false);  
	window.NativeWindow.toast.show("Turning Graphite support OFF.", "short");
    }
}

var menuId;
 
function loadIntoWindow(window) {
  if (!window)
    return;
  menuId = window.NativeWindow.menu.add("Toggle Graphite ON/OFF", null, function() {
    toggleGraphite(window);
  });
}
 
function unloadFromWindow(window) {
  if (!window)
    return;
  window.NativeWindow.menu.remove(menuId);
}
 
var windowListener = {
  onOpenWindow: function(aWindow) {
    // Wait for the window to finish loading
    let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
    domWindow.addEventListener("load", function() {
      domWindow.removeEventListener("load", arguments.callee, false);
      loadIntoWindow(domWindow);
    }, false);
  },
  
  onCloseWindow: function(aWindow) {},
  onWindowTitleChange: function(aWindow, aTitle) {}
};
 
function startup(aData, aReason) {
  let wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
 
  // Load into any existing windows
  let windows = wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    loadIntoWindow(domWindow);
  }
 
  // Load into any new windows
  wm.addListener(windowListener);
}
 
function shutdown(aData, aReason) {
  // When the application is shutting down we normally don't have to clean
  // up any UI changes made
  if (aReason == APP_SHUTDOWN)
    return;
 
  let wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
 
  // Stop listening for new windows
  wm.removeListener(windowListener);
 
  // Unload from any existing windows
  let windows = wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    unloadFromWindow(domWindow);
  }
}
 
function install(aData, aReason) {}
function uninstall(aData, aReason) {
  var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
  var graphitePref = prefManager.getBoolPref("gfx.font_rendering.graphite.enabled"); 
  prefManager.setBoolPref("gfx.font_rendering.graphite.enabled", false);  
}
