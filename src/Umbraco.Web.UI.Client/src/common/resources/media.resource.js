/**
    * @ngdoc service 
    * @name umbraco.resources.treeResource     
    * @description Loads in data for trees
    **/
function mediaResource($q, $http, umbDataFormatter, umbRequestHelper) {

    /** internal method to get the api url */
    function getMediaUrl(contentId) {
        return Umbraco.Sys.ServerVariables.mediaApiBaseUrl + "GetById?id=" + contentId;
    }
    
    /** internal method to get the api url */
    function getEmptyMediaUrl(contentTypeAlias, parentId) {
        return Umbraco.Sys.ServerVariables.mediaApiBaseUrl + "GetEmpty?contentTypeAlias=" + contentTypeAlias + "&parentId=" + parentId;
    }

    /** internal method to get the api url */
    function getRootMediaUrl() {
        return Umbraco.Sys.ServerVariables.mediaApiBaseUrl + "GetRootMedia";
    }

    /** internal method to get the api url */
    function getChildrenMediaUrl(parentId) {
        return Umbraco.Sys.ServerVariables.mediaApiBaseUrl + "GetChildren?parentId=" + parentId;
    }

    /** internal method to get the api url for publishing */
    function getSaveUrl() {
        return Umbraco.Sys.ServerVariables.mediaApiBaseUrl + "PostSave";
    }
    
    /** internal method process the saving of data and post processing the result */
    function saveMediaItem(content, action, files) {
        return umbRequestHelper.postSaveContent(getSaveUrl(content.id), content, action, files);
    }

    return {
        getById: function (id) {

            var deferred = $q.defer();

            //go and get the data
            $http.get(getMediaUrl(id)).
                success(function (data, status, headers, config) {
                    //set the first tab to active
                    _.each(data.tabs, function (item) {
                        item.active = false;
                    });
                    if (data.tabs.length > 0) {
                        data.tabs[0].active = true;
                    }

                    deferred.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject('Failed to retreive data for media id ' + id);
                });

            return deferred.promise;
        },

        /** returns an empty content object which can be persistent on the content service
            requires the parent id and the alias of the content type to base the scaffold on */
        getScaffold: function (parentId, alias) {

            var deferred = $q.defer();

            //go and get the data
            $http.get(getEmptyMediaUrl(alias, parentId)).
                success(function (data, status, headers, config) {
                    //set the first tab to active
                    _.each(data.tabs, function (item) {
                        item.active = false;
                    });
                    if (data.tabs.length > 0) {
                        data.tabs[0].active = true;
                    }

                    deferred.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject('Failed to retreive data for empty content item type ' + alias);
                });

            return deferred.promise;
        },

        rootMedia: function () {

            var deferred = $q.defer();

            //go and get the tree data
            $http.get(getRootMediaUrl()).
                success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject('Failed to retreive data for application tree ' + section);
                });

            return deferred.promise;
        },

        getChildren: function (parentId) {

            var deferred = $q.defer();

            //go and get the tree data
            $http.get(getChildrenMediaUrl(parentId)).
                success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject('Failed to retreive data for application tree ' + section);
                });

            return deferred.promise;
        },
        
        /** saves or updates a media object */
        saveMedia: function (media, isNew, files) {
            return saveMediaItem(media, "save" + (isNew ? "New" : ""), files);
        }
    };
}

angular.module('umbraco.resources').factory('mediaResource', mediaResource);