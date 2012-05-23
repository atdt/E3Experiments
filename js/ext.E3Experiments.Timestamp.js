/**
 * E3 Timestamp Experiment Campaign Loader
 */

/*jslint white:true */
/*globals mw, $ */

(function () {
    "use strict";

    function isEligible() {
        // See also ext.articleFeedback.startup.js
        return (
            !( mw.user.options.get('vector-noexperiments') )
            && mw.config.get( 'wgIsArticle' )
            && mw.config.get( 'wgNamespaceNumber' ) === 0
            && mw.config.get( 'wgAction' ).match( /view|purge/ )
            && mw.util.getParamValue( 'redirect' ) !== 'no'
            && mw.util.getParamValue( 'printable' ) !== 'yes'
            && mw.util.getParamValue( 'diff' ) === null
            && mw.util.getParamValue( 'oldid' ) === null
            // XXX: Use 'wgCategories', 'wgArticleId', and 'wgPageName' to decide
            // if we want to include this particular article in the sample.
        );
    }

    function trackTimestamp() {
        $( function () {
            $( '.lastmodified a' ).attr( 'href', function ( idx, url ) {
                return $.trackActionURL( url, 'timestamp-history-view' );
            } );
        } );
    }

    mw.activeCampaigns = mw.activeCampaigns || {};

    mw.activeCampaigns.TimestampPosition = {
        name    : 'TimestampPosition',
        version : 1,
        rates   : {
            experimental : 1,
            none         : 1
        },
        experimental : function () {
            if ( isEligible() ) {
                mw.loader.using( 'last.modified', trackTimestamp );
            }
        }
    };


}());
