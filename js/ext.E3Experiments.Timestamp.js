/**
 * E3 Timestamp Experiment Campaign Loader
 */

/*jslint white:true */
/*globals mw, $ */
$('.lastmodified').css({'font-size': '67%', position: 'static', right: 20, display: 'block' }).appendTo('#firstHeading');

(function () {
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
            var el = $( '.lastmodified' );

            $( 'a', el ).attr( 'href', function ( idx, url ) {
                return $.trackActionURL( url, 'timestamp-history-view' );
            } );

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


}());
