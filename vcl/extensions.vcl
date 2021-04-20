#
# Copyright 2019 Adobe. All rights reserved.
# This file is licensed to you under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License. You may obtain a copy
# of the License at http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed under
# the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
# OF ANY KIND, either express or implied. See the License for the specific language
# governing permissions and limitations under the License.
#

sub hlx_type_pipeline_before {
    # A non-production XFH header looks like: "repo--user.hlx.page"
    # If you have an outer CDN, then it looks like "www.mydomain.com, repo--user.hlx.page"
    # The filter below tests if you have no outer CDN and turns on the development mode
    # caching (i.e. disables caching in helix-dispatch)
    # if (regsuball(regsuball(req.http.x-forwarded-host, "[^,]*(\.hlx(-[0-9]+)?\.page|\.project\-helix\.page|\.fastlydemo\.net)", ""), "[, ]", "") == "") {
    #    set req.http.X-Dispatch-NoCache = "true";
    #}

    # for now, we disable all caching in dispatch.
    set req.http.X-Dispatch-NoCache = "true";

    if (req.url.ext ~ "^html$") {
        # do not cache HTML at all
        set req.http.X-Dispatch-Pass = "1";
    }
}

sub hlx_type_pipeline_after {}

# try to extract X-Owner, X-Repo, X-Ref from subdomain
# supported patterns are:
# - https://<repo>-<owner>.host.com (if owner does not contain a dash)
# - https://<repo>--<owner>.host.com
# - https://<branch>--<repo>--<owner>.host.com

sub hlx_owner_before {}
sub hlx_owner_after {
    declare local var.o STRING;

    # compute a potential owner in the subdomain
    # first, try 2x -- pattern (include branch)
    set var.o = if(req.http.host ~ "(.*)--(.*)--(.*)\..*\..*$", re.group.3, "");

    if (var.o == "") {
        # second, try single -- pattern
        set var.o = if(req.http.host ~ "(.*)--(.*)\..*\..*$", re.group.2, "");
    }

    if (var.o == "") {
        # third, try - pattern
        set var.o = if(req.http.host ~ "(.*)-(.*)\..*\..*$", re.group.2, "");
    }

    if (var.o != "") {
        // override X-Owner
        set req.http.X-Owner = var.o;
        set req.http.X-URL-Override = true;
    }
}

sub hlx_repo_before {}
sub hlx_repo_after {
    declare local var.o STRING;
    declare local var.r STRING;

    # compute a potential repo in the subdomain
    # first, try 2x -- pattern (include branch)
    set var.o = if(req.http.host ~ "(.*)--(.*)--(.*)\..*\..*$", re.group.3, "");
    set var.r = re.group.2;

    if (var.o == "") {
        # first, try single -- pattern
        set var.o = if(req.http.host ~ "(.*)--(.*)\..*\..*$", re.group.2, "");
        set var.r = re.group.1;
    }

    if (var.o == "") {
        # second, try - pattern
        set var.o = if(req.http.host ~ "(.*)-(.*)\..*\..*$", re.group.2, "");
        set var.r = re.group.1;
    }

    if (var.r != "") {
        # override X-Repo
        set req.http.X-Repo = var.r;
    }

    # restrict access by acl for specific repos
    # dictionary acl_restricted_repos (key: repo, value: acl)
    if (client.as.number != 54113) {
        # not a Fastly request
        if (req.method != "FASTLYPURGE") {
            # PURGE is sent from helix-purge service, don't apply acl filter
            # (PURGE method appears in VCL as FASTLYPURGE)
            if (table.lookup(acl_restricted_repos, req.http.X-Repo) == "adobe_ips") {
                # restrict by acl unless the client has a token (validity to be confirmed downstream)
                if (!req.http.fastly-ff && client.ip !~ adobe_ips && !req.http.x-github-token) {
                    error 401 "Unauthorized";
                }
            }
        }
    }
    # private github repository support 
    # write-only dictionary repo_github_token (key: repo, value: github token)
    # we load the token after the ACL check, so that you cannot access acl-restricted
    # private repos without being either in the ACL or having the token
    if (!req.http.x-github-token && table.contains(repo_github_token, req.http.X-Repo)) {
        set req.http.x-github-token = table.lookup(repo_github_token, req.http.X-Repo);
    }
}

sub hlx_ref_before {}
sub hlx_ref_after {
    declare local var.ref STRING;
    # compute a potential ref in the subdomain
    # try -- pattern (only case that includes branch)
    set var.ref = if(req.http.host ~ "(.*)--(.*)--(.*)\..*\..*$", re.group.1, "");

    if (var.ref != "") {
        # override X-Ref
        set req.http.X-Ref= var.ref;
    } else {
        if (req.http.X-URL-Override) {
            # default branch to master if there is a url override but no branch provided
            set req.http.X-Ref = "master";
        }
    }
    unset req.http.X-URL-Override;
}
