var inf;
var err;
var dbg;
var wrn;

function initLogger(ctx) {

  function myLog(fn, msg) {
    var args = Array.prototype.slice.call(arguments, 1);
    args[0] = msg;
    var params = Object.assign({}, ctx, {
      message: args.length === 1 ? msg : Utilities.formatString.apply(null, args)
    });
    fn.call(this, params);
    Logger.log(params.message);
  }
  dbg = myLog.bind(console, console.log);
  inf = myLog.bind(console, console.info);
  wrn = myLog.bind(console, console.warn);
  err = myLog.bind(console, console.error);
}
initLogger({});

function toHexString(a) {
  return a.map(function(chr){return (chr+256).toString(16).slice(-2)})
  .join('');
}

function getFile(parentId, name, isFolder) {
  // note, in the v2 API, the filename is called 'title' and the list is called 'items',
  //   but in the v3 API, the filename is called 'name'  and the list is called 'files'.
  var query = ''
      + '"' + parentId + '" in parents'
      + ' and title = ' + JSON.stringify(name)
      + ' and trashed=false'
      + ' and mimeType' + (isFolder ? '=' : '!=') + '"application/vnd.google-apps.folder"';
  Logger.log(query);
  var list = Drive.Files.list({
      q: query,
      fields: 'items(id, title)',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
  });
  return list.items.length > 0 ? list.items[0] : null;
}

function _test() {
  // var docId = getFile('1I_FwT5qXkZTevAeZ9EqUqLaS0RbLFkI2', 'welcome', false);
  var docId = getDocId('1I_FwT5qXkZTevAeZ9EqUqLaS0RbLFkI2', '/docs/index');
  Logger.log('docid=%s', JSON.stringify(docId, null, 2));
}

function getDocId(folderId, path) {
  // try to lookup path from cache
  var cache = CacheService.getScriptCache();
  var cacheKey = folderId + path;
  var id = cache.get(cacheKey);
  if (id) {
    Logger.log('path=%s docid=%s (cached)', path, id);
    return id;
  }
  
  // search id in drive
  var segments = path.split("/");
  for (var i=0; i < segments.length - 1; i++) {
    var seg = segments[i];
    if (!seg) {
      continue;
    }
    var folder=getFile(folderId, seg, true);
    if (!folder) {
      throw error("Not Found: "+path, 404);
    }
    folderId = folder.id;
  }
  var file=getFile(folderId, segments[segments.length-1], false);
  if (!file) {
      throw error("Not Found: "+path, 404);
  }
  var id=file.id;
  
  // save id in cache
  cache.put(cacheKey, id);
  Logger.log('path=%s docid=%s', path, id);
  return id;
}
