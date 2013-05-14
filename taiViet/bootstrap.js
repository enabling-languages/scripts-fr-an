/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
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
  
  var fromDir = null;
  var fromFile = null;
  var checkFile = null;
  var fontAdded = false;

  function linkFromDir() {
   fromDir = Cc["@mozilla.org/file/directory_service;1"].
                  getService(Ci.nsIProperties).
                  get("ProfD", Ci.nsIFile);
   fromDir.append("extensions");
   fromDir.append("taivietfonts@openroad.net.au");
   fromDir.append("defaults");
  }
  
  //when v19 moves to beta, remove font check in root user profile dir
  checkFile = profiledir.clone();
  checkFile.append("TaiHeritagePro-R.ttf");
  if (!checkFile.exists()) {
   if (fromDir == null) linkFromDir();
   
   fromFile = fromDir.clone();
   fromFile.append("TaiHeritagePro-R.ttf");
   fromFile.copyTo(profiledir,"TaiHeritagePro-R.ttf");

   fromFile = fromDir.clone();
   fromFile.append("TaiHeritagePro-B.ttf");
   fromFile.copyTo(profiledir,"TaiHeritagePro-B.ttf");

   fontAdded = true;
  }
  
  checkFile = fontdir.clone();
  checkFile.append("TaiHeritagePro-R.ttf");
  if (!checkFile.exists()) { 
   if (fromDir == null) linkFromDir();
   
   fromFile = fromDir.clone();
   fromFile.append("TaiHeritagePro-R.ttf");
   fromFile.copyTo(fontdir,"TaiHeritagePro-R.ttf");
   
   fromFile = fromDir.clone();
   fromFile.append("TaiHeritagePro-B.ttf");
   fromFile.copyTo(fontdir,"TaiHeritagePro-B.ttf");
   
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
  var checkFile = null;
  var profiledir = Cc["@mozilla.org/file/directory_service;1"].
                  getService(Ci.nsIProperties).
                  get("ProfD", Ci.nsIFile);
  var fontdir = profiledir.clone();
  fontdir.append("fonts");

  checkFile = profiledir.clone();
  checkFile.append("TaiHeritagePro-R.ttf");
  if (checkFile.exists()) checkFile.remove(true);
  
  checkFile = profiledir.clone();
  checkFile.append("TaiHeritagePro-B.ttf");
  if (checkFile.exists()) checkFile.remove(true);
 
  if (fontdir.exists()) {
   checkFile = fontdir.clone();
   checkFile.append("TaiHeritagePro-R.ttf");
   if (checkFile.exists()) checkFile.remove(true);

   checkFile = fontdir.clone();
   checkFile.append("TaiHeritagePro-B.ttf");
   if (checkFile.exists()) checkFile.remove(true);
  }

  var fonts = Cc["@mozilla.org/gfx/fontenumerator;1"].getService(Components.interfaces.nsIFontEnumerator);
  fonts.updateFontList();
 }
}
