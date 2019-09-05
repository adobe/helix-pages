
function test() {
  var md=toMarkdown("1I_FwT5qXkZTevAeZ9EqUqLaS0RbLFkI2", "/docs/index");
  Logger.log(md);
}

function error(msg, code) {
  var e = new Error(msg);
  e.statusCode = code;
  return e;
}

function doGet(req) {
  try {
    var path = req.parameter['path'] || req.pathInfo;
    if (!path) {
      throw error('no path', 404);
    }
    var rootId = req.parameter['rootId'];
    if (!rootId) {
      throw error('no rootId', 404);
    }
    initLogger({
      repo: req.parameter['src'],
      rid: req.parameter['rid'],
    });
    inf('GET %s%s', rootId, path);
    var md = toMarkdown(rootId, path);
    var json = JSON.stringify({
      "statusCode": 200,
      "headers": {
        'content-type': 'text/plain',
      },
      "body": md,
    });
    return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    err(e);
    // oops something went wrong
    var json = JSON.stringify({
      "statusCode": e.statusCode || 500,
      "body": e.message,
    });
    return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
  }
}

function saveInlineImage(image) {
  var meta = image.getAltDescription();
  if (meta) {
    try {
      meta = JSON.parse(meta);
    } catch (e) {
      // overwrite original description
      meta = {};
    }
  } else {
    meta = {};
  }
  var url = meta.url;
  if (!url) {
    var imageBlob = image.getBlob();
    var contentType = imageBlob.getContentType();
    var ext = "";
    if (/\/png$/.test(contentType)) {
      ext = ".png";
    } else if (/\/gif$/.test(contentType)) {
      ext = ".gif";
    } else if (/\/jpe?g$/.test(contentType)) {
      ext = ".jpg";
    } else {
      throw "Unsupported image type: " + contentType;
    }
    var md5 = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, imageBlob.getBytes());
    var md5hex = toHexString(md5);
    var name = md5hex + ext;
    url = storeImage(imageBlob, name);
    if (url) {
      meta.url = url;
      image.setAltDescription(JSON.stringify(meta));
    }
  }
  var alt = image.getAltTitle() || '';
  return ('![' + alt + '](' + url + ')');
}


function storeImage(imageBlob, name) {
  var params = {
    method: "PUT",
    payload: imageBlob,
    headers: {
      "x-ms-date": new Date().toString(),
      "x-ms-blob-type": "BlockBlob",
    },
    contentType: imageBlob.getContentType(),
    muteHttpExceptions: true, //get error content in the response
  }
  var scriptProperties = PropertiesService.getScriptProperties();
  var sas = scriptProperties.getProperty('AZURE_BLOB_SAS');
  var url = "https://helixblobs.blob.core.windows.net/helixcontentblobs/" + name;
  var resp = UrlFetchApp.fetch(url + sas, params);
  if (resp.getResponseCode() !== 200) {
    err('Error while storing image: %s', resp.getContentText());
    return null;
  } else {
    dbg('stored image %s', url);
    return url;
  }
}


function processText(inSrc, txt) {
  /* needs to be rewritten as lifted from https://github.com/mangini/gdocs2md */
  if (typeof (txt) === 'string') {
    return txt;
  }

  var pOut = txt.getText();
  if (!txt.getTextAttributeIndices) {
    return pOut;
  }

  var attrs = txt.getTextAttributeIndices();
  var lastOff = pOut.length;

  for (var i = attrs.length - 1; i >= 0; i--) {
    var off = attrs[i];
    var url = txt.getLinkUrl(off);
    var font = txt.getFontFamily(off);
    if (url) {  // start of link
      if (i >= 1 && attrs[i - 1] === off - 1 && txt.getLinkUrl(attrs[i - 1]) === url) {
        // detect links that are in multiple pieces because of errors on formatting:
        i -= 1;
        off = attrs[i];
        url = txt.getLinkUrl(off);
      }
      pOut = pOut.substring(0, off) + '[' + pOut.substring(off, lastOff) + '](' + url + ')' + pOut.substring(lastOff);
    } else if (font) {
      if (!inSrc && font === font.COURIER_NEW) {
        while (i >= 1 && txt.getFontFamily(attrs[i - 1]) && txt.getFontFamily(attrs[i - 1]) === font.COURIER_NEW) {
          // detect fonts that are in multiple pieces because of errors on formatting:
          i -= 1;
          off = attrs[i];
        }
        pOut = pOut.substring(0, off) + '`' + pOut.substring(off, lastOff) + '`' + pOut.substring(lastOff);
      }
    }
    if (txt.isBold(off)) {
      var d1 = "**";
      var d2 = "**";
      if (txt.isItalic(off)) {
        // edbacher: changed this to handle bold italic properly.
        d1 = "**_";
        d2 = "_**";
      }
      pOut = pOut.substring(0, off) + d1 + pOut.substring(off, lastOff) + d2 + pOut.substring(lastOff);
    } else if (txt.isItalic(off)) {
      pOut = pOut.substring(0, off) + '*' + pOut.substring(off, lastOff) + '*' + pOut.substring(lastOff);
    }
    lastOff = off;
  }
  return pOut;
}

function toMarkdown(folderId, path) {
  var now = Date.now();
  var docId = getDocId(folderId, path);
  dbg('loading doc %s', docId);
  var doc = DocumentApp.openById(docId);
  var body = doc.getBody();

  var result = "";
  var listNumbering = {};

  var elements = body.getNumChildren();
  for (var i = 0; i < elements; i++) {
    var el = body.getChild(i);

    /* paragraphs */
    if (el.getType() === DocumentApp.ElementType.PARAGRAPH) {
      var par = el.asParagraph();
      var md = "";
      var hpf = "";

        switch (par.getHeading()) {
          case DocumentApp.ParagraphHeading.HEADING5: hpf+="#";
          case DocumentApp.ParagraphHeading.HEADING4: hpf+="#";
          case DocumentApp.ParagraphHeading.HEADING3: hpf+="#";
          case DocumentApp.ParagraphHeading.HEADING2: hpf+="#";
          case DocumentApp.ParagraphHeading.HEADING1: hpf+="#";
          default:
            if (hpf) {
              var text=par.getText();
              if (text) md=hpf+" "+text;
            } else {
              md=processText(false, el.asText())+"\n";
            }
        }

      var numParChildren = el.getNumChildren();
      for (var j = 0; j < numParChildren; j++) {
        var pc = el.getChild(j);
        /* horizonal rule */
        if (pc.getType() === DocumentApp.ElementType.HORIZONTAL_RULE) {
          md += "\n---\n";
        }

        /* inline image */
        if (pc.getType() === DocumentApp.ElementType.INLINE_IMAGE) {
          md += saveInlineImage(pc.asInlineImage());
        }
      }
      result += md + "\n";
    }

    /* lists */
    if (el.getType() === DocumentApp.ElementType.LIST_ITEM) {
      var prefix = "";
      var nesting = el.getNestingLevel();
      for (var j = 0; j < nesting; j++) {
        prefix += "    ";
      }

      var gt = el.getGlyphType();

      // unordered
      if (gt === DocumentApp.GlyphType.BULLET
        || gt === DocumentApp.GlyphType.HOLLOW_BULLET
        || gt === DocumentApp.GlyphType.SQUARE_BULLET) {
        prefix += "* ";

      } else {

        // ordered
        var key = el.getListId() + '.' + el.getNestingLevel();
        var counter = listNumbering[key] || 0;
        counter++;
        listNumbering[key] = counter;
        prefix += counter + ". ";
      }
      result += prefix += processText(false, el.asText()) + "\n";
    }
  }
  inf('length=%d, time=%d', result.length, Date.now() - now);
  return result;
}

