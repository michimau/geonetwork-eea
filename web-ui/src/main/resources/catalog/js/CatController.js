/*
 * Copyright (C) 2001-2016 Food and Agriculture Organization of the
 * United Nations (FAO-UN), United Nations World Food Programme (WFP)
 * and United Nations Environment Programme (UNEP)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or (at
 * your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
 *
 * Contact: Jeroen Ticheler - FAO - Viale delle Terme di Caracalla 2,
 * Rome - Italy. email: geonetwork@osgeo.org
 */

(function() {
  goog.provide('gn_cat_controller');







goog.require('gn_admin_menu');
goog.require('gn_external_viewer');
goog.require('gn_history');
goog.require('gn_saved_selections');
goog.require('gn_search_manager');
goog.require('gn_session_service');
goog.require('gn_alert');


  // On the editor catalog, search are restricted on this catalog
  // only to not mix all records harvested (from internal for example)
  // which are used to be linked to draft records (eg. has sources)
  var editorCatalogId = 'd1bd08f0-16ac-47c3-b581-2e8db715530c';
  // var editorCatalogId = 'd1bd08f0-16ac-47c3-b581-2e8db715530b';
  // var editorCatalogPath = '/geonetwork';
  var editorCatalogPath = '/editor-catalogue';
  // Also update in EditorBoardController.js
  // Also update in module.js


  var module = angular.module('gn_cat_controller',
      ['gn_search_manager', 'gn_session_service',
        'gn_admin_menu', 'gn_saved_selections',
        'gn_external_viewer', 'gn_history', 'gn_alert']);


  module.constant('gnSearchSettings', {});
  module.constant('gnViewerSettings', {});
  module.constant('gnGlobalSettings', function() {
    var defaultConfig = {
      'langDetector': {
        'fromHtmlTag': false,
        'regexp': '^(?:\/.+)?/.+\/([a-z]{2,3})\/.+',
        'default': 'eng'
      },
      'nodeDetector': {
        'regexp': '^(?:\/.+)?\/(.+)\/[a-z]{2,3}\/.+',
        'default': 'srv'
      },
      'serviceDetector': {
        'regexp': '^(?:\/.+)?\/.+\/[a-z]{2,3}\/(.+)',
        'default': 'catalog.search'
      },
      'baseURLDetector': {
        'regexp': '^((?:\/.+)?)+\/.+\/[a-z]{2,3}\/.+',
        'default': '/geonetwork'
      },
      'mods': {
        'global': {
          'humanizeDates': true,
          'dateFormat': 'DD-MM-YYYY',
          // 'timezone': 'Australia/Hobart',
          'timezone': 'Europe/Copenhagen',
          'eeaGeoServer': 'https://sdi.eea.europa.eu/geoserver/ows',
          'eeaNextCloudServer': 'https://galliwasp.eea.europa.eu/data/'
        },
        'footer':{
          'enabled': true,
          'showSocialBarInFooter': true,
          'showApplicationInfoAndLinksInFooter': true
        },
        'header': {
          'enabled': true,
          'languages': {
            'eng': 'en'
          },
          'isLogoInHeader': false,
          'logoInHeaderPosition': 'left',
          'fluidHeaderLayout': true,
          'showGNName': true,
          'isHeaderFixed': false,
          'isMenubarAccessible': true,
          'showPortalSwitcher': true
        },
        'cookieWarning': {
          'enabled': true,
          'cookieWarningMoreInfoLink': '',
          'cookieWarningRejectLink': ''
        },
        'home': {
          'enabled': true,
          'appUrl': '../../{{node}}/{{lang}}/catalog.search#/home',
          'showSocialBarInFooter': true,
          'showMaps': false,
          'showMosaic': false,
          'facetConfig': {
            'th_httpinspireeceuropaeutheme-theme_tree.key': {
              'terms': {
                'field': 'th_httpinspireeceuropaeutheme-theme_tree.key',
                'size': 34
                // "order" : { "_key" : "asc" }
              }
            },
            'th_eea-topics.default': {
              'terms': {
                'field': 'th_eea-topics.default',
                'size': 15,
                'missing': '- Not categorized -',
                'exclude': 'http.*',
                "order" : { "_key" : "asc" }
              }
            },
            // 'OrgForResource': {
            //   'terms': {
            //     'field': 'OrgForResource',
            //     'include': '.*',
            //     'missing': '- No org -',
            //     'size': 15
            //   }
            // },
            'resourceType': {
              'terms': {
                "field": "resourceType",
                "include": "dataset|series|service|nonGeographicDataset"
              }
            }
          },
          'fluidLayout': true
        },
        'search': {
          'enabled': true,
          'appUrl': '../../{{node}}/{{lang}}/catalog.search#/search',
          'hitsperpageValues': [30, 60, 120],
          'paginationInfo': {
            'hitsPerPage': 30
          },
          // Full text on all fields
          // 'queryBase': '${any}',
          // Full text but more boost on title match
          // * Search in languages depending on the strategy selected
          'queryBase': 'any.${searchLang}:(${any}) OR any.common:(${any}) OR resourceTitleObject.${searchLang}:(${any})^2 OR resourceTitleObject.\\*:\"${any}\"^6',
          'queryBaseOptions': {
            'default_operator': 'AND'
          },
          // TODO: Exact match should not even analyze
          // so we could create an exact field not analyzed in the index maybe?
          'queryExactMatch': 'any.${searchLang}:\"${any})\" OR any.common:\"${any}\" OR resourceTitleObject.\\*:\"${any}\"^2',
          // * Force UI language - in this case set languageStrategy to searchInUILanguage
          // and disable language options in searchOptions
          // 'queryBase': 'any.${uiLang}:(${any}) any.common:(${any}) resourceTitleObject.${uiLang}:(${any})^2',
          // * Search in French fields (with french analysis)
          // 'queryBase': 'any.langfre:(${any}) any.common:(${any}) resourceTitleObject.langfre:(${any})^2',
          'queryTitle': 'resourceTitleObject.\\*:(${any})',
          'queryTitleExactMatch': 'resourceTitleObject.\\*:"${any}"',
          'searchOptions': {
            titleOnly: true,
            exactMatch: true,
            language: false
          },
          // Language strategy can be:
          // * searchInUILanguage: search in UI languages
          // eg. full text field is any.langfre if French
          // * searchInAllLanguages: search using any.* fields
          // (no analysis is done, more records are returned)
          // * searchInDetectedLanguage: restrict the search to the language detected
          // based on user search. If language detection fails, search in all languages.
          // * searchInThatLanguage: Force a language using searchInThatLanguage:fre
          // 'languageStrategy': 'searchInThatLanguage:fre',
          'languageStrategy': 'searchInAllLanguages',
          // Limit language detection to some languages only.
          // If empty, the list of languages in catalogue records is used
          // and if none found, mods.header.languages is used.
          'languageWhitelist': ['eng'],
          // Score query may depend on where we are in the app?
          'scoreConfig': {
            // Score experiments:
            // a)Score down old records
            // {
            //   "gauss": {
            //     "dateStamp": {
            //       "scale":  "200d"
            //     }
            //   }
            // }
            // b)Promote grids!
            // "boost": "5",
            // "functions": [
            //   {
            //     "filter": { "match": { "cl_spatialRepresentationType.key": "vector" } },
            //     "random_score": {},
            //     "weight": 23
            //   },
            //   {
            //     "filter": { "match": { "cl_spatialRepresentationType.key": "grid" } },
            //     "weight": 42
            //   }
            // ],
            // "max_boost": 42,
            // "score_mode": "max",
            // "boost_mode": "multiply",
            // "min_score" : 42
            // "script_score" : {
            //   "script" : {
            //     "source": "_score"
            //     // "source": "Math.log(2 + doc['rating'].value)"
            //   }
            // }
            "boost": "5",
            "functions": [
              // Boost down member of a series
              {
                "filter": { "exists": { "field": "parentUuid" } },
                "weight": 0.3
              },
              // Boost down obsolete and superseded records
              {
                "filter": { "match": { "cl_status.key": "obsolete" } },
                "weight": 0.2
              },
              {
                "filter": { "match": { "cl_status.key": "superseded" } },
                "weight": 0.3
              },
              // {
              //   "filter": { "match": { "cl_resourceScope": "service" } },
              //   "weight": 0.8
              // },
              // Start boosting down records more than 3 months old
              {
                "gauss": {
                  "dateStamp": {
                    "scale":  "365d",
                    "offset": "90d",
                    "decay": 0.5
                  }
                }
              }
            ],
            "score_mode": "multiply"
          },
          'autocompleteConfig': {
            'query': {
              'bool': {
                'must': [{
                  'multi_match': {
                    "query": "",
                    "type": "bool_prefix",
                    "fields": [
                      "resourceTitleObject.${searchLang}^6",
                      "resourceAbstractObject.${searchLang}^.5",
                      "tag",
                      "resourceIdentifier"
                      // "anytext",
                      // "anytext._2gram",
                      // "anytext._3gram"
                    ]
                  }
                }]
              }
            },
            '_source': ['resourceTitleObject'],
            // Fuzzy autocomplete
            // {
            //   query: {
            //     // match_phrase_prefix: match
            //     "multi_match" : {
            //       "query" : query,
            //         // "type":       "phrase_prefix",
            //         "fields" : [ field + "^3", "tag" ]
            //     }
            //   },
            //   _source: [field]
            // }
            "from": 0,
            "size": 20
          },
          'moreLikeThisSameType': true,
          'moreLikeThisConfig': {
            "more_like_this" : {
              "fields" : [
                "resourceTitleObject.langeng"
                // "resourceAbstractObject.default",
                // "tag.raw"
              ],
              "like" : null,
              "min_term_freq" : 1,
              "min_word_length" : 3,
              "max_query_terms" : 35,
              "analyzer": "english",
              "minimum_should_match": "70%"
            }
          },
          'facetTabField': '',
          // Enable vega only if using vega facet type
          // See https://github.com/geonetwork/core-geonetwork/pull/5349
          'isVegaEnabled': true,
          'facetConfig': {
            'resourceType': {
              'terms': {
                "field": "resourceType",
                "include": "dataset|series|service|nonGeographicDataset"
              },
              'aggs': {
                'format': {
                  'terms': {
                    'field': 'format'
                  }
                }
              }
            },
            'th_eea-topics.default': {
              'terms': {
                'field': 'th_eea-topics.default',
                'size': 15,
                'missing': '- Not categorized -',
                'exclude': 'http.*',
                "order" : { "_key" : "asc" }
              }
            },
            'th_gemet_tree.default': {
              'terms': {
                'field': 'th_gemet_tree.default',
                'size': 500,
                "order" : { "_key" : "asc" },
                "include": "[^\^]+^?[^\^]+"
                // Limit to 2 levels
              },
              'meta': {
                'collapsed': true
              }
            },
            'th_httpinspireeceuropaeumetadatacodelistPriorityDataset-PriorityDataset_tree.default': {
              'terms': {
                'field': 'th_httpinspireeceuropaeumetadatacodelistPriorityDataset-PriorityDataset_tree.default',
                'size': 100,
                "order" : { "_key" : "asc" }
              },
              'meta': {
                'collapsed': true
              }
            },
            'th_httpinspireeceuropaeutheme-theme_tree.key': {
              'terms': {
                'field': 'th_httpinspireeceuropaeutheme-theme_tree.key',
                'size': 34
                // "order" : { "_key" : "asc" }
              }
            },
            'tag.default': {
              'terms': {
                'field': 'tag.default',
                'include': '.*',
                'size': 10
              },
              'meta': {
                'userHasRole': 'isAdministratorOrMore',
                'collapsed': true,
                'caseInsensitiveInclude': true
              }
            },
            'cat': {
              'terms': {
                'field': 'cat.keyword',
                'size': 10
              },
              'meta': {
                'userHasRole': 'isAdministratorOrMore',
                'collapsed': true
              }
            },
            'OrgForResource': {
              'terms': {
                'field': 'OrgForResource',
                'include': '.*',
                'size': 15
              },
              'meta': {
                'caseInsensitiveInclude': true
              }
            },
            // "serviceType": {
            //   "terms": {
            //     "field": "serviceType",
            //     "size": 10
            //   }
            // },
            "creationYearForResource": {
              "histogram": {
                "field": "creationYearForResource",
                "interval": 5,
                "keyed" : true,
                'min_doc_count': 1
              },
              'meta': {
                'collapsed': true
              }
            },
            'cl_spatialRepresentationType.default': {
              'terms': {
                'field': 'cl_spatialRepresentationType.default',
                'size': 10
              }
            },
            'cl_maintenanceAndUpdateFrequency.default': {
              'terms': {
                'field': 'cl_maintenanceAndUpdateFrequency.default',
                'size': 10
              },
              'meta': {
                'collapsed': true
              }
            },
            'cl_status.key': {
              'terms': {
                'field': 'cl_status.key',
                'size': 10
              }
            },
            // 'resolutionScaleDenominator': {
            //   'terms': {
            //     'field': 'resolutionScaleDenominator',
            //     'size': 10,
            //     'order': {'_key': "asc"}
            //   }
            // },
            "resolutionScaleDenominator": {
              "histogram": {
                "field": "resolutionScaleDenominator",
                "interval": 100000,
                "keyed" : true,
                "min_doc_count": 1
              },
              'meta': {
                'collapsed': true
              }
            },
            "resolutionDistance": {
              "terms": {
                "field": "resolutionDistance",
                "include": ".* (m|km)"
              },
              'meta': {
                'collapsed': true
              }
            },
            'th_regions_tree.default': {
              'terms': {
                'field': 'th_regions_tree.default',
                'size': 400,
                "order" : { "_key" : "asc" },
                "include": "Europe.*|EEA.*|EU.*"
              },
              'meta': {
                'collapsed': true
              }
            },
            // Don't forget to enable Vega to use interactive graphic facets.
            // See isVegaEnabled property.
            // 'cl_status.key': {
            //   'terms': {
            //     'field': 'cl_status.key',
            //     'size': 10
            //   },
            //   'meta': {
            //     // 'vega': 'bar'
            //     'vega': 'arc'
            //   }
            // },
            //
            'resourceTemporalDateRange': {
              'gnBuildFilterForRange': {
                field: "resourceTemporalDateRange",
                buckets: 2021 - 1970,
                dateFormat: 'YYYY',
                dateSelectMode: 'years',
                vegaDateFormat: '%Y',
                from: 1970,
                to: 2021,
                mark: 'area'
              },
              'meta': {
                'vega': 'timeline'
              }
            }
            // 'dateStamp' : {
            //   'auto_date_histogram' : {
            //     'field' : 'dateStamp',
            //     'buckets': 50
            //   },
            //   "meta": {
            //     'userHasRole': 'isReviewerOrMore',
            //     'collapsed': true
            //   }
          },
          'filters': null,
          // 'filters': [{
          //     "query_string": {
          //       "query": "-resourceType:service"
          //     }
          //   }],
          'sortbyValues': [{
            'sortBy': 'relevance',
            'sortOrder': ''
          }, {
            'sortBy': 'dateStamp',
            'sortOrder': 'desc'
          }, {
            'sortBy': 'createDate',
            'sortOrder': 'desc'
          }, {
            'sortBy': 'resourceTitleObject.default.keyword',
            'sortOrder': ''
          }, {
            'sortBy': 'rating',
            'sortOrder': 'desc'
          }, {
            'sortBy': 'popularity',
            'sortOrder': 'desc'
          }],
          'sortBy': 'relevance',
          'resultViewTpls': [{
            'tplUrl': '../../catalog/components/' +
                'search/resultsview/partials/viewtemplates/grid.html',
            'tooltip': 'Grid',
            'icon': 'fa-th'
          },{
            'tplUrl': '../../catalog/components/' +
              'search/resultsview/partials/viewtemplates/list.html',
            'tooltip': 'List',
            'icon': 'fa-bars'
          },{
            'tplUrl': '../../catalog/components/' +
              'search/resultsview/partials/viewtemplates/table.html',
            'tooltip': 'Table',
            'icon': 'fa-table'
          }],
          'resultTemplate': '../../catalog/components/' +
              'search/resultsview/partials/viewtemplates/grid.html',
          'searchResultContact': 'pointOfContactOrgForResource',
          'formatter': {
            'list': [{
              'label': 'defaultView',
              // Conditional views can be used to configure custom
              // formatter to use depending on metadata properties.
              // 'views': [{
              //   'if': {'standardName': 'ISO 19115-3 - Emodnet Checkpoint - Targeted Data Product'},
              //   'url' : '/formatters/xsl-view?root=div&view=advanced'
              // }, {
              //   'if': {
              //     'standardName': [
              //       'ISO 19115:2003/19139 - EMODNET - BATHYMETRY',
              //       'ISO 19115:2003/19139 - EMODNET - HYDROGRAPHY']
              //   },
              //   'url' : '/formatters/xsl-view?root=div&view=emodnetHydrography'
              // }, {
              //   'if': {'documentStandard': 'iso19115-3.2018'},
              //   'url' : '/dada'
              // }],
              'url' : ''
            }, {
              'label': 'full',
              'url' : '/formatters/xsl-view?root=div&view=advanced'
            }]
          },
          'downloadFormatter': [{
            'label': 'exportMEF',
            'url': '/formatters/zip?withRelated=false',
            'class': 'fa-file-zip-o'
          }, {
            'label': 'exportPDF',
            'url' : '/formatters/xsl-view?output=pdf&language=${lang}',
            'class': 'fa-file-pdf-o'
          }, {
            'label': 'exportXML',
            // 'url' : '/formatters/xml?attachment=false',
            'url' : '/formatters/xml',
            'class': 'fa-file-code-o'
          }],
          'grid': {
            'related': ['parent', 'children', 'services', 'datasets']
          },
          'linkTypes': {
            'links': [
              'LINK'
            ],
            'downloads': [
              'WWW:DOWNLOAD',
              'WWW:OPENDAP',
              'WWW:FTP',
              'KML'
            ],
            // 'downloadServices': [
            //   'OGC:WFS',
            //   'OGC:WCS',
            //   'ATOM'
            // ],
            'layers': [
              'OGC:WMS',
              // 'OGC:WFS',
              'OGC:WMTS',
              'ESRI:REST'
            ],
            'maps': ['ows']
          },
          'isFilterTagsDisplayedInSearch': true,
          'showMapInFacet': false,
          'showStatusFooterFor': 'historicalArchive,obsolete,superseded',
          'showBatchDropdown': true,
          'usersearches': {
            'enabled': true,
            'includePortals': true,
            'displayFeaturedSearchesPanel': true
          },
          'savedSelection': {
            'enabled': false
          },
          "addWMSLayersToMap": {
            "urlLayerParam": ""
          }
        },
        'map': {
          'enabled': true,
          'appUrl': '../../{{node}}/{{lang}}/catalog.search#/map',
          'externalViewer': {
            'enabled': false,
            'enabledViewAction': false,
            'baseUrl': 'http://www.example.com/viewer',
            'urlTemplate': 'http://www.example.com/viewer?url=${service.url}&type=${service.type}&layer=${service.title}&lang=${iso2lang}&title=${md.defaultTitle}',
            'openNewWindow': false,
            'valuesSeparator': ','
          },
          'is3DModeAllowed': false,
          'isSaveMapInCatalogAllowed': true,
          'isExportMapAsImageEnabled': false,
          'storage': 'sessionStorage',
          'bingKey': '',
          'listOfServices': {
            'wms': [],
            'wmts': []
          },
          'projection': 'EPSG:3857',
          'projectionList': [{
            'code': 'urn:ogc:def:crs:EPSG:6.6:4326',
            'label': 'WGS84 (EPSG:4326)'
          }, {
            'code': 'EPSG:3857',
            'label': 'Google mercator (EPSG:3857)'
          }],
          'switcherProjectionList': [{
            'code': 'EPSG:3857',
            'label': 'Google mercator (EPSG:3857)'
          }, {
              "label": "ETRS89-extended / LAEA Europe",
              "code": "EPSG:3035",
              "extent": [
                -146473.1132416539,
                210594.55713179847,
                7824928.564455923,
                6928130.515709829
              ],
              "worldExtent": [
                -35.58,
                24.6,
                44.83,
                84.17
              ],
              "resolutions": [],
              "def": "+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
          }],
          'disabledTools': {
            'processes': false,
            'addLayers': false,
            'projectionSwitcher': false,
            'layers': false,
            'legend': false,
            'filter': false,
            'contexts': false,
            'print': false,
            'mInteraction': false,
            'graticule': false,
            'mousePosition': true,
            'syncAllLayers': false,
            'drawVector': false
          },
          'graticuleOgcService': {},
          'map-viewer': {
            'context': '../../map/config-viewer.xml',
            'extent': [0, 0, 0, 0],
            'layers': []
          },
          'map-search': {
            'context': '../../map/config-viewer.xml',
            'extent': [0, 0, 0, 0],
            'layers': []
          },
          'map-editor': {
            'context': '',
            'extent': [0, 0, 0, 0],
            'layers': [{'type': 'osm'}]
          },
          'map-thumbnail': {
            'context': '../../map/config-viewer.xml',
            'extent': [0, 0, 0, 0],
            'layers': []
          },
          'autoFitOnLayer': false
        },
        'geocoder': {
            'enabled': true,
            'appUrl': 'https://secure.geonames.org/searchJSON'
        },
        'recordview': {
          'isSocialbarEnabled': true,
          'showStatusWatermarkFor': '',
          // 'showStatusTopBarFor': 'historicalArchive,obsolete,superseded',
          'showStatusTopBarFor': '',
          'showCitation': {
            'enabled': true,
            'if': null // {'documentStandard': ['iso19115-3.2018']}
          },
          'sortKeywordsAlphabetically': true,
          'mainThesaurus': ['th_eea-topics', 'th_gemet', 'th_gemet-theme', 'th_httpinspireeceuropaeumetadatacodelistSpatialScope-SpatialScope'],
          'locationThesaurus': ['th_regions'],
          'internalThesaurus': ['th_eea-categories'],
          'collectionTableConfig': {
            'labels': 'title,cl_status,format,Download,Esri,View',
            'columns': 'resourceTitle,cl_status[0].key,format,link/name:Direct download.*,link/protocol:ESRI:.*,link/protocol:OGC:.*'
          },
          'distributionConfig': {
            // 'layout': 'tabset',
            'layout': '',
            'sections': [
              {'types': 'onlines', 'filter': 'protocol:WWW:URL|EEA.*', 'title': 'download'},
              {'types': 'onlines', 'filter': 'protocol:OGC:.*|ESRI:.*', 'title': 'Services'},
              {'types': 'onlines', 'filter': '-protocol:OGC:.*|ESRI:.*|EEA.*|WWW:URL', 'title': 'links'}
              // {'types': 'onlines', 'filter': 'function:legend', 'title': 'mapLegend'},
              // {'types': 'onlines', 'filter': 'function:featureCatalogue', 'title': 'featureCatalog'},
              // {'types': 'onlines', 'filter': 'function:dataQualityReport', 'title': 'quality'}
            ]
          },
          'relatedFacetConfig':  {
            'cl_status': {
              'terms': {
                'field': 'cl_status.default',
                "order" : { "_key" : "asc" }
              }
            },
            'cl_spatialRepresentationType': {
              'terms': {
                'field': 'cl_spatialRepresentationType.default',
                "order" : { "_key" : "asc" }
              }
            },
            'format': {
              'terms': {
                'field': 'format',
                "order" : { "_key" : "asc" }
              }
            }
          }
        },
        'editor': {
          'enabled': true,
          'appUrl': '../../{{node}}/{{lang}}/catalog.edit',
          'isUserRecordsOnly': false,
          'minUserProfileToCreateTemplate': 'Administrator',
          'isFilterTagsDisplayed': false,
          'fluidEditorLayout': true,
          'createPageTpl':
              '../../catalog/templates/editor/new-metadata-horizontal.html',
          'editorIndentType': '',
          'allowRemoteRecordLink': true,
          'facetConfig': {
            "draftOrFinalized": {
              "filters": {
                "filters": {
                  "eeadraft": {
                    "query_string": {
                      "query": "+groupOwner:1069862"
                    }
                  },
                  "final": {
                    "query_string": {
                      "query": "-groupOwner:1069862"
                    }
                  }
                }
              },
              "meta": {
                "collapsed": true,
                "userHasRole": "isEditorOrMore"
              }
            },
            "resourceType": {
              "terms": {
                "field": "resourceType",
                "include": "dataset|series|service|nonGeographicDataset"
              }
            },
            'mdStatus': {
              'terms': {
                'field': 'statusWorkflow',
                'size': 20
              },
              'meta': {
                'field': 'statusWorkflow'
              }
            },
            'cl_status.key': {
              'terms': {
                'field': 'cl_status.key',
                'size': 15
              }
            },
            'valid': {
              'terms': {
                'field': 'valid',
                'size': 10
              }
            },
            'valid_inspire': {
              'terms': {
                'field': 'valid_inspire',
                'size': 10
              },
              'meta': {
                'collapsed': true
              }
            },
            'sourceCatalogue': {
              'terms': {
                'field': 'sourceCatalogue',
                'size': 100,
                'include': '.*'
              },
              'meta': {
                'orderByTranslation': true,
                'filterByTranslation': true,
                'displayFilter': true,
                'collapsed': true
              }
            },
            'groupOwner': {
              'terms': {
                'field': 'groupOwner',
                'size': 200,
                'include': '.*'
              },
              'meta': {
                'orderByTranslation': true,
                'filterByTranslation': true,
                'displayFilter': true,
                'collapsed': true
              }
            },
            'recordOwner': {
              'terms': {
                'field': 'recordOwner',
                'size': 5,
                'include': '.*'
              },
              'meta': {
                'collapsed': true
              }
            },
            'isPublishedToAll': {
              'terms': {
                'field': 'isPublishedToAll',
                'size': 2
              }
            },
            'groupPublishedId': {
              'terms': {
                'field': 'groupPublishedId',
                'size': 200,
                'include': '.*'
              },
              'meta': {
                'orderByTranslation': true,
                'filterByTranslation': true,
                'displayFilter': true,
                'collapsed': true
              }
            },
            'documentStandard': {
              'terms': {
                'field': 'documentStandard',
                'size': 10
              },
              'meta': {
                'collapsed': true
              }
            },
            'isHarvested': {
              'terms': {
                'field': 'isHarvested',
                'size': 2
              },
              'meta': {
                'collapsed': true
              }
            },
            'isTemplate': {
              'terms': {
                'field': 'isTemplate',
                'size': 5
              },
              'meta': {
                'collapsed': true
              }
            }
          }
        },
        'directory': {
          'sortbyValues': [{
            'sortBy': 'relevance',
            'sortOrder': ''
          }, {
            'sortBy': 'dateStamp',
            'sortOrder': 'desc'
          }, {
            'sortBy': 'resourceTitleObject.default.keyword',
            'sortOrder': ''
          }, {
            'sortBy': 'recordOwner',
            'sortOrder': ''
          }, {
            'sortBy': 'valid',
            'sortOrder': 'desc'
          }],
          'sortBy': 'relevance',
          // Add some fuzziness when search on directory entries
          // but boost exact match.
          'queryBase': 'any.${searchLang}:(${any}) OR any.common:(${any}) OR resourceTitleObject.${searchLang}:"${any}"^10 OR resourceTitleObject.${searchLang}:(${any})^5 OR resourceTitleObject.${searchLang}:(${any}~2)'
        },
        'admin': {
          'enabled': true,
          'appUrl': '../../{{node}}/{{lang}}/admin.console',
          'facetConfig': {
            'availableInServices': {
              'filters': {
                //"other_bucket_key": "others",
                // But does not support to click on it
                'filters': {
                  'availableInViewService': {
                    'query_string': {
                      'query': '+linkProtocol:/OGC:WMS.*/'
                    }
                  },
                  'availableInDownloadService': {
                    'query_string': {
                      'query': '+linkProtocol:/OGC:WFS.*/'
                    }
                  }
                }
              }
            },
            'resourceType': {
              'terms': {
                'field': 'resourceType'
              },
              'meta': {
                'vega': 'arc'
              }
            },
            'tag.default': {
              'terms': {
                'field': 'tag.default',
                'size': 10
              },
              'meta': {
                'vega': 'arc'
              }
            },
            'indexingErrorMsg': {
              'terms': {
                'field': 'indexingErrorMsg',
                'size': 12
              }
            }
          }
        },
        'authentication': {
          'enabled': true,
          'signinUrl': '../../{{node}}/{{lang}}/catalog.signin',
          'signoutUrl': '../../signout'
        },
        'page': {
          'enabled': true,
          'appUrl': '../../{{node}}/{{lang}}/catalog.search#/page'
        },
        'workflowHelper': {
          'enabled': false,
          'workflowAssistApps': [
            {'appUrl': '', 'appLabelKey': ''}
          ]
        }
      }
    };

    return {
      proxyUrl: '',
      locale: {},
      isMapViewerEnabled: false,
      requireProxy: [],
      gnCfg: angular.copy(defaultConfig),
      gnUrl: '',
      docUrl: 'https://geonetwork-opensource.org/manuals/4.0.x/',
      //docUrl: '../../doc/',
      modelOptions: {
        updateOn: 'default blur',
        debounce: {
          default: 300,
          blur: 0
        }
      },
      stopKeyList: [
        'langDetector',
        'nodeDetector',
        'serviceDetector',
        'baseURLDetector',
        'languages',
        'languageWhitelist',
        'hitsperpageValues',
        'sortbyValues',
        'resultViewTpls',
        'formatter',
        'downloadFormatter',
        'related',
        'linkTypes',
        'usersearches',
        'savedSelection',
        'listOfServices',
        'showCitation',
        'externalViewer',
        'map-viewer',
        'map-search',
        'map-editor',
        'map-thumbnail',
        'projectionList',
        'switcherProjectionList',
        'cookieWarning',
        'facetConfig',
        'searchOptions',
        'graticuleOgcService',
        'geocoder',
        'disabledTools',
        'filters',
        'scoreConfig',
        'autocompleteConfig',
        'moreLikeThisConfig',
        'relatedFacetConfig',
        'mainThesaurus',
        'internalThesaurus',
        'locationThesaurus',
        'distributionConfig',
        'collectionTableConfig',
        'queryBaseOptions',
        'workflowAssistApps'
      ],
      current: null,
      isDisableLoginForm: false,
      isShowLoginAsLink: false,
      isUserProfileUpdateEnabled: true,
      isUserGroupUpdateEnabled: true,
      init: function(configOverlay, gnUrl, gnViewerSettings, gnSearchSettings) {
        this.applyConfig(configOverlay);
        this.setLegacyOption(gnViewerSettings, gnSearchSettings);
        this.gnUrl = gnUrl || '../';
        this.proxyUrl = this.gnUrl + '../proxy?url=';
      },
      setLegacyOption: function(gnViewerSettings, gnSearchSettings) {
        gnViewerSettings.mapConfig = this.gnCfg.mods.map;
        angular.extend(gnSearchSettings, this.gnCfg.mods.search);
        this.isMapViewerEnabled = this.gnCfg.mods.map.enabled;
        gnViewerSettings.bingKey = this.gnCfg.mods.map.bingKey;
        gnViewerSettings.defaultContext =
          gnViewerSettings.mapConfig['map-viewer'].context;
        gnViewerSettings.geocoder = this.gnCfg.mods.geocoder.appUrl || defaultConfig.mods.geocoder.appUrl;

        // Map protocols used to load layers/services in the map viewer
        gnSearchSettings.mapProtocols = {
          layers: [
            'OGC:WMS',
            'OGC:WMTS',
            'OGC:WMS-1.1.1-http-get-map',
            'OGC:WMS-1.3.0-http-get-map',
            'OGC:WFS',
            'ESRI:REST'
          ],
          services: [
            'OGC:WMS-1.3.0-http-get-capabilities',
            'OGC:WMS-1.1.1-http-get-capabilities',
            'OGC:WMTS-1.0.0-http-get-capabilities',
            'OGC:WFS-1.0.0-http-get-capabilities'
          ]
        };
      },
      getObjectKeysPaths: function(obj, stopKeyList, allLevels, prefix) {
        var keys = Object.keys(obj);
        var that = this;
        prefix = prefix ? prefix + '.' : '';
        return keys.reduce(function(result, key){
          if (angular.isObject(obj[key]) && Object.keys(obj[key]).length > 0 && (stopKeyList === undefined
            || (stopKeyList && stopKeyList.indexOf(key) === -1))) {
            if(allLevels) {
              result.push(prefix + key);
            }
            result = result.concat(that.getObjectKeysPaths(obj[key], stopKeyList, allLevels, prefix + key));
          } else {
            result.push(prefix + key);
          }
          return result;
        }, []);
      },
      deleteValueByPath: function(obj, path) {
        var i;
        path = path.split('.');
        for (i = 0; i < path.length - 1; i++)
          obj = obj[path[i]];

        delete obj[path[i]];
        return obj;
      },
      applyConfig: function(configOverlay, runAllChecks) {
        var pathToUpdate = this.getObjectKeysPaths(configOverlay, this.stopKeyList, false);
        for(var i = 0; i < pathToUpdate.length; i++) {
          var p = pathToUpdate[i],
            o = _.get(configOverlay, p);
          if (o !== undefined) {
            _.set(this.gnCfg, p, o);
          }
          if (runAllChecks) {
            optionInDefaultConfig = _.get(defaultConfig, p);
            if (optionInDefaultConfig === undefined) {
              console.warn('Path ' + p + ' not found in default configuration. Check your custom configuration.', config);
            }
          }
        }
      },
      cleanConfig: function(config) {
        var pathToClean = this.getObjectKeysPaths(defaultConfig, this.stopKeyList, true);
        for(var i = 0; i < pathToClean.length; i++) {
          var p = pathToClean[i],
            optionInDefault = _.get(defaultConfig, p),
            option = _.get(config, p);
          if (option !== undefined
            && JSON.stringify(option) === JSON.stringify(optionInDefault)) {
            this.deleteValueByPath(config, p);
          }
        }
        var pathToRemove = this.getObjectKeysPaths(config, this.stopKeyList, true);
        for(var i = 0; i < pathToRemove.length; i++) {
          var p = pathToRemove[i],
            pathToken = p.split('.'),
            option = _.get(config, p);
          if (angular.isObject(option)
            && Object.keys(option).length === 0) {
            var key = pathToken.pop();
            parent = _.get(config, pathToken.join('.'));
            delete parent[key];
          }
        }
        return config;
      },
      getDefaultConfig: function() {
        return angular.copy(defaultConfig);
      },
      getProxyUrl: function() {
        return this.proxyUrl;
      },
      // Removes the proxy path and decodes the layer url,
      // so the layer can be printed with MapFish.
      // Otherwise Mapfish rejects it, due to relative url.
      getNonProxifiedUrl: function(url) {
        if (url.indexOf(this.proxyUrl) > -1) {
          return decodeURIComponent(
            url.replace(this.proxyUrl, ''));
        } else {
          return url;
        }
      }
    };
  }());

  module.constant('gnLangs', {
    langs: {},
    current: null,
    detectLang: function(detector, gnGlobalSettings) {
      // If already detected
      if (gnGlobalSettings.iso3lang) {
        return gnGlobalSettings.iso3lang;
      }

      var iso2lang, iso3lang;

      // Init language list
      this.langs =
          gnGlobalSettings.gnCfg.mods.header.languages;

      // Detect language from HTML lang tag, regex on URL
      if (detector) {
        if (detector.fromHtmlTag) {
          iso2lang = $('html').attr('lang').substr(0, 2);
        } else if (detector.regexp) {
          var res = new RegExp(detector.regexp).exec(location.pathname);
          if (angular.isArray(res)) {
            var urlLang = res[1];
            if (this.isValidIso2Lang(urlLang)) {
              iso2lang = urlLang;
            } else if (this.isValidIso3Lang(urlLang)) {
              iso2lang = this.getIso2Lang(urlLang);
            } else {
              console.warn('URL lang \'' + urlLang +
                  '\' is not a valid language code.');
            }
          }
        } else if (detector.default) {
          iso2lang = detector.default;
        }
        iso3lang = this.getIso3Lang(iso2lang || detector.default);
      }
      this.current = iso3lang || 'eng';

      // Set locale to global settings. This is
      // used by locale loader.
      gnGlobalSettings.iso3lang = this.current;
      gnGlobalSettings.lang = this.getIso2Lang(this.current);
      gnGlobalSettings.locale = {
        iso3lang: this.current
      };
      return this.current;
    },
    getCurrent: function() {
      return this.current;
    },
    isValidIso3Lang: function(lang) {
      return angular.isDefined(this.langs[lang]);
    },
    isValidIso2Lang: function(lang) {
      for (p in this.langs) {
        if (this.langs[p] === lang) {
          return true;
        }
      }
      return false;
    },
    getIso2Lang: function(iso3lang) {
      return this.langs[iso3lang] || 'en';
    },
    getIso3Lang: function(iso2lang) {
      for (p in this.langs) {
        if (this.langs[p] === iso2lang) {
          return p;
        }
      }
      return 'eng';
    }
  });

  /**
   * The catalogue controller takes care of
   * loading site information, check user login state
   * and a facet search to get main site information.
   *
   * A body-level scope makes sense for example:
   *
   *  <body ng-controller="GnCatController">
   */
  module.controller('GnCatController', [
    '$scope', '$http', '$q', '$rootScope', '$translate',
    'gnSearchManagerService', 'gnConfigService', 'gnConfig',
    'gnGlobalSettings', '$location', 'gnUtilityService',
    'gnSessionService', 'gnLangs', 'gnAdminMenu',
    'gnViewerSettings', 'gnSearchSettings', '$cookies',
    'gnExternalViewer', 'gnAlertService',
    function($scope, $http, $q, $rootScope, $translate,
             gnSearchManagerService, gnConfigService, gnConfig,
             gnGlobalSettings, $location, gnUtilityService,
             gnSessionService, gnLangs, gnAdminMenu,
             gnViewerSettings, gnSearchSettings, $cookies,
             gnExternalViewer, gnAlertService) {
      $scope.version = '0.0.1';
      var defaultNode = 'srv';

      // Links for social media
      $scope.socialMediaLink = $location.absUrl();
      $scope.getPermalink = gnUtilityService.getPermalink;
      $scope.fluidEditorLayout = gnGlobalSettings.gnCfg.mods.editor.fluidEditorLayout;
      $scope.fluidHeaderLayout = gnGlobalSettings.gnCfg.mods.header.fluidHeaderLayout;
      $scope.showGNName = gnGlobalSettings.gnCfg.mods.header.showGNName;
      $scope.isHeaderFixed = gnGlobalSettings.gnCfg.mods.header.isHeaderFixed;
      $scope.isMenubarAccessible = gnGlobalSettings.gnCfg.mods.header.isMenubarAccessible;
      $scope.isLogoInHeader = gnGlobalSettings.gnCfg.mods.header.isLogoInHeader;
      $scope.isFooterEnabled = gnGlobalSettings.gnCfg.mods.footer.enabled;

      // If gnLangs current already set by config, do not use URL
      $scope.langs = gnGlobalSettings.gnCfg.mods.header.languages;
      $scope.lang = gnLangs.detectLang(null, gnGlobalSettings);
      $scope.iso2lang = gnLangs.getIso2Lang($scope.lang);

      $scope.getSocialLinksVisible = function() {
        var onMdView =  $location.absUrl().indexOf('/metadata/') > -1;
        return !onMdView && gnGlobalSettings.gnCfg.mods.footer.showSocialBarInFooter;
      };

      $scope.getApplicationInfoVisible = function() {
        return gnGlobalSettings.gnCfg.mods.footer.showApplicationInfoAndLinksInFooter;
      };

      function detectNode(detector) {
        if (detector.regexp) {
          var res = new RegExp(detector.regexp).exec(location.pathname);
          if (angular.isArray(res)) {
            return res[1];
          }
        }
        return detector.default || defaultNode;
      }


      function detectService(detector) {
        if (detector.regexp) {
          var res = new RegExp(detector.regexp).exec(location.pathname);
          if (angular.isArray(res)) {
            return res[1];
          }
        }
        return detector.default;
      }

      function detectBaseURL(detector) {
        if (detector.regexp) {
          var res = new RegExp(detector.regexp).exec(location.pathname);
          if (angular.isArray(res)) {
            return res[1];
          }
        }
        return detector.default || 'geonetwork';
      }
      $scope.nodeId = detectNode(gnGlobalSettings.gnCfg.nodeDetector);
      $scope.isDefaultNode = $scope.nodeId === defaultNode;
      $scope.service = detectService(gnGlobalSettings.gnCfg.serviceDetector);
      $scope.redirectUrlAfterSign = window.location.href;

      gnGlobalSettings.nodeId = $scope.nodeId;
      gnGlobalSettings.isDefaultNode = $scope.isDefaultNode;
      gnConfig.env = gnConfig.env ||  {};
      gnConfig.env.node = $scope.nodeId;
      gnConfig.env.defaultNode = defaultNode;
      gnConfig.env.baseURL = detectBaseURL(gnGlobalSettings.gnCfg.baseURLDetector);

      $scope.signoutUrl = gnGlobalSettings.gnCfg.mods.authentication.signoutUrl
        + '?redirectUrl='
        + window.location.href.slice(
            0,
            window.location.href.indexOf(gnConfig.env.node) + gnConfig.env.node.length);

      // Lang names to be displayed in language selector
      $scope.langLabels = {'eng': 'English', 'dut': 'Nederlands',
        'fre': 'Français', 'ger': 'Deutsch', 'kor': '한국의',
        'spa': 'Español', 'por': 'Portuguesa', 'cat': 'Català', 'cze': 'Czech',
        'ita': 'Italiano', 'fin': 'Suomeksi', 'ice': 'Íslenska',
        'rus': 'русский', 'chi': '中文', 'slo': 'Slovenčina', 'swe': 'Svenska'};
      $scope.url = '';
      $scope.gnUrl = gnGlobalSettings.gnUrl;
      $scope.gnCfg = gnGlobalSettings.gnCfg;
      $scope.proxyUrl = gnGlobalSettings.proxyUrl;
      $scope.logoPath = gnGlobalSettings.gnUrl + '../images/harvesting/';
      $scope.isMapViewerEnabled = gnGlobalSettings.isMapViewerEnabled;
      $scope.isDebug = window.location.search.indexOf('debug') !== -1;
      $scope.isDisableLoginForm = gnGlobalSettings.isDisableLoginForm;
      $scope.isShowLoginAsLink = gnGlobalSettings.isShowLoginAsLink;
      $scope.isUserProfileUpdateEnabled = gnGlobalSettings.isUserProfileUpdateEnabled;
      $scope.isUserGroupUpdateEnabled = gnGlobalSettings.isUserGroupUpdateEnabled;
      $scope.isExternalViewerEnabled = gnExternalViewer.isEnabled();
      $scope.externalViewerUrl = gnExternalViewer.getBaseUrl();

      $scope.isSelfRegisterPossible = function() {
        return gnConfig['system.userSelfRegistration.enable'];
      };

      $scope.isHostDefined = function () {
        return gnConfig['system.feedback.mailServer.hostIsDefined'];
      };

      $scope.layout = {
        hideTopToolBar: false
      };

      /**
       * CSRF support
       */

      //Comment the following lines if you want to remove csrf support
      $http.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
      $http.defaults.xsrfCookieName = 'XSRF-TOKEN';
      $scope.$watch(function() {
        return $cookies.get($http.defaults.xsrfCookieName);
      },
      function(value) {
        $rootScope.csrf = value;
      });
      //If no csrf, ask for one:
      if (!$rootScope.csrf) {
        $http.get('../api/me');
      }
      //Comment the upper lines if you want to remove csrf support

      /**
       * Number of selected metadata records.
       * Only one selection per session is allowed.
       */
      $scope.selectedRecordsCount = 0;

      /**
       * An ordered list of profiles
       */
      $scope.profiles = ['RegisteredUser', 'Editor',
                         'Reviewer', 'UserAdmin',
                         'Administrator'];
      $scope.info = {};
      $scope.user = {};
      $rootScope.user = $scope.user;
      $scope.authenticated = false;
      $scope.initialized = false;

      /**
       * Keep a reference on main cat scope
       * @return {*}
       */
      $scope.getCatScope = function() {return $scope};

      gnConfigService.load().then(function(c) {
        // Config loaded
        if (proj4 && angular.isArray(gnConfig['map.proj4js'])) {
          angular.forEach(gnConfig['map.proj4js'], function(item) {
            proj4.defs(item.code, item.value);
          });
          ol.proj.proj4.register(proj4);
        }
      });

      // login url for inline signin form in top toolbar
      $scope.signInFormAction = '../../signin#' + $location.url();

      // when the login input have focus, do not close the dropdown/popup
      $scope.focusLoginPopup = function() {
        $('.signin-dropdown #inputUsername, .signin-dropdown #inputPassword')
            .one('focus', function() {
              $(this).parents('.dropdown-menu').addClass('show');
            });
        $('.signin-dropdown #inputUsername, .signin-dropdown #inputPassword')
            .one('blur', function() {
              $(this).parents('.dropdown-menu').removeClass('show');
            });
      };

      /**
       * Catalog facet summary providing
       * a global overview of the catalog content.
       */
      $scope.searchInfo = {};

      var defaultStatus = {
        title: '',
        link: '',
        msg: '',
        error: '',
        type: 'info',
        timeout: -1
      };

      $scope.loadCatalogInfo = function() {
        var promiseStart = $q.when('start');

        // Retrieve site information
        // TODO: Add INSPIRE, harvester, ... information
        var catInfo = promiseStart.then(function(value) {
          return $http.get('../api/site').
              success(function(data, status) {
                $scope.info = data;
                // Add the last time catalog info where updated.
                // That could be useful to append to catalog image URL
                // in order to trigger a reload of the logo when info are
                // reloaded.
                $scope.info['system/site/lastUpdate'] = new Date().getTime();
                $scope.initialized = true;
              }).
              error(function(data, status, headers, config) {
                $rootScope.$broadcast('StatusUpdated',
                   {
                     id: 'catalogueStatus',
                     title: $translate.instant('somethingWrong'),
                     msg: $translate.instant('msgNoCatalogInfo'),
                     type: 'danger'});
              });
        });

        // Utility functions for user
        var userFn = {
          isAnonymous: function() {
            return angular.isUndefined(this);
          },
          isConnected: function() {
            return !this.isAnonymous();
          },
          canCreateTemplate: function() {
            var profile = gnGlobalSettings.gnCfg.mods.editor.minUserProfileToCreateTemplate
              || '',
              fnName = (profile !== '' ?
                ('is' + profile[0].toUpperCase() + profile.substring(1) + 'OrMore') :
                '');
            return angular.isFunction(this[fnName]) ? this[fnName]() : this.isConnected();
          },
          canImportMetadata: function () {
            var profile = gnConfig['metadata.import.userprofile']
                || 'Editor',
              fnName = (profile !== '' ?
                ('is' + profile[0].toUpperCase() + profile.substring(1) + 'OrMore') :
                '');
            return angular.isFunction(this[fnName]) ? this[fnName]() : false;
          },
          canDeletePublishedMetadata: function () {
            var profile = gnConfig['metadata.delete.profilePublishedMetadata']
                || 'Editor',
              fnName = (profile !== '' ?
                ('is' + profile[0].toUpperCase() + profile.substring(1) + 'OrMore') :
                '');
            return angular.isFunction(this[fnName]) ? this[fnName]() : false;
          },

          // The md provide the information about
          // if the current user can edit records or not
          // based on record operation allowed. See edit property.
          canEditRecord: function(md) {
            if (!md || this.isAnonymous()) {
              return false;
            }

            // A second filter is for harvested record
            // if the catalogue admin defined that those
            // records could be harvested.
            if (md.isHarvested
                && JSON.parse(md.isHarvested) == true) {
              return gnConfig['system.harvester.enableEditing'] === true &&
                md.edit;
            }
            return md.edit;
          },
          // Privileges management may be allowed for harvested records.
          canManagePrivileges: function(md) {
            if (md && md.isHarvested
                && JSON.parse(md.isHarvested) == true
                && gnConfig['system.harvester.enablePrivilegesManagement'] === true
                && md.edit) {
              return true;
            }
            return this.canEditRecord(md);
          }
        };
        // Build is<ProfileName> and is<ProfileName>OrMore functions
        // This are not group specific, so not usable on metadata
        angular.forEach($scope.profiles, function(profile) {
          userFn['is' + profile] = function() {
            return profile === this.profile;
          };
          userFn['is' + profile + 'OrMore'] = function() {
            var profileIndex = $scope.profiles.indexOf(profile),
                allowedProfiles = [];
            angular.copy($scope.profiles, allowedProfiles);
            allowedProfiles.splice(0, profileIndex);
            return allowedProfiles.indexOf(this.profile) !== -1;
          };
        }
        );


        // Retrieve user information if catalog is online
        // append a random number to avoid caching in IE11
        var userLogin = catInfo.then(function(value) {
          return $http.get('../api/me?_random=' +
            Math.floor(Math.random() * 10000)).
            success(function(me, status) {
              if (angular.isObject(me)) {

                me['isAdmin'] = function(groupId) {
                  return me.admin;
                }

                angular.forEach($scope.profiles, function(profile) {
                  // Builds is<ProfileName>ForGroup methods
                  // to check the profile in the group
                  me['is' + profile + 'ForGroup'] = function(groupId) {
                    if('Administrator' == profile) {
                      return me.admin;
                    }
                    if(me['groupsWith' + profile] &&
                       me['groupsWith' + profile].indexOf(Number(groupId)) !== -1) {
                      return true;
                    }
                    return false;
                  };
                });
                angular.extend($scope.user, me);
                angular.extend($scope.user, userFn);
                $scope.authenticated = true;
              } else {
                $scope.authenticated = false;
                $scope.user = undefined;
              }
           });
        });


        // Retrieve main search information
        var searchInfo = userLogin.then(function(value) {
          // Check index status.
          $http.get('../api/site/index/status').then(function(r) {
            gnConfig['indexStatus'] = r.data;

            if (r.data.state.id.match(/^(green|yellow)$/) == null) {
              $rootScope.$broadcast('StatusUpdated', {
                id: 'indexStatus',
                title: r.data.state.title,
                error: {
                  message: r.data.message
                },
                // type: r.data.state.icon,
                type: 'danger'
              });
            } else {
              var query = {bool: {must: {query_string: {query: "+isTemplate:n"}}}};
              if (gnGlobalSettings.gnCfg.mods.search.filters) {
                query.bool.filter = gnGlobalSettings.gnCfg.mods.search.filters;
              }
              return $http.post('../api/search/records/_search',
                {size: 0,
                    track_total_hits: true,
                    query: query,
                    aggs: gnGlobalSettings.gnCfg.mods.home.facetConfig}).
              then(function(r) {
                $scope.searchInfo = r.data;
                var keys = Object.keys(gnGlobalSettings.gnCfg.mods.home.facetConfig);
                    selectedFacet = keys[0];
                for (var i = 0; i < keys.length; i ++) {
                  if ($scope.searchInfo.aggregations[keys[i]].buckets.length > 0) {
                    selectedFacet = keys[i];
                    break;
                  }
                }
                $scope.homeFacet = {
                  list: keys,
                  key: selectedFacet,
                  lastKey: keys.length > 1 ? keys[keys.length - 1] : undefined,
		              config: gnGlobalSettings.gnCfg.mods.home.facetConfig
                };
              });
            }
          });
        });
      };
      $scope.userAdminMenu = gnAdminMenu.UserAdmin;
      $scope.adminMenu = gnAdminMenu.Administrator;
      $scope.$on('loadCatalogInfo', function(event, status) {
        $scope.loadCatalogInfo();
      });

      $scope.allowPublishInvalidMd = function() {
        return gnConfig['metadata.workflow.allowPublishInvalidMd'];
      };

      $scope.$on('StatusUpdated', function(event, status) {
        var statusToApply = {};
        $.extend(statusToApply, defaultStatus, status);


        if ($scope.showHealthIndexError !== true) {
          gnAlertService.addAlert(statusToApply, statusToApply.timeout);
        }
      });

      gnSessionService.scheduleCheck($scope.user);
      $scope.session = gnSessionService.getSession();

      $scope.loadCatalogInfo();


      $scope.healthCheck = {};
      // Flag to show the health index error panel
      // By default hidden, only to be displayed if the
      // health check for the index returns an error.
      $scope.showHealthIndexError = false;

      function healthCheckStatus(r) {
        var data = r.data, isCritical = r.config.url.indexOf('critical') !== -1;
        angular.forEach(data, function(o) {
          $scope.healthCheck[o.name] = (o.status === 'OK');
        });

        if(isCritical) {
          $scope.showHealthIndexError =
            (!$scope.healthCheck) ||
            ($scope.healthCheck
              && $scope.healthCheck.IndexHealthCheck == false);
        }
      };
      $http.get('../../criticalhealthcheck')
        .then(healthCheckStatus, healthCheckStatus);
      $http.get('../../warninghealthcheck')
        .then(healthCheckStatus, healthCheckStatus);
    }]);

})();
