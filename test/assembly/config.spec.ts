import { GlobalConfig } from "../../assembly/global-config";
import { MountPointMatch } from "../../assembly/mount-config";

describe("config", () => {
  it("config can be constructed", () => {
    const config = new GlobalConfig('{"fstab": {' + 
      '"mountpoints": {' + 
        '"/ms/docs": "https://adobe.sharepoint.com/sites/docs?fallbackPath=default.docx",' + 
        '"/ms": "https://adobe.sharepoint.com/sites/TheBlog/Shared%20Documents/theblog",' + 
        '"/gd": {' + 
          '"url": "https://drive.google.com/drive/u/0/folders/123456789",' + 
          '"fallbackPath": "default.md"' + 
        '},' + 
        '"/mswithid": "onedrive:/drives/1234/items/5678",' + 
        '"/foo/": "https://localhost:4502",' + 
        '"/google-index.md": "gdrive:complexitemid",' + 
        '"/onedrive-index.md": "https://adobe.sharepoint.com/sites/TheBlog/Shared%20Documents/theblog/homepage.docx",' + 
        '"/gd-no-account": "https://drive.google.com/drive/folders/3453k4j3l4kjlk",' + 
        '"/gd-with-query": "https://drive.google.com/drive/folders/99f999f99f9fff?ups=sharing",' + 
        '"/github-simple": "https://github.com/adobe/helix-shared",' + 
        '"/github-path": "https://github.com/adobe/helix-shared/tree/main/src",' + 
        '"/github-branch": "https://github.com/adobe/helix-shared/tree/downloader",' + 
        '"/creds": {' + 
          '"credentials": [' + 
            '"abcd"' + 
          '],' + 
          '"url": "https://adobe.sharepoint.com/sites/TheBlog/Shared%20Documents/theblog"' + 
        '},' + 
        '"/multicreds": {' + 
          '"credentials": [' + 
            '"abcd",' + 
            '"efgh"' + 
          '],' + 
          '"url": "https://adobe.sharepoint.com/sites/TheBlog/Shared%20Documents/theblog"' + 
        '}' + 
      '}' + 
    '}}');
    expect<string>((<MountPointMatch>config.fstab.match('/ms/docs')).url).toBe("https://adobe.sharepoint.com/sites/docs?fallbackPath=default.docx");
    expect<string>((<MountPointMatch>config.fstab.match('/ms')).url).toBe("https://adobe.sharepoint.com/sites/TheBlog/Shared%20Documents/theblog");
    expect<string>((<MountPointMatch>config.fstab.match('/ms/')).url).toBe("https://adobe.sharepoint.com/sites/TheBlog/Shared%20Documents/theblog");
    expect<string>((<MountPointMatch>config.fstab.match('/ms/some/where/deep/in/the/woods')).url).toBe("https://adobe.sharepoint.com/sites/TheBlog/Shared%20Documents/theblog");
    expect<string>((<MountPointMatch>config.fstab.match('/ms/some/where/deep/in/the/woods')).relpath).toBe("/some/where/deep/in/the/woods");
    expect<string>((<MountPointMatch>config.fstab.match('/ms/some/where/deep/in/the/woods')).hash).toBe("h39b08ed882cc3217ceb23a3e71d769dbe47576312869465a0a302ed29c6d7");
  });

  it("config can be constructed when fstab is missing", () => {
    const config = new GlobalConfig('{"no-fstab": {' + 
      '"mountpoints": {' + 
        '"/ms/docs": "https://adobe.sharepoint.com/sites/docs?fallbackPath=default.docx",' + 
        '"/ms": "https://adobe.sharepoint.com/sites/TheBlog/Shared%20Documents/theblog",' + 
        '"/gd": {' + 
          '"url": "https://drive.google.com/drive/u/0/folders/123456789",' + 
          '"fallbackPath": "default.md"' + 
        '},' + 
        '"/mswithid": "onedrive:/drives/1234/items/5678",' + 
        '"/foo/": "https://localhost:4502",' + 
        '"/google-index.md": "gdrive:complexitemid",' + 
        '"/onedrive-index.md": "https://adobe.sharepoint.com/sites/TheBlog/Shared%20Documents/theblog/homepage.docx",' + 
        '"/gd-no-account": "https://drive.google.com/drive/folders/3453k4j3l4kjlk",' + 
        '"/gd-with-query": "https://drive.google.com/drive/folders/99f999f99f9fff?ups=sharing",' + 
        '"/github-simple": "https://github.com/adobe/helix-shared",' + 
        '"/github-path": "https://github.com/adobe/helix-shared/tree/main/src",' + 
        '"/github-branch": "https://github.com/adobe/helix-shared/tree/downloader",' + 
        '"/creds": {' + 
          '"credentials": [' + 
            '"abcd"' + 
          '],' + 
          '"url": "https://adobe.sharepoint.com/sites/TheBlog/Shared%20Documents/theblog"' + 
        '},' + 
        '"/multicreds": {' + 
          '"credentials": [' + 
            '"abcd",' + 
            '"efgh"' + 
          '],' + 
          '"url": "https://adobe.sharepoint.com/sites/TheBlog/Shared%20Documents/theblog"' + 
        '}' + 
      '}' + 
    '}}');
    expect<i32>(config.fstab.length).toBe(0);
  });
});