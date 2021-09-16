const cssParser = require( "css" );

const toArray = parsedCss => {
    return Object.keys( parsedCss ).reduce( ( result, selector ) => {
        return [ ...result, [ selector, `${ selector } {
            ${ parsedCss[ selector ] }
        }` ] ];
    }, [] );
};

exports.parse = css => {
    const parsedCss = cssParser.parse( css );
    const stylesObject = parsedCss.stylesheet.rules.reduce( ( completeStyle, rule ) => {
        rule.selectors?.forEach( selector => completeStyle[ selector ] = ( completeStyle[ selector ] || "" ) + rule.declarations.reduce( ( completeRule, { property, value } ) => property && value ? [ ...completeRule, `${ property }: ${ value };` ] : completeRule, [] ).join( " " ) );
        return completeStyle;
    }, {} );
    parsedCss.stylesheet.rules.filter( rule => rule.media ).forEach( rule => {
        const mediaObject = rule.rules.reduce( ( completeMediaRule, mediaRule ) => {
            mediaRule.selectors?.forEach( selector => completeMediaRule[ selector ] = ( completeMediaRule[ selector ] || "" ) + mediaRule.declarations.reduce( ( completeRule, { property, value } ) => property && value ? [ ...completeRule, `${ property }: ${ value };` ] : completeRule, [] ).join( " " ) );
            return completeMediaRule;
        }, {} );
        stylesObject[ `@media ${ rule.media }` ] = mediaObject;
    } );
    return toArray( stylesObject );
};