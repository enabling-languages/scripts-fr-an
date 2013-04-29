Components.utils.import("resource://gre/modules/Services.jsm");

var Cc = Components.classes;
var Ci = Components.interfaces;

function install() {}
 
function uninstall() {}
 
function startup(data, reason) {
 if (reason == 3 || reason == 5 || reason == 7) {     
  //note: fonts are compiled from the ProfLD directory, nor ProfD
  var profiledir = Cc["@mozilla.org/file/directory_service;1"].
                  getService(Ci.nsIProperties).
                  get("ProfLD", Ci.nsIFile);
  var fontdir = profiledir.clone();
  fontdir.append("fonts");
  if (!fontdir.exists()) {
   fontdir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0777)
  } else {
   fontdir.permissions = 0777;
  }
  
  var fromFile = null;
  var checkFile = null;
  var fontAdded = false;

  function linkFromFile() {
   fromFile = Cc["@mozilla.org/file/directory_service;1"].
                  getService(Ci.nsIProperties).
                  get("ProfD", Ci.nsIFile);
   fromFile.append("extensions");
   fromFile.append("myanmarfonts@openroad.net.au");
   fromFile.append("defaults");
   fromFile.append("Padauk.ttf");
  }
  
  //when v19 moves to beta, remove font check in root user profile dir
  checkFile = profiledir.clone();
  checkFile.append("Padauk.ttf");
  if (!checkFile.exists()) { 
   if (fromFile == null) linkFromFile();
   fromFile.copyTo(profiledir,"Padauk.ttf");
   fontAdded = true;
  }
  
  checkFile = fontdir.clone();
  checkFile.append("Padauk.ttf");
  if (!checkFile.exists()) { 
   if (fromFile == null) linkFromFile();
   fromFile.copyTo(fontdir,"Padauk.ttf");
   fontAdded = true;
  } 
  
  if (fontAdded) {
   var fonts = Cc["@mozilla.org/gfx/fontenumerator;1"].getService(Components.interfaces.nsIFontEnumerator);
   fonts.updateFontList();
  }
 }
}
 
function shutdown(data, reason) {
 if (reason == 4) {
  //be nice, clean up
  var profiledir = Cc["@mozilla.org/file/directory_service;1"].
                  getService(Ci.nsIProperties).
                  get("ProfD", Ci.nsIFile);
  var fontdir = profiledir.clone();
  fontdir.append("fonts");

  var checkFile = profiledir.clone();
  checkFile.append("Padauk.ttf");
  if (checkFile.exists()) {
   checkFile.remove(true);
  }
 
  if (fontdir.exists()) {
   checkFile = fontdir.clone();
   checkFile.append("Padauk.ttf");
   if (checkFile.exists()) {
    checkFile.remove(true);
   }
  }

  var fonts = Cc["@mozilla.org/gfx/fontenumerator;1"].getService(Components.interfaces.nsIFontEnumerator);
  fonts.updateFontList();
 }
}
