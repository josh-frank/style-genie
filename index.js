const cssParser = require( "css" );

exports.parse = css => {
    const parsedCss = cssParser.parse( css );
    return parsedCss.stylesheet.rules.reduce( ( result, rule ) => {
        return rule.selectors ? [ ...result, [ rule.selectors, rule.declarations ] ] : result;
    }, [] );
};