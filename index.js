const cssParser = require( "css" );

exports.parse = css => {
    const parsedCss = cssParser.parse( css );
    return parsedCss.stylesheet.rules.reduce( ( result, rule ) => {
        rule.selectors?.forEach( selector => result[ selector ] = ( result[ selector ] || "" ) + rule.declarations.reduce( ( result, { property, value } ) => property && value ? [ ...result, `${ property }: ${ value };` ] : result, [] ).join( " " ) );
        return result;
        // return rule.selectors ? [ ...result, [ rule.selectors, rule.declarations ] ] : result;
    }, {} );
};