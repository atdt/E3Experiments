/**
 * E3 Timestamp Experiment Campaign Loader
 */

/*jslint white:true, vars:true */
/*globals mw, $ */

(function ( global ) {
    "use strict";

    // Because the LastModified extension uses inline styles, it trumps
    // stylesheets, so we need to modify it in-place.
    var style = {
        'display'   : 'block',
        'font-size' : '0.5em',
        'position'  : 'relative',
        'right'     : '0',
        'bottom'    : '0'
    };

    var event_id = 'timestamp-history-view';
    
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

    function getTrackingURL() {
        var uri = $( '#ca-history a' ).attr( 'href' );
        return $.trackActionURL( encodeURI( uri ), event_id );
    }

    function trackTimestamp() {
        $( function () {
            var el = $( '.lastmodified' );

            $( 'a', el ).attr( 'href', getTrackingURL() );
            el.css( style ).appendTo( '#firstHeading' );
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

}( this ));
